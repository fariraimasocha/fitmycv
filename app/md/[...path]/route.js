import { createDualmarkRouteHandler } from "@dualmark/nextjs";
import { getDualmarkRouteConfig } from "@/lib/dualmark-pages";

const handler = createDualmarkRouteHandler(getDualmarkRouteConfig());

export const dynamic = "force-static";
export const GET = handler.GET;
export const generateStaticParams = handler.generateStaticParams;
