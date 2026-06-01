import { useState } from 'react';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaStar,
  FaEye,
  FaEdit,
  FaTrash,
  FaUsers,
  FaShoppingCart,
  FaShoppingBag
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [showBy, setShowBy] = useState('None');
  const [categoryBy, setCategoryBy] = useState('None');

  const products = [
    {
      uid: '#1',
      image: 'https://via.placeholder.com/50',
      name: 'Tops and skirt set for... Women\'s exclusive sum...',
      category: 'womans',
      brand: 'richman',
      oldPrice: '$21.00',
      price: '$21.00',
      stock: 5,
      rating: '4.9(16)',
      order: '380',
      sales: '$38k'
    },
    {
      uid: '#2',
      image: 'https://via.placeholder.com/50',
      name: 'Product Name 2',
      category: 'mens',
      brand: 'brand2',
      oldPrice: '$25.00',
      price: '$20.00',
      stock: 3,
      rating: '4.5(12)',
      order: '250',
      sales: '$25k'
    },
    {
      uid: '#3',
      image: 'https://via.placeholder.com/50',
      name: 'Product Name 3',
      category: 'kids',
      brand: 'brand3',
      oldPrice: '$30.00',
      price: '$25.00',
      stock: 4,
      rating: '4.7(20)',
      order: '420',
      sales: '$42k'
    }
  ];

  return (
    <div className="admin-dashboard">
      {/* Data Cards */}
      <div className="dashboard-cards">
        <div className="data-card green">
          <div className="card-content">
            <div className="card-header">
              <div>
                <div className="card-value">277</div>
                <div className="card-label">Total Users</div>
                <div className="card-trend">
                  <FaArrowUp className="trend-up" />
                  <span>Last Month</span>
                </div>
              </div>
              <div className="card-icon green-icon">
                <FaUsers />
              </div>
            </div>
            <div className="card-chart">
              <div className="mini-bar-chart">
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '80%'}}></div>
                <div className="bar" style={{height: '45%'}}></div>
                <div className="bar" style={{height: '90%'}}></div>
                <div className="bar" style={{height: '70%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="data-card magenta">
          <div className="card-content">
            <div className="card-header">
              <div>
                <div className="card-value">277</div>
                <div className="card-label">Total Orders</div>
                <div className="card-trend">
                  <FaArrowDown className="trend-down" />
                  <span>Last Month</span>
                </div>
              </div>
              <div className="card-icon magenta-icon">
                <FaShoppingCart />
              </div>
            </div>
            <div className="card-chart">
              <div className="mini-line-chart">
                <svg width="100%" height="40" viewBox="0 0 100 40">
                  <polyline
                    fill="none"
                    stroke="#e91e63"
                    strokeWidth="2"
                    points="0,30 20,25 40,20 60,15 80,10 100,5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="data-card blue large-card">
          <div className="card-content">
            <div className="card-main">
              <div>
                <div className="card-value-large">$3,787,681.00</div>
                <div className="card-label">Total Sales</div>
                <div className="card-subtext">$3,578.90 in last month</div>
              </div>
              <div className="card-icon blue-icon">
                <FaShoppingBag />
              </div>
            </div>
            <div className="pie-chart-container">
              <div className="pie-chart-visual">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" strokeWidth="20"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1976d2" strokeWidth="20" 
                    strokeDasharray={`${2 * Math.PI * 50 * 0.267} ${2 * Math.PI * 50}`} 
                    strokeDashoffset={-2 * Math.PI * 50 * 0.733} transform="rotate(-90 60 60)"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#42a5f5" strokeWidth="20" 
                    strokeDasharray={`${2 * Math.PI * 50 * 0.259} ${2 * Math.PI * 50}`} 
                    strokeDashoffset={-2 * Math.PI * 50 * 0.474} transform="rotate(-90 60 60)"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#90caf9" strokeWidth="20" 
                    strokeDasharray={`${2 * Math.PI * 50 * 0.171} ${2 * Math.PI * 50}`} 
                    strokeDashoffset={-2 * Math.PI * 50 * 0.303} transform="rotate(-90 60 60)"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#ff6b35" strokeWidth="20" 
                    strokeDasharray={`${2 * Math.PI * 50 * 0.303} ${2 * Math.PI * 50}`} 
                    strokeDashoffset={-2 * Math.PI * 50 * 0} transform="rotate(-90 60 60)"/>
                </svg>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{background: '#1976d2'}}></span>
                  <span>2013: 26.7%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{background: '#42a5f5'}}></span>
                  <span>2014: 25.9%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{background: '#90caf9'}}></span>
                  <span>2015: 17.1%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{background: '#ff6b35'}}></span>
                  <span>2016: 30.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="data-card blue">
          <div className="card-content">
            <div className="card-header">
              <div>
                <div className="card-value">277</div>
                <div className="card-label">Active Users</div>
                <div className="card-trend">
                  <FaArrowDown className="trend-down" />
                  <span>Last Month</span>
                </div>
              </div>
              <div className="card-icon blue-icon">
                <FaUsers />
              </div>
            </div>
            <div className="card-chart">
              <div className="mini-bar-chart">
                <div className="bar" style={{height: '50%'}}></div>
                <div className="bar" style={{height: '70%'}}></div>
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '85%'}}></div>
                <div className="bar" style={{height: '75%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="data-card yellow">
          <div className="card-content">
            <div className="card-header">
              <div>
                <div className="card-value">277</div>
                <div className="card-label">Top Rated</div>
                <div className="card-trend">
                  <FaStar className="trend-star" />
                  <span>Last Month</span>
                </div>
              </div>
              <div className="card-icon yellow-icon">
                <FaStar />
              </div>
            </div>
            <div className="card-chart">
              <div className="mini-line-chart">
                <svg width="100%" height="40" viewBox="0 0 100 40">
                  <polyline
                    fill="none"
                    stroke="#ffc107"
                    strokeWidth="2"
                    points="0,35 20,30 40,25 60,20 80,15 100,10"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Products Section */}
       {/* Best Selling Products Section */}
<div className="best-selling-section">

  <div className="section-header">
    <h2 className="section-title">Best Selling Products</h2>

   
  </div>

  <div className="filter-controls">
    
    <div className="filter-group">
      <label>SHOW BY</label>
      <select value={showBy} onChange={(e) => setShowBy(e.target.value)}>
        <option>None</option>
        <option>10</option>
        <option>20</option>
        <option>50</option>
      </select>
    </div>

    <div className="filter-group">
      <label>CATEGORY BY</label>
      <select value={categoryBy} onChange={(e) => setCategoryBy(e.target.value)}>
        <option>None</option>
        <option>Electronics</option>
        <option>Clothing</option>
        <option>Food</option>
      </select>
    </div>
  </div>

</div>


      {/* Product Table */}
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>UID</th>
              <th>PRODUCT</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>RATING</th>
              <th>ORDER</th>
              <th>SALES</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.uid}</td>
                <td>
                  <div className="product-cell">
                    <img src={product.image} alt={product.name} />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <div className="price-cell">
                    <span className="old-price">{product.oldPrice}</span>
                    <span className="new-price">{product.price}</span>
                  </div>
                </td>
                <td>
                  <div className="stock-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < product.stock ? 'star-filled' : 'star-empty'} 
                      />
                    ))}
                  </div>
                </td>
                <td>{product.rating}</td>
                <td>{product.order}</td>
                <td>{product.sales}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view"><FaEye /></button>
                    <button className="action-btn edit"><FaEdit /></button>
                    <button className="action-btn delete"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

