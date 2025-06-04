import React, { useState } from 'react';
import { createProduct } from '../services/productService';

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Ceramics',
    stock: '',
    dimensions: '',
    weight: '',
    colors: [],
    materials: [],
    care: '',
    tags: [],
    featured: false,
    new: true,
    bestseller: false,
    isActive: true
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setProduct({ ...product, [name]: checked });
    } else if (name === 'colors' || name === 'materials' || name === 'tags') {
      // Handle arrays (comma-separated values)
      setProduct({ ...product, [name]: value.split(',').map(item => item.trim()) });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };
  
  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add the image files to the product data
      const productData = {
        ...product,
        imageFiles
      };
      
      // Call the service function to create the product
      await createProduct(productData);
      
      // Reset form
      setProduct({
        name: '',
        description: '',
        price: '',
        category: 'Ceramics',
        stock: '',
        dimensions: '',
        weight: '',
        colors: [],
        materials: [],
        care: '',
        tags: [],
        featured: false,
        new: true,
        bestseller: false,
        isActive: true
      });
      setImageFiles([]);
    } catch (error) {
      console.error('Error creating product:', error);
      // Handle error (show error message, etc.)
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Product</h2>
      
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        >
          <option value="Ceramics">Ceramics</option>
          <option value="Tumblers">Tumblers</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="stock">Stock</label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="dimensions">Dimensions</label>
        <input
          type="text"
          id="dimensions"
          name="dimensions"
          value={product.dimensions}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="weight">Weight</label>
        <input
          type="text"
          id="weight"
          name="weight"
          value={product.weight}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="colors">Colors (comma-separated)</label>
        <input
          type="text"
          id="colors"
          name="colors"
          value={product.colors.join(', ')}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="materials">Materials (comma-separated)</label>
        <input
          type="text"
          id="materials"
          name="materials"
          value={product.materials.join(', ')}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="care">Care Instructions</label>
        <textarea
          id="care"
          name="care"
          value={product.care}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={product.tags.join(', ')}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="images">Product Images</label>
        <input
          type="file"
          id="images"
          name="images"
          onChange={handleImageChange}
          multiple
          accept="image/*"
          required
        />
        <small>You can select multiple images. The first image will be the primary image.</small>
      </div>
      
      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            name="featured"
            checked={product.featured}
            onChange={handleChange}
          />
          Featured Product
        </label>
      </div>
      
      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            name="new"
            checked={product.new}
            onChange={handleChange}
          />
          New Product
        </label>
      </div>
      
      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            name="bestseller"
            checked={product.bestseller}
            onChange={handleChange}
          />
          Bestseller
        </label>
      </div>
      
      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={product.isActive}
            onChange={handleChange}
          />
          Active (visible to customers)
        </label>
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
};

export default ProductForm;