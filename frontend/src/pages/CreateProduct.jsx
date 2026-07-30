import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as productService from '../services/productService';

export default function CreateProduct() {
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
      await productService.create({
        ...form,
        price: parseFloat(form.price),
        stock: form.stock ? parseInt(form.stock) : 0,
      });
      navigate('/products');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create product';
      setError(typeof message === 'string' ? message : message[0]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Create Product</h2>
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
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
}
