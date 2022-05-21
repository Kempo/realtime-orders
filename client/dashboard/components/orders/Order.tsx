import styles from '../../styles/Order.module.css';

const formatDate = (timestamp: string) => (new Date(parseInt(timestamp)));

export default function Order({ id, title, lineItems, totalPrice, createdAt }) {
  return (
    <div className={styles.order}>
      <div className={styles.timestamp}>
        <p className={styles.date}>{formatDate(createdAt).toLocaleDateString('en-US')}</p>
        <p className={styles.time}>{formatDate(createdAt).toLocaleTimeString('en-US')}</p>
      </div>
      {
        title && <p className={styles.orderTitle}>{title}</p>
      }
      <br />
      <br />
      <ul>
        {lineItems.map(lineItem => <LineItem lineItem={lineItem} />)}
        <li className={styles.price}>
          <p>{totalPrice}</p>
        </li>
      </ul>
      <br />
      <p className={styles.badge}>
        AUTHORIZED
      </p>
    </div>
  )
}

function LineItem({ lineItem }) {
  return (
    <li key={lineItem.id}>
        <p><b>{lineItem.id === -1 ? "$" : ""}{lineItem.quantity}</b> {lineItem.item.title}</p>
    </li>
  )
}