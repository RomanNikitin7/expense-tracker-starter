import { useRef, useState } from 'react'
import { categories, CATEGORY_LABELS } from '../constants.js'
import { capitalize, todayISO } from '../format.js'

function validate(description, amount) {
  const errors = {};
  if (!description.trim()) {
    errors.description = "Enter a description.";
  }
  if (amount === "") {
    errors.amount = "Enter an amount.";
  } else if (!(Number(amount) > 0)) {
    errors.amount = "Amount must be greater than 0.";
  }
  return errors;
}

function TransactionForm({ onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");
  const [errors, setErrors] = useState({});

  const descriptionRef = useRef(null);
  const amountRef = useRef(null);

  const clearError = (field) => {
    setErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = validate(description, amount);
    setErrors(found);
    if (found.description) {
      descriptionRef.current.focus();
      return;
    }
    if (found.amount) {
      amountRef.current.focus();
      return;
    }

    onAdd({
      id: Date.now(),
      description: description.trim(),
      amount: Number(amount),
      type,
      category,
      date: todayISO(),
    });

    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("food");
  };

  const messages = Object.values(errors).filter(Boolean);

  return (
    <section className="add-transaction" aria-labelledby="add-heading">
      <h2 id="add-heading">Add a transaction</h2>
      <form onSubmit={handleSubmit} noValidate>
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
            ref={descriptionRef}
            type="text"
            placeholder="What was it for?"
            value={description}
            aria-invalid={errors.description ? "true" : undefined}
            aria-describedby={errors.description ? "form-errors" : undefined}
            onChange={(e) => {
              setDescription(e.target.value);
              clearError("description");
            }}
          />
        </label>
        <label className="field field-amount">
          <span className="visually-hidden">Amount</span>
          <input
            ref={amountRef}
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            aria-invalid={errors.amount ? "true" : undefined}
            aria-describedby={errors.amount ? "form-errors" : undefined}
            onChange={(e) => {
              setAmount(e.target.value);
              clearError("amount");
            }}
          />
        </label>
        <label className="field">
          <span className="visually-hidden">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="add-btn">Add {type}</button>
      </form>

      {messages.length > 0 && (
        <div id="form-errors" className="form-errors" role="alert">
          {messages.map(message => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}
    </section>
  )
}

export default TransactionForm
