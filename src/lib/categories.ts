import { Brush, Droplets, Flower2, Hand, Leaf, Palette, Scissors, type LucideIcon } from "lucide-react";

export const SERVICE_CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
] as const;

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Haircut & Styling": Scissors,
  "Hair Coloring": Palette,
  "Hair Treatment": Droplets,
  "Facial & Skincare": Flower2,
  Makeup: Brush,
  "Manicure & Pedicure": Hand,
  "Spa & Massage": Leaf,
};
