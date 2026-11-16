export const CATEGORY_COLORS = {
  housing: "#2F5D62",
  food: "#B9822A",
  utilities: "#5468A0",
  transport: "#80538F",
  entertainment: "#B84E63",
  salary: "#4F7A3A",
  other: "#7D7F70",
};

export const categoryColor = (category) => CATEGORY_COLORS[category] || CATEGORY_COLORS.other;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

export const formatMoney = (value) => money.format(value);

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export const formatDate = (iso) => shortDate.format(new Date(iso));

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
