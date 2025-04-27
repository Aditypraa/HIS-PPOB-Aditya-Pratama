import {
  HomeIcon,
  Bolt,
  Droplet,
  Smartphone,
  Wifi,
  Utensils,
  Tv,
  Gamepad2,
  Heart,
  Package,
  CreditCard,
} from "lucide-react";

export const getFallbackIcon = (code: string) => {
  switch (code) {
    case "PAJAK":
      return HomeIcon;
    case "PLN":
      return Bolt;
    case "PDAM":
      return Droplet;
    case "PULSA":
      return Smartphone;
    case "PGN":
      return Wifi;
    case "MUSIK":
      return Utensils;
    case "TV":
      return Tv;
    case "PAKET_DATA":
      return Smartphone;
    case "VOUCHER_GAME":
      return Gamepad2;
    case "VOUCHER_MAKANAN":
      return Utensils;
    case "QURBAN":
      return Heart;
    case "ZAKAT":
      return Package;
    default:
      return CreditCard;
  }
};
