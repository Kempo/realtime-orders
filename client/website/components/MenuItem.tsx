function formatUnitPrice(unitPrice) {
  return (unitPrice / 100);
}

export default function MenuItem({ id, title, unitPrice, onQuantityUpdate }) {
  return (
    <div>
      <h4>{title}</h4>
      <p>${formatUnitPrice(unitPrice)}</p>
      <label htmlFor={`${id}-quantity`}>Quantity:</label>
      <input type="number" id={`${id}-quantity`} min={0} step={1} defaultValue={0} onChange={onQuantityUpdate(id)} />
    </div>
  )
}