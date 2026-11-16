import { useState } from 'react'
import { capitalize } from '../format.js'

function TransactionForm({ categories, onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAdd({
      id: Date.now(),
      description,
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    });

    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("food");
  };

  return (
    <section className="add-transaction" aria-labelledby="add-heading">
      <h2 id="add-heading">Add a transaction</h2>
      <form onSubmit={handleSubmit}>
        <fieldset className="toggle">
          <legend className="visually-hidden">Type</legend>
          {["expense", "income"].map(option => (
            <label key={option} className={type === option ? "toggle-option is-active" : "toggle-option"}>
              <input
                type="radio"
                name="type"
                value={option}
                checked={type === option}
                onChange={() => setType(option)}
              />
              {capitalize(option)}
            </label>
          ))}
        </fieldset>

        <label className="field field-description">
          <span className="visually-hidden">Description</span>
          <input
            type="text"
            placeholder="What was it for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="field field-amount">
          <span className="visually-hidden">Amount</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="visually-hidden">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{capitalize(cat)}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="add-btn">Add {type}</button>
      </form>
    </section>
  )
}

export default TransactionForm
