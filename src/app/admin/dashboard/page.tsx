import { getProjects } from "@/lib/project-service";
import { DashboardClient } from "@/components/admin/dashboard-client";

export default async function DashboardPage() {
  const projects = await getProjects();
  return <DashboardClient projects={projects} />;
}
