// --- Helper Functions ---
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "Rp -";
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
  } catch (e) {
    console.error("Failed to format date:", dateString, e);
    return dateString; // Return original string if formatting fails
  }
}
