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

interface MenuItemType {
  title: string;
  quantity: number;
}

export default function Order() {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    async function fetch() {
      if(params.get('id')) {
        const res = await client.query<MenuItemType[]>({
          query: FETCH_ORDER_DETAILS,
          variables: {
            sessionId: params.get('id')
          }
        })

        if(!res.error) {
          setOrder(res.data)
        }else{
          console.log(res.error.message);
        }  
      }
    }

    fetch();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.order}>
      {
        order.length === 0 ? <Error /> : <Success order={order} />
      }
      </div>
    </div>
  )
}

function Error() {
  return <p>Whoops! Something strange happened. Text {process.env.NEXT_PUBLIC_PHONE_NUMBER} for help or swing by Cedars of Lebanon!</p>
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
      <p>1319 NE 43rd St, Seattle, WA 98105</p>
      <p>(206) 632-7708</p>
    </div>
  )
}