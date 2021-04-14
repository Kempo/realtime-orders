import React, { useState } from 'react'
import { useQuery, gql, NetworkStatus } from '@apollo/client'
import Order from './Order';
import styles from '../../styles/List.module.css'

const ORDERS = gql`
  query fetchOrders {
    orders {
      title
      id
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

const INTERVAL = 3000;

export default function OrdersList() {

  const { loading, error, data, networkStatus, startPolling, stopPolling } = useQuery(ORDERS, {
    pollInterval: INTERVAL
  });

  const [pollStatus, setPolling] = useState(true);

  const togglePolling = () => {
    if(pollStatus) {
      stopPolling();
    }else{
      startPolling(INTERVAL);
    }

    setPolling(!pollStatus);
  }

  if(error || networkStatus === NetworkStatus.error) {
    return (
      <div>
        <p>Error! Please try refreshing the web page.</p>
        <p>If this keeps occurring, please call/text {process.env.NEXT_PUBLIC_PHONE_NUMBER}.</p>
      </div>
    );
  }

  if(loading) {
    return (<div>
      <h1>Loading...</h1>
      <p><b>Note:</b> starting up the website may take a few seconds.</p>
    </div>);
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.controller}>
          <p><b>Status:</b> {pollStatus ? "Active" : "Inactive"}</p>
          <button onClick={togglePolling}>Toggle</button>
        </div>
      </div>
      <div className={styles.table}>
        <ul className={styles.orders}>
          {data && data.orders.length == 0 ? <p className={styles.noOrders}>No orders.</p> : data.orders.map(order => 
            <li key={order.id} className={styles.card}>
              <Order {...order} />
            </li>
          )} 
        </ul>
      </div>
    </>
  )
}