import { useState, useEffect } from 'react';

export default function Order() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if(query.get('success')) {
      setMessage("Order confirmed!");
    }else if(query.get('cancelled')) {
      setMessage("Order cancelled.")
    }

  }, [message]);

  return (
    <div>
      <p>Status: {message}</p>
    </div>
  )
}