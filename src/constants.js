export const categories = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"];

export const CATEGORY_LABELS = {
  food: "Food",
  housing: "Housing",
  utilities: "Utilities",
  transport: "Transport",
  entertainment: "Entertainment",
  salary: "Salary",
  other: "Other",
};

// bg is a 15% tint of color, used behind the category pill in the list;
// color is the solid shade used for chart bars and the pill's dot.
export const CATEGORY_COLORS = {
  food: { bg: "rgba(185, 130, 42, 0.15)", color: "#B9822A" },
  housing: { bg: "rgba(47, 93, 98, 0.15)", color: "#2F5D62" },
  utilities: { bg: "rgba(84, 104, 160, 0.15)", color: "#5468A0" },
  transport: { bg: "rgba(128, 83, 143, 0.15)", color: "#80538F" },
  entertainment: { bg: "rgba(184, 78, 99, 0.15)", color: "#B84E63" },
  salary: { bg: "rgba(79, 122, 58, 0.15)", color: "#4F7A3A" },
  other: { bg: "rgba(125, 127, 112, 0.15)", color: "#7D7F70" },
};
