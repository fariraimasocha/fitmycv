import { getMessages } from "next-intl/server";
import RootShell from "@/components/RootShell";
import NotFoundContent from "@/components/NotFoundContent";

// Unmatched URLs. With three root layouts there is no single one to wrap a
// 404, so this page brings its own shell (experimental.globalNotFound).
export const metadata = { title: "Page not found | FitMyCV" };

export default async function GlobalNotFound() {
  const messages = await getMessages();
  return (
    <RootShell locale="en" messages={messages}>
      <NotFoundContent />
    </RootShell>
  );
}
