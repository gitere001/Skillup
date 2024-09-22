import React, { useContext } from "react";
import "./Cart.css";

const Cart = () => {
  const { cartItems, lessons_list, removeFromCart } = useContext(StoreContext);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Author</p>
          <p>Description</p>
          <p>Price</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {lessons_list.map((item, index) => {
          if (videoItems[item._id] > 0) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <p>{item.video}</p>
                  <p>{item.description}</p>
                  <p>kshs{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{0}</p>
            </div>
            <div className="cart-total-details">
              <b>Total</b>
              <b>{0}</b>
            </div>
          </div>
          <button onClick={()=>Navigate('/order')}>Proceed to checkout</button>
        </div>
        <div className="cart-promocode">
            <div>
                <p>If you have a promo code, Enter it here</p>
                <div className="cart-promocode-input">
                    <input type="text" placeholder="promo code" />
                    <button>Submit</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
