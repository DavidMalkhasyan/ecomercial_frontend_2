import { useEffect, useState, useCallback } from "react";
import API from "../api";
import ProductCard from "../components/ProductCard";

function Admin() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: "",
        price: "",
        image: null,
        category: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCategory, setNewCategory] = useState("");

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await API.get("/products");
            setProducts(res.data);

            const uniqueCategories = [
                ...new Set(res.data.map((p) => p.category).filter(Boolean)),
            ];
            setCategories(uniqueCategories);
        } catch (err) {
            setError("Ошибка сервера");
            console.error("Load products error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const add = useCallback(async () => {
        try {
            const categoryToAdd = newCategory.trim() || form.category;

            if (!form.name?.trim() || !form.price || !categoryToAdd) {
                setError("Заполните все обязательные поля!");
                return;
            }

            const formData = new FormData();
            formData.append("name", form.name.trim());
            formData.append("price", form.price);
            formData.append("category", categoryToAdd);
            if (form.image) {
                formData.append("image", form.image);
            }

            await API.post("/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setForm({ name: "", price: "", image: null, category: "" });
            setNewCategory("");
            setError(null);
            await load();
        } catch (err) {
            setError("Ошибка при добавлении продукта");
            console.error("Add product error:", err);
        }
    }, [form, newCategory, load]);

    const remove = useCallback(
        async (id) => {
            if (!window.confirm("Вы уверены?")) return;

            try {
                await API.delete(`/products/${id}`);
                await load();
            } catch (err) {
                setError("Ошибка при удалении продукта");
                console.error("Delete product error:", err);
            }
        },
        [load],
    );

    if (loading) {
        return (
            <div className="grid">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="card skeleton"></div>
                ))}
            </div>
        );
    }
    return (
        <div className="container">
            <h1>Добавить в меню</h1>

            {error && (
                <div className="error-message">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="close-error"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="form">
                <input
                    placeholder="Название"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    placeholder="Цена"
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                    }
                />

                <input
                    placeholder="Изображение"
                    type="file"
                    onChange={(e) =>
                        setForm({ ...form, image: e.target.files[0] })
                    }
                />

                <select
                    value={form.category}
                    onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                    }
                    className="category-select"
                >
                    <option value="">Выберите категорию...</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <input
                    placeholder="Или введите новую категорию"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="new-category-input"
                />

                <button onClick={add}>Добавить</button>
            </div>

            <div className="products-grid">
                {products.length > 0 ? (
                    products.map((p) => (
                        <div key={p._id} className="admin-item">
                            <ProductCard product={p} small={true} />
                            <button
                                onClick={() => remove(p._id)}
                                className="delete-btn"
                            >
                                Удалить
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Нет продуктов.</p>
                )}
            </div>
        </div>
    );
}

export default Admin;
