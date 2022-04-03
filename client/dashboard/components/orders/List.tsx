import React, { useRef } from 'react'
import { useQuery, gql, NetworkStatus } from '@apollo/client'
import Order from './Order';
import styles from '../../styles/List.module.scss'

const formatter = new Intl.NumberFormat(
  'en-US',
  { 
    style: 'currency', 
    currency: 'USD' 
  }
);

const ORDERS = gql`
  query fetchOrders {
    orders {
      title
      id
      createdAt
      totalPrice
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

const playNotification = () => {
  const audio = new Audio('notify_order.mp3');
  audio.play();
};

export default function OrdersList() {

  const modalRef = useRef<HTMLDivElement>(null);

  const { previousData, error, data, networkStatus } = useQuery(ORDERS, {
    pollInterval: INTERVAL,
    notifyOnNetworkStatusChange: true,
    onCompleted: (currentData) => {
      // Avoid object equality by comparing lengths!
       if(previousData && currentData.orders.length !== previousData.orders.length) {
         playNotification();
       }
    }
  });

  const handleClick = () => {
    if(modalRef) {
      // Hide the modal and voila!
      modalRef.current.style.display = 'none';
    }
  }

  if(error || networkStatus === NetworkStatus.error) {
    return (
      <div>
        <h1>Error! Server is not responding.</h1>
        <p>Please wait a minute or so. If this problem continues, please call/text {process.env.NEXT_PUBLIC_PHONE_NUMBER}.</p>
      </div>
    );
  }

  // If the query hasn't run before and is now running
  if(networkStatus === NetworkStatus.loading) {
    return (
      <div>
        <h1>Starting up...</h1>
        <p>Please wait for a few minutes or so.</p>
        <p>If this takes longer than a few minutes, call/text {process.env.NEXT_PUBLIC_PHONE_NUMBER}. </p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className={styles.table}>
        <ul className={styles.orders}>
          {data && data.orders.length == 0 ? 
            <p className={styles.noOrders}>No orders.</p> 
            : 
            data.orders.slice(0, 100).map(order => 
              <li key={order.id} className={styles.card}>
                <Order {...order} totalPrice={formatter.format(order.totalPrice / 100)} />
              </li>
          )} 
        </ul>
      </div>
      <div ref={modalRef} className={styles.modal}>
        <div className={styles.content}>
          <h1>Turn On Sound</h1>
          <p>Please turn on sound so you can receive alerts with new orders by clicking <b>OK</b>.</p>
          <button onClick={handleClick}><b>OK</b></button>
        </div>
      </div>
    </React.Fragment>
  )
}