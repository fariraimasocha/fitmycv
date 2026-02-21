import { redirect } from "next/navigation";

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  if (params?.checkout === "pending") {
    redirect("/api/polar/checkout");
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to FitMyCV. Get started by uploading your CV.</p>
    </div>
  );
}
