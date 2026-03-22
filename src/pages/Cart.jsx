import { memo } from "react";
import { Link } from "react-router-dom";

const Cart = memo(function Cart({ cart = [], removeFromCart, updateQuantity }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="container cart-empty">
        <h1>Корзина пуста</h1>
        <p>Добавьте товары из меню для заказа</p>
        <Link to="/" className="continue-shopping">
          Продолжить покупки
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Ваш заказ</h1>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item._id} className="cart-item">
            <div className="cart-item-image">
              <img 
                src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'} 
                alt={item.name}
              />
            </div>
            
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="item-price">{item.price} ₽</p>
            </div>

            <div className="cart-item-quantity">
              <button 
                className="qty-btn"
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
              >
                −
              </button>
              <span className="qty-display">{item.quantity}</span>
              <button 
                className="qty-btn"
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div className="cart-item-subtotal">
              <p>{item.price * item.quantity} ₽</p>
            </div>

            <button 
              className="remove-btn"
              onClick={() => removeFromCart(item._id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-total">
          <h2>Итого:</h2>
          <h2 className="total-price">{total} ₽</h2>
        </div>
        <button className="checkout-btn">Оформить заказ</button>
        <Link to="/" className="continue-link">
          Продолжить покупки
        </Link>
      </div>
    </div>
  );
});

export default Cart;
