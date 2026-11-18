import { useState } from 'react'
import { categories, CATEGORY_COLORS, CATEGORY_LABELS } from '../constants.js'
import { formatMoney, formatDate } from '../format.js'

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
];

function TransactionList({ transactions, onDelete }) {
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const handleDeleteClick = (t) => {
    if (window.confirm(`Delete "${t.description}"?`)) {
      onDelete(t.id);
    }
  };

  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }
  filteredTransactions = [...filteredTransactions].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  return (
    <section className="transactions" aria-labelledby="list-heading">
      <div className="list-header">
        <h2 id="list-heading">Transactions</h2>
        <div className="filters">
          <fieldset className="toggle toggle-small">
            <legend className="visually-hidden">Show</legend>
            {TYPE_FILTERS.map(f => (
              <label key={f.value} className={filterType === f.value ? "toggle-option is-active" : "toggle-option"}>
                <input
                  type="radio"
                  name="filter-type"
                  value={f.value}
                  checked={filterType === f.value}
                  onChange={() => setFilterType(f.value)}
                />
                {f.label}
              </label>
            ))}
          </fieldset>
          <label className="field field-small">
            <span className="visually-hidden">Category</span>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="list-empty">No transactions match these filters.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col" className="num">Amount</th>
              <th scope="col"><span className="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr key={t.id}>
                <td className="cell-date">{formatDate(t.date)}</td>
                <td className="cell-description">{t.description}</td>
                <td className="cell-category">
                  <span
                    className="category-pill"
                    style={{ background: (CATEGORY_COLORS[t.category] || CATEGORY_COLORS.other).bg }}
                  >
                    <span
                      className="swatch"
                      style={{ background: (CATEGORY_COLORS[t.category] || CATEGORY_COLORS.other).color }}
                    />
                    {CATEGORY_LABELS[t.category] || CATEGORY_LABELS.other}
                  </span>
                </td>
                <td className={t.type === "income" ? "num amount-income" : "num amount-expense"}>
                  {t.type === "income" ? "+" : "−"}{formatMoney(t.amount)}
                </td>
                <td className="cell-action">
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(t)}
                    aria-label={`Delete ${t.description}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default TransactionList
