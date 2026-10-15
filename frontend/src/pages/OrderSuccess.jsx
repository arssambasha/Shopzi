import { useParams, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Order placed! 🎉</h1>
      <p className="text-gray-600 mb-4">Order ID: {id}</p>
      <Link to="/" className="text-orange-500 underline">
        Continue shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
