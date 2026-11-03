import { iconeMarca } from "@/lib/iconeMarca";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icone() {
  return iconeMarca(size.width);
}
