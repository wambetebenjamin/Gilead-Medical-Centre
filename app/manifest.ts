import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gilead Medical Centre",
    short_name: "Gilead",
    description: "Patient-first care in Nairobi and Mombasa.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f9fc",
    theme_color: "#172b4d",
    icons: [{ src: "/images/gilead-mark.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
