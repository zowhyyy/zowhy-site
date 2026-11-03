import type { MetadataRoute } from "next";
import { urlSite } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/checkout", "/sacola", "/pedido-confirmado", "/entrar"] },
    sitemap: `${urlSite}/sitemap.xml`,
  };
}
