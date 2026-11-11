import { iconeMarca } from "@/lib/iconeMarca";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function IconeApple() {
  return iconeMarca(size.width, "icone-app.svg");
}
