import styles from '../styles/ItemSelection.module.scss';
import formatter from '../lib/dollarFormatter';
import Image from 'next/image';

function formatUnitPrice(unitPrice) {
  return formatter.format(unitPrice / 100);
}

export default function ItemSelection({ id, title, unitPrice, dietary, onQuantityUpdate }) {
  return (
    <div className={styles.item}>
      <div className={styles.title}>
        <h4>{title} {dietary.length > 0 && <VegetarianIcon />}</h4>
        <p className={styles.price}>{formatUnitPrice(unitPrice)}</p>
      </div>
      <div className={styles.selection}>
        <label htmlFor={`${id}-quantity`}>Quantity:</label>
        <input className={styles.quantityInput} type="number" id={`${id}-quantity`} min={0} step={1} defaultValue={0} onChange={onQuantityUpdate(id)} />
      </div>
    </div>
  )
}

export function VegetarianIcon() {
  return (
    <Image src="/icons/vegetarian.svg" alt="Vegetarian" width="14" height="14" />
  )
}