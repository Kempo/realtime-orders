import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import styles from '../styles/Order.module.css';
import client from '../lib/apolloClient';

const FETCH_ORDER_DETAILS = gql`
query fetchOrderDetails($sessionId: String) {
  order(sessionId: $sessionId) {
    title
		quantity
  }
}
`

interface OrderResponse {
  order: MenuItemType[];
}

interface MenuItemType {
  title: string;
  quantity: number;
}

export default function Order() {
  const [status, setStatus] = useState({
    lineItems: [],
    loading: true
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    async function fetch() {
      if(params.get('id')) {
        try {
          const res = await client.query<OrderResponse>({
            query: FETCH_ORDER_DETAILS,
            variables: {
              sessionId: params.get('id')
            }
          })

          setStatus({
            lineItems: res.data.order,
            loading: false
          });

        }catch(err) {
          setStatus({
            lineItems: [],
            loading: false
          });
        } 
      }
    }

    fetch();
  }, []);


  return (
    <div className={styles.container}>
      <div className={styles.order}>
        { 
          status.loading ? <Loading /> : (status.lineItems.length === 0 ? <Error /> : <Success order={status.lineItems} />)
        }
      </div>
    </div>
  )
}

function Error() {
  return (
    <React.Fragment>
      <h1>Whoops!</h1>
      <p>Something strange happened. <br /> Text {process.env.NEXT_PUBLIC_PHONE_NUMBER} for help or swing by Cedars of Lebanon!</p>
    </React.Fragment>
  )
}

function Loading() {
  return (
    <React.Fragment>
      <h1>Loading...</h1>
      <p>This might take a little longer than usual. Thank you for being patient!</p>
    </React.Fragment>
  );
}

function Success({ order }) {
  return (
    <React.Fragment>
      <h1 className={styles.summaryTitle}>Order Summary</h1>
      <hr />
      <h2>Thanks for supporting Cedars of Lebanon!</h2>
      <p>Orders take on average about 15 minutes to complete. <br /> Please come pick it up when you're ready. </p>
      <ContactInformation />
      <div>
        <h2>Receipt</h2>
        {
          order.length > 0 && 
          (<ul>
            {
              order.map((el: MenuItemType, i: number) => <li key={i}>{el.quantity}x {el.title}</li>)
            }
          </ul>)
        }
      </div>
    </React.Fragment>
  )
}

function ContactInformation() {
  return (
    <div>
      <h2>Address</h2>
      <p>1319 NE 43rd St, Seattle, WA 98105</p>
      <p>(206) 632-7708</p>
    </div>
  )
}