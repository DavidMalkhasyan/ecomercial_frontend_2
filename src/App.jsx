import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import Menu from "./pages/Menu";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Cart from "./pages/Cart";
import "./styles/main.css";
import LogoImage from "./assets/logo.svg";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const pingServer = () => {
      fetch('https://ecomercial-test.onrender.com/health').catch(() => {}); 
    };
    
    pingServer(); // Initial ping
    const interval = setInterval(pingServer, 10 * 60 * 1000); // Every 10 minutes
    
    return () => clearInterval(interval);
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item._id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  }, [removeFromCart]);

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-left">
            <Link to="/" className="logo">
              <img src={LogoImage} alt="Логотип" />
            </Link>
            <div className="nav-links">
              <Link to="/">Меню</Link>
              <Link to="/admin">Админка</Link>
              <Link to="/about">О нас</Link>
            </div>
          </div>

          <div className="nav-center">
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nav-search"
            />
          </div>

          <div className="nav-right">
            <Link to="/cart" className="cart-link floating-cart">
              🛒 Корзина ({cartTotal})
            </Link>
            <a href="tel:+79999999999" className="phone-number">
              📞 +7 (999) 999-99-99
            </a>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Menu searchQuery={searchQuery} cart={cart} addToCart={addToCart} updateQuantity={updateQuantity} />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;