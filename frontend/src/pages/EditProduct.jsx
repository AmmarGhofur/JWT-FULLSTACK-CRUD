import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as productService from '../services/productService';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    isAvailable: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(id);
        const product = response.data;
        setForm({
          name: product.name,
          price: product.price.toString(),
          description: product.description || '',
          category: product.category,
          stock: product.stock?.toString() || '',
          isAvailable: product.isAvailable,
        });
      } catch (err) {
        setError('Product not found');
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.price || !form.category) {
      setError('Name, price, and category are required');
      return;
    }
    setLoading(true);
    try {
      await productService.update(id, {
        ...form,
        price: parseFloat(form.price),
        stock: form.stock ? parseInt(form.stock) : 0,
      });
      navigate('/products');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update product';
      setError(typeof message === 'string' ? message : message[0]);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="container"><p>Loading product...</p></div>;

  return (
    <div className="container">
      <div className="form-card">
        <h2>Edit Product</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input name="category" value={form.category} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>
              <input name="isAvailable" type="checkbox" checked={form.isAvailable} onChange={handleChange} />
              Available
            </label>
          </div>
          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
}
