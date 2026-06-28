import React, { useRef, MutableRefObject } from 'react';
import styles from '../styles/ItemSelection.module.scss'

export function TipSelection({ id, onQuantityUpdate }) {

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
                <h4>Tip Jar</h4>
            </div>
            <div className={styles.description}>
                <p>Thank you for supporting us. Tips go directly to Cedars of Lebanon.</p>
            </div>
            <div className={styles.selection}>
                <p>Amount ($): </p>
                <button onClick={handleDecreaseQuantity}>-</button>
                <input ref={inputEl} className={styles.quantityInput} type="number" id={`${id}-quantity`} min={0} step={1} defaultValue={0} onChange={onQuantityUpdate(id)} />
                <button onClick={handleIncreaseQuantity}>+</button>
            </div>
        </div>
    )
}