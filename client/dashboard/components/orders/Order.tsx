import styles from '../../styles/Order.module.css';

const formatDate = (timestamp: string) => (new Date(parseInt(timestamp)));

export default function Order({ id, title, lineItems, createdAt }) {
  return (
    <div className={styles.order}>
      <div className={styles.timestamp}>
        <p className={styles.date}>{formatDate(createdAt).toLocaleDateString('en-US')}</p>
        <p className={styles.time}>{formatDate(createdAt).toLocaleTimeString('en-US')}</p>
      </div>
      <p className={styles.orderNumber}>#{`${id}`.padStart(3, '0')} {title && `(${title})`}</p>
      <br />
      <ul>
        {lineItems.map(lineItem => 
            <li key={lineItem.id}><p>{lineItem.quantity} {lineItem.item.title}</p></li>)}
      </ul>
      <br />
      <p className={styles.badge}>
        AUTHORIZED
      </p>
    </div>
  )
}