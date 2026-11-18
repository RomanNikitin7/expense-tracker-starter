const currency = (digits) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
});
const wholeMoney = currency(0);
const centsMoney = currency(2);

// Whole amounts read "$5,000"; anything with cents reads "$12.50", never "$12.5".
export const formatMoney = (value) => {
  const rounded = Math.round(value * 100) / 100;
  return (Number.isInteger(rounded) ? wholeMoney : centsMoney).format(rounded);
};

// Today's date in the user's local time zone (toISOString would use UTC).
export const todayISO = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export const formatDate = (iso) => shortDate.format(new Date(iso));

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
