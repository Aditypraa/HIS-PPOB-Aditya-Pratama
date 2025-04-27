export function generateDefaultAvatar(name?: string) {
  const firstChar = name ? name.charAt(0).toUpperCase() : "U";
  const bgColor = name ? "7f9cf5" : "cccccc";
  return `https://placehold.co/40x40/${bgColor}/ffffff?text=${firstChar}`;
}
