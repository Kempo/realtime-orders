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
        <p>Error! Please try refreshing.</p>
        <p>If this keep occurring, please call/text {process.env.NEXT_PUBLIC_PHONE_NUMBER}.</p>
      </div>
    );
  }

  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>
        <p>Status: {pollStatus ? "Active" : "Inactive"}</p>
      </div>
      <div>
        <button onClick={togglePolling}>Toggle</button>
      </div>
      <div className={styles.table}>
        <ul className={styles.orders}>
        {data && data.orders.map(order => 
          <li key={order.id} className={styles.card}>
            <Order {...order} />
          </li>
        )}
        </ul>
      </div>
    </div>
  )
}