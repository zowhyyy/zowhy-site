/** Endereço público do site, usado na prévia de link, no sitemap e no robots. Na publicação, defina NEXT_PUBLIC_SITE_URL. */
export const urlSite = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
