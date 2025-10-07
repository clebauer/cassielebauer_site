import React, {useState} from 'react';

function Home({ status }) {
  const [isOn, setIsOn] = useState(false);
  return (
    <>
      <h1>hi there, Cassie here.</h1>
      <p>have some nifty gifties!</p>
      {status && <p>Status: {status}</p>}

      <button onClick={() => setIsOn(!isOn)} className={isOn ? "button on" : "button"}>
            {isOn ? "ON" : "OFF"}
        </button>
    </>
  )
}

export default Home;
