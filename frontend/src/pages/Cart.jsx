import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import ImageWithFallback from '../components/ImageWithFallback.jsx';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-10">
        <p>Your cart is empty.</p>
        <Link to="/" className="text-orange-500 underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>
      {cartItems.map((item) => (
        <div key={item._id} className="flex items-center gap-4 border-b py-3">
          <ImageWithFallback src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
          <div className="flex-1">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">₹{item.price}</p>
          </div>
          <input
            type="number"
            min="1"
            value={item.qty}
            onChange={(e) => updateQty(item._id, Number(e.target.value))}
            className="border rounded px-2 py-1 w-16"
          />
          <button onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm">
            Remove
          </button>
        </div>
      ))}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-bold">Total: ₹{cartTotal}</p>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;