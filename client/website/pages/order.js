import { useState, useEffect } from 'react';
import client from '../lib/apolloClient';
import { gql } from '@apollo/client';

const FETCH_ORDER_DETAILS = gql`
query fetchOrderDetails($sessionId: String) {
  order(sessionId: $sessionId) {
    title
		quantity
  }
}
`

export default function Order() {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    async function fetch() {
      if(params.get('id')) {
        const { data } = await client.query({
          query: FETCH_ORDER_DETAILS,
          variables: {
            sessionId: params.get('id')
          }
        }).catch(error => {
          console.log(error);
        })
  
        setOrder(data.order)
      }
    }

    fetch();
  }, []);

  if(order.length === 0) {
    return <p>Whoops! Something strange happened. Text {process.env.NEXT_PUBLIC_PHONE_NUMBER} for help or swing by Cedars of Lebanon!</p>
  }

  return (
    <div>
      <h1>Order Summary</h1>
      <p>Thanks for supporting Cedars of Lebanon! <br /> Orders take on average about 15 minutes to complete. Please come pick it up when you're ready. </p>
      <div>
        {
          order.length > 0 && 
          (<ul>
            {
              order.map((el, i) => <li key={i}>{el.quantity}x {el.title}</li>)
            }
          </ul>)
        }
      </div>
    </div>
  )
}