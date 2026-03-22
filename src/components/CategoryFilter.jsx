import { memo } from "react";

const CategoryFilter = memo(function CategoryFilter({ categories, active, setActive }) {
  return (
    <div className="filters">
      <select
        value={active}
        onChange={e => setActive(e.target.value)}
        className="category-select"
      >
        {categories.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
});

export default CategoryFilter;