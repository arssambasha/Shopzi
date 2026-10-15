import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { CategoriesContext } from '../context/CategoriesContext.jsx';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { userInfo, logout } = useContext(AuthContext);
  const { categories } = useContext(CategoriesContext);
  const navigate = useNavigate();
  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (category !== 'All') params.set('category', category);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <nav className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6">
      <Link to="/" className="text-xl font-bold shrink-0 order-1">
        amazon<span className="text-orange-400">clone</span>
      </Link>

      <form
        onSubmit={handleSearch}
        className="order-3 sm:order-2 w-full sm:flex-1 flex sm:justify-center"
      >
        <div className="flex w-full sm:max-w-2xl">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-16 bg-slate-200 text-slate-900 text-xs sm:text-sm px-1.5 sm:px-2 rounded-l border-r border-slate-400 focus:outline-none max-w-[90px] sm:max-w-none"
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products..."
            className="flex-1 min-w-0 px-3 py-1.5 text-slate-900 focus:outline-none"
          />
          <button type="submit" className="w-10 bg-orange-400 hover:bg-orange-500 rounded-r">
            🔍
          </button>
        </div>
      </form>

      <div className="order-2 sm:order-3 flex items-center gap-4 sm:gap-6 shrink-0 ml-auto sm:ml-0">
        <Link to="/cart" className="relative">
          Cart
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-orange-500 text-xs rounded-full px-1.5">
              {itemCount}
            </span>
          )}
        </Link>
        {userInfo ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Hi, {userInfo.name}</span>
            <button onClick={logout} className="text-sm underline">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;