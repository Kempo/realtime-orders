import styles from '../styles/MenuItem.module.css';

function formatUnitPrice(unitPrice) {
  return (unitPrice / 100);
}

export default function MenuItem({ id, title, unitPrice, onQuantityUpdate, description }) {
  return (
    <div className={styles.item}>
      <h4>{title}</h4>
      <p className={styles.description}>{description}</p>
      <p className={styles.price}>${formatUnitPrice(unitPrice)}</p>
      <div className={styles.selection}>
        <label htmlFor={`${id}-quantity`}>Quantity:</label>
        <input className={styles.quantityInput} type="number" id={`${id}-quantity`} min={0} step={1} defaultValue={0} onChange={onQuantityUpdate(id)} />
      </div>
    </div>
  )
}