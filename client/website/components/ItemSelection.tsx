import Image from 'next/image';
import { MutableRefObject, useRef } from 'react';
import styles from '../styles/ItemSelection.module.scss';
import formatter from '../lib/dollarFormatter';

function formatUnitPrice(unitPrice) {
  return formatter.format(unitPrice / 100);
}

export default function ItemSelection({ id, title, unitPrice, dietary, onQuantityUpdate, description, isStarred }) {

  const inputEl: MutableRefObject<HTMLInputElement> = useRef(null);

  function handleIncreaseQuantity() {
    if(inputEl) {
      inputEl.current.stepUp();
      onQuantityUpdate(id)({
        target: { 
          value: inputEl.current.value
        }
      });
    }
  }

  function handleDecreaseQuantity() {
    if(inputEl) {
      inputEl.current.stepDown();
      onQuantityUpdate(id)({
        target: { 
          value: inputEl.current.value
        }
      });
    }
  }

  return (
    <div className={styles.item}>
      <div className={styles.title}>
        <h4>{title} {dietary.length > 0 && <VegetarianIcon />} {isStarred && `⭐`}</h4>
        <p className={styles.price}>{formatUnitPrice(unitPrice)}</p>
      </div>
      <div className={styles.description}>
        <p>{description}</p>
      </div>
      <div className={styles.selection}>
        <p>Quantity:</p>
        <button onClick={handleDecreaseQuantity}>-</button>
        <input ref={inputEl} className={styles.quantityInput} type="number" id={`${id}-quantity`} min={0} max={10} step={1} defaultValue={0} onChange={onQuantityUpdate(id)} />
        <button onClick={handleIncreaseQuantity}>+</button>
      </div>
    </div>
  )
}

export function VegetarianIcon() {
  return (
    <Image src="/icons/vegetarian.svg" alt="Vegetarian" width="14" height="14" />
  )
}