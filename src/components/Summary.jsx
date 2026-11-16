import { categoryColor, formatMoney, capitalize } from '../format.js'

function Summary({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions.filter(t => t.type === "expense");
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const byCategory = {};
  expenses.forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });
  const segments = Object.entries(byCategory)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);

  // The band represents whichever is larger, so overspending still fits.
  const scale = Math.max(totalIncome, totalExpenses) || 1;
  const pct = (value) => `${(value / scale) * 100}%`;

  const headline = balance >= 0
    ? `${formatMoney(balance)} left of ${formatMoney(totalIncome)}`
    : `${formatMoney(-balance)} over your ${formatMoney(totalIncome)} income`;

  return (
    <section className="summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className={balance < 0 ? "headline headline-over" : "headline"}>
        {headline}
      </h2>
      <p className="summary-detail">
        {formatMoney(totalIncome)} in, {formatMoney(totalExpenses)} spent
      </p>

      <div className="band" role="img" aria-label={`Spending by category: ${segments.map(([c, v]) => `${c} ${formatMoney(v)}`).join(", ") || "none"}`}>
        {segments.map(([category, value]) => (
          <span
            key={category}
            className="band-segment"
            style={{ width: pct(value), background: categoryColor(category) }}
            title={`${capitalize(category)}: ${formatMoney(value)}`}
          />
        ))}
        {balance > 0 && (
          <span className="band-segment band-left" style={{ width: pct(balance) }} />
        )}
      </div>

      {segments.length === 0 ? (
        <p className="legend-empty">No expenses yet. Add one below to see where your money goes.</p>
      ) : (
        <ul className="legend">
          {segments.map(([category, value]) => (
            <li key={category}>
              <span className="swatch" style={{ background: categoryColor(category) }} />
              <span className="legend-name">{capitalize(category)}</span>
              <span className="legend-value">{formatMoney(value)}</span>
            </li>
          ))}
          {balance > 0 && (
            <li>
              <span className="swatch swatch-left" />
              <span className="legend-name">Left</span>
              <span className="legend-value">{formatMoney(balance)}</span>
            </li>
          )}
        </ul>
      )}
    </section>
  )
}

export default Summary
