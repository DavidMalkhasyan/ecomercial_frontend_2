import { useEffect, useState, useCallback, useMemo } from "react";
import API from "../api";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";

function Menu({ searchQuery = "", cart = [], addToCart, updateQuantity }) {
    const [products, setProducts] = useState([]);
    const [active, setActive] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState("name-asc");
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await API.get("/products");
            setProducts(res.data);
        } catch (err) {
            setError("Ошибка сервера");
            console.error("Fetch products error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const categories = useMemo(
        () => ["Категории", ...new Set(products.map((p) => p.category))],
        [products],
    );

    const filtered = useMemo(() => {
        return products
            .filter((p) => active === "All" || p.category === active)
            .filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .sort((a, b) => {
                switch (sortBy) {
                    case "name-asc":
                        return a.name.localeCompare(b.name);
                    case "name-desc":
                        return b.name.localeCompare(a.name);
                    case "price-asc":
                        return a.price - b.price;
                    case "price-desc":
                        return b.price - a.price;
                    default:
                        return 0;
                }
            });
    }, [products, active, searchQuery, sortBy]);

    const handleSort = useCallback((type) => {
        setSortBy(type);
        setShowSortMenu(false);
    }, []);

    const handleRetry = useCallback(() => {
        setError(null);
        fetchProducts();
    }, [fetchProducts]);

    if (loading) {
        return (
            <div className="grid">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="card skeleton"></div>
                ))}
            </div>
        );
    }
    if (error)
        return (
            <div className="container">
                <h1>{error}</h1>
                <button onClick={handleRetry} className="retry-btn">
                    Повторить
                </button>
            </div>
        );

    return (
        <div className="container">
            <h1>Меню</h1>
            <div className="filters-container">
                <button
                    className="mobile-toggle"
                    onClick={() => setFiltersOpen((prev) => !prev)}
                >
                    Фильтры и сортировка
                </button>

                <div className={`filters-wrapper ${filtersOpen ? "open" : ""}`}>
                    <div className="filters">
                        <div className="left-filters">
                            <CategoryFilter
                                categories={categories}
                                active={active}
                                setActive={setActive}
                            />
                        </div>
                    </div>

                    <div className="sort-dropdown">
                        <button
                            onClick={() => setShowSortMenu((prev) => !prev)}
                            className="sort-toggle"
                        >
                            Сортировка
                        </button>

                        {showSortMenu && (
                            <div className="sort-menu">
                                <button onClick={() => handleSort("name-asc")}>
                                    А-Я
                                </button>
                                <button onClick={() => handleSort("name-desc")}>
                                    Я-А
                                </button>
                                <button onClick={() => handleSort("price-asc")}>
                                    Цена ↑
                                </button>
                                <button
                                    onClick={() => handleSort("price-desc")}
                                >
                                    Цена ↓
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid">
                {filtered.length > 0 ? (
                    filtered.map((p) => {
                        const cartItem = cart.find(
                            (item) => item._id === p._id,
                        );
                        return (
                            <ProductCard
                                key={p._id}
                                product={p}
                                quantity={cartItem?.quantity || 0}
                                onAddToCart={addToCart}
                                onUpdateQuantity={updateQuantity}
                            />
                        );
                    })
                ) : (
                    <p>Нет доступных продуктов.</p>
                )}
            </div>
        </div>
    );
}

export default Menu;
