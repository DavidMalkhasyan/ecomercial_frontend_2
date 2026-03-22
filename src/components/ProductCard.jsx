import { memo } from "react";

const ProductCard = memo(function ProductCard({ product, small = false, quantity = 0, onAddToCart, onUpdateQuantity }) {
  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  const handleIncrease = () => {
    onUpdateQuantity?.(product._id, quantity + 1);
  };

  const handleDecrease = () => {
    onUpdateQuantity?.(product._id, quantity - 1);
  };

  return (
    <div className={`card ${small ? 'small' : ''}`}>
      <img 
        src={product.image || 'https://via.placeholder.com/250x200?text=No+Image'} 
        alt={product.name}
        loading="lazy"
      />
      <h3>{product.name}</h3>
      <p className="price">{product.price} ₽</p>
      
      {!small && (
        <div className="card-actions">
          {quantity === 0 ? (
            <button className="add-btn" onClick={handleAddToCart}>
              Добавить
            </button>
          ) : (
            <div className="quantity-control">
              <button className="qty-btn" onClick={handleDecrease}>−</button>
              <span className="qty-display">{quantity}</span>
              <button className="qty-btn" onClick={handleIncrease}>+</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default ProductCard;