import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../constants.js'
import { formatMoney } from '../format.js'
import { summarize } from '../summary.js'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{CATEGORY_LABELS[label] || label}</p>
        <p className="chart-tooltip-value">{formatMoney(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

// Each bar takes its category's color (the `shape` prop replaces the deprecated <Cell>).
const CategoryBar = (props) => <Rectangle {...props} fill={(CATEGORY_COLORS[props.payload.name] || CATEGORY_COLORS.other).color} />

function SpendingChart({ transactions }) {
  const data = summarize(transactions).segments.map(([name, value]) => ({ name, value }))

  return (
    <section className="chart" aria-labelledby="chart-heading">
      <h2 id="chart-heading">Spending by category</h2>
      {data.length === 0 ? (
        <p className="chart-empty">No expenses yet. Add one below to see where your money goes.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickFormatter={(name) => CATEGORY_LABELS[name] || name} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatMoney(value)} width={64} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Spent" radius={[4, 4, 0, 0]} shape={CategoryBar} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}

export default SpendingChart
