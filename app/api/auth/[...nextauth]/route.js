import { handlers } from "@/lib/auth";

function sendDebugLog(location, message, data, hypothesisId) {
  const payload = {
    sessionId: "2ae789",
    location,
    message,
    data,
    timestamp: Date.now(),
    hypothesisId,
    runId: "pre-fix",
  };
  // #region agent log
  fetch("http://127.0.0.1:7261/ingest/793c915b-9566-44f0-bafe-da689dd0cf13", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "2ae789",
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
  // #endregion
  console.error("[auth-debug]", JSON.stringify(payload));
}

function inspectAuthRequest(request) {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieNames = cookieHeader
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter(Boolean);
  const userAgent = request.headers.get("user-agent") || "";
  const isChrome = /Chrome\//.test(userAgent) && !/Edg\//.test(userAgent);
  const isSafari =
    /Safari\//.test(userAgent) && !/Chrome\//.test(userAgent);

  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim?.() ?? "";
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim?.() ?? "";

  return {
    pathname: url.pathname,
    action: url.pathname.split("/").pop(),
    query: Object.fromEntries(url.searchParams),
    host: request.headers.get("host"),
    forwardedHost: request.headers.get("x-forwarded-host"),
    forwardedProto: request.headers.get("x-forwarded-proto"),
    browser: isChrome ? "chrome" : isSafari ? "safari" : "other",
    cookieNames,
    hasPkceCookie: cookieNames.some((n) => n.includes("pkce")),
    hasStateCookie: cookieNames.some((n) => n.includes("authjs.state")),
    hasCallbackUrlCookie: cookieNames.some((n) => n.includes("callback-url")),
    hasSessionCookie: cookieNames.some((n) => n.includes("session-token")),
    hasAuthSecret: Boolean(process.env.AUTH_SECRET?.length),
    hasGoogleClientId: Boolean(googleClientId),
    hasGoogleClientSecret: Boolean(googleClientSecret),
    googleClientIdLength: googleClientId.length,
    authUrlSet: Boolean(process.env.AUTH_URL),
    authUrlHost: process.env.AUTH_URL
      ? (() => {
          try {
            return new URL(process.env.AUTH_URL).host;
          } catch {
            return "invalid";
          }
        })()
      : null,
    nodeEnv: process.env.NODE_ENV,
  };
}

async function wrapHandler(handler, request, context) {
  const info = inspectAuthRequest(request);
  sendDebugLog(
    "route.js:wrapHandler:entry",
    "auth request received",
    info,
    info.action === "callback" ? "H3-H5" : "H1-H2"
  );

  const response = await handler(request, context);

  sendDebugLog(
    "route.js:wrapHandler:exit",
    "auth response",
    {
      status: response.status,
      location: response.headers.get("location"),
      browser: info.browser,
      action: info.action,
    },
    "H1-H5"
  );

  return response;
}

export async function GET(request, context) {
  return wrapHandler(handlers.GET, request, context);
}

export async function POST(request, context) {
  return wrapHandler(handlers.POST, request, context);
}
