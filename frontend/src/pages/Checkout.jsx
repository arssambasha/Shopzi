import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import { loadRazorpayScript } from '../utils/loadRazorpay.js';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPaying(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Could not load payment gateway. Check your connection.');
        setPaying(false);
        return;
      }

      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
      }));
      const shippingAddress = { address, city, postalCode, country };

      const { data: razorpayOrder } = await api.post('/payment/create-order', {
        amount: cartTotal,
      });

      const options = {
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Amazon Clone',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        prefill: {
          name: userInfo?.name,
          email: userInfo?.email,
        },
        theme: { color: '#f97316' },
        handler: async (response) => {
          try {
            const { data } = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderItems,
              shippingAddress,
              totalPrice: cartTotal,
            });
            clearCart();
            navigate(`/order-success/${data._id}`);
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed');
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(response.error?.description || 'Payment failed');
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start payment');
      setPaying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-4">Shipping Details</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={placeOrder} className="space-y-4">
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />
        <p className="font-bold">Total: ₹{cartTotal}</p>
        <button
          disabled={paying}
          className="bg-orange-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        >
          {paying ? 'Processing...' : 'Pay & Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;