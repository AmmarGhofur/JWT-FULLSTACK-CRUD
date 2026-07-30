import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as productService from '../services/productService';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productService.getAll();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.remove(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  if (loading) return <div className="container"><p>Loading products...</p></div>;

  return (
    <div className="container">
      <div className="header-row">
        <h2>Products</h2>
        <Link to="/products/create" className="btn">Add Product</Link>
      </div>
      {error && <div className="error">{error}</div>}
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>{product.isAvailable ? 'Yes' : 'No'}</td>
                <td>
                  <Link to={`/products/edit/${product._id}`} className="btn btn-sm">Edit</Link>
                  <button onClick={() => handleDelete(product._id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
