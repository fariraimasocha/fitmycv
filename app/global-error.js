"use client";

// Catches errors thrown in the root layout itself, which app/error.js
// cannot reach. Without this file Next renders its plain "This page
// couldn't load" fallback with no site chrome. This boundary replaces the
// whole document, so it carries its own <html> and inline styles.
import { useEffect } from "react";

const STYLES = `
  body { margin: 0; background: #f7f4ef; color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .card { max-width: 520px; width: 100%; text-align: center; }
  .brand { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #5c5c5c; }
  h1 { font-size: 40px; line-height: 1.1; font-weight: 400; color: #1a1a1a; margin: 24px 0 0; }
  p { font-size: 18px; line-height: 1.6; font-weight: 600; color: #5c5c5c; margin: 16px 0 0; }
  .actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 28px; }
  a, button { font: inherit; }
  .btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid #1a1a1a; background: #1a1a1a; color: #f7f4ef; }
  .btn-secondary { background: #ffffff; color: #1a1a1a; border-color: #e3ddd4; }
  footer { margin-top: 28px; font-size: 13px; font-weight: 600; color: #5c5c5c; }
  footer a { color: #1a1a1a; font-weight: 700; }
`;

export default function GlobalError({ error }) {
  useEffect(() => {
    console.error("Global page error:", error);
  }, [error]);

  const handleReload = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("retry", String(Date.now()));
    window.location.assign(url.toString());
  };

  return (
    <html lang="en">
      <head>
        <title>FitMyCV | This page didn&apos;t load</title>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      </head>
      <body>
        <div className="wrap">
          <div className="card">
            <span className="brand">FitMyCV</span>
            <h1>This page didn&apos;t load</h1>
            <p>Something on our side failed. Try again, or go back to the homepage.</p>
            <div className="actions">
              <button type="button" className="btn" onClick={handleReload}>
                Try again
              </button>
              <a href="/" className="btn btn-secondary">
                Go to the homepage
              </a>
            </div>
            <footer>
              If this keeps happening, <a href="/support">reach support</a>.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}