const toCents = (amount) => Math.round(amount * 100);

// Sums in integer cents so 0.1 + 0.2 does not leave floating-point dust that
// could draw a phantom "Left" segment or flip the balance sign.
export function summarize(transactions) {
  let income = 0;
  let expenses = 0;
  const byCategory = {};

  for (const t of transactions) {
    const cents = toCents(t.amount);
    if (t.type === "income") {
      income += cents;
    } else if (t.type === "expense") {
      expenses += cents;
      byCategory[t.category] = (byCategory[t.category] || 0) + cents;
    }
  }

  const segments = Object.entries(byCategory)
    .filter(([, cents]) => cents > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([category, cents]) => [category, cents / 100]);

  return {
    income: income / 100,
    expenses: expenses / 100,
    balance: (income - expenses) / 100,
    segments,
  };
}
