import { formatMoney } from '../format.js'
import { summarize } from '../summary.js'

function Summary({ transactions }) {
  const { income, expenses, balance } = summarize(transactions);

  const headline = balance >= 0
    ? `${formatMoney(balance)} left of ${formatMoney(income)}`
    : `${formatMoney(-balance)} over your ${formatMoney(income)} income`;

  return (
    <section className="summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className={balance < 0 ? "headline headline-over" : "headline"}>
        {headline}
      </h2>
      <p className="summary-detail">
        {formatMoney(income)} in, {formatMoney(expenses)} spent
      </p>
    </section>
  )
}

export default Summary
