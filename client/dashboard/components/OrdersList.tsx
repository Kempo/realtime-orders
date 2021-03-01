import React from 'react'
import { useQuery, gql, NetworkStatus } from '@apollo/client'
import styles from '../styles/Orders.module.css'

const ORDERS = gql`
  query fetchOrders {
    orders {
      title
      id
      isReady
      createdAt
      lineItems {
        id
        quantity
        item {
          title
        }
      }
    }
  }
`;

export default function OrdersList() {

  const { loading, error, data, networkStatus } = useQuery(ORDERS, {
    pollInterval: 1000
  });

  if(error) {
    return (
      <div>
        <p>Error! Please try refreshing.</p>
      </div>
    );
  }

  if(loading) {
    return <div>Loading</div>
  }

  return (
    <div className={styles.table}>
      {/*<p>Status: {networkStatus == NetworkStatus.refetch ? "Refetching..." : "Ready."}</p>*/}
      <ul className={styles.orders}>
      {data && data.orders.map(order => 
        <li key={order.id} className={styles.card}>
          <h3 className={styles.orderTitle}>Order {order.id} ({order.title})</h3>
          {order.lineItems.map(lineItem => 
          <p key={lineItem.id}>{lineItem.quantity}x {lineItem.item.title}</p>)}
        </li>
      )}
      </ul>
    </div>
  )
}