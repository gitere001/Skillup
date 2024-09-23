import React from "react";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  return (
    <form className="place-order" action="">
      <div className="plcae-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last name" />
        </div>
        <input type="text" placeholder="Email address" /po
      </div>
    </form>
  );
};

export default PlaceOrder;
