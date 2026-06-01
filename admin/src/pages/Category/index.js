import { useEffect, useState } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from "react-router-dom";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext } from "react";
import { Pagination } from '@mui/material';
import { Mycontext } from '../../../src/AdminApp';
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
import './Category.css';
import { deletedata, Editdata, fetchDataFromAPI } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

const Category = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const [open, setOpen] = React.useState(false);
  const [catdata, setcatdata] = useState([])

  const context = useContext(Mycontext)
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [editid, seteditid] = useState({})
  const [editFields, seteditFields] = useState({
    name: "",
    images: [""],
    color: ""
  })

  const handleClose = () => {
    setOpen(false);
  };

  const categoryeditfun = (e) => {
    e.preventDefault();
    setisloading(true)
    Editdata(`/api/category/${editid}`, editFields).then((res) => {
      console.log(res);
      fetchDataFromAPI(`/api/category/${editid}`).then(res => {

        loadCategories();

        setisloading(false);
        setOpen(false);
        console.log(res);

      });


    })

  }


  const changesubmit = (e) => {
    seteditFields({
      ...editFields,
      [e.target.name]: e.target.value
    })

  }
  const handlechange=(event,value)=>{
    
    fetchDataFromAPI(`/api/category?page=${value}`).then(res => {
      setcatdata(res);
    })
  }
  const addImageurl = (e) => {
    const arr = [];
    arr.push(e.target.value);
    seteditFields({
      ...editFields,
      images: arr
    })
  }
  const openImagePreview = (img) => {
    setPreviewImg(img);
    setPreviewOpen(true);
  };
  


  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData).entries());
    const email = formJson.email;
    console.log(email);
    categoryeditfun(event);

    handleClose();
  };



  const handleClickOpen = () => {
    setOpen(true);
  };


  // ==============================================================




  const loadCategories = () => {

    fetchDataFromAPI('/api/category/').then(res => {
      setcatdata(res);
      console.log(res);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setProgress(20)
    fetchDataFromAPI('/api/category/').then(res => {
      setcatdata(res);
      context.setProgress(100);
      console.log(res);
    });
  }, []);



  const [showBy, setShowBy] = useState('None');
  const [categoryBy, setCategoryBy] = useState('None');
  const deletecat = (id) => {
    deletedata(`/api/category/${id}`).then((res) => {
      loadCategories();

    })

  }







  const addme = (id) => {
    setOpen(true);
    seteditid(id)
    fetchDataFromAPI(`/api/category/${id}`).then(res => {
      seteditFields(res)


      console.log(res);
    });
  }



  const products = [
    {
      uid: '#1',
      image: 'https://images.pexels.com/photos/10975893/pexels-photo-10975893.jpeg',
      name: 'Tops and skirt',
      category: 'womans',

    },
    {
      uid: '#2',
      image: 'https://images.pexels.com/photos/29146265/pexels-photo-29146265.jpeg',
      name: 'Product Name 2',
      category: 'mens',

    },
    {
      uid: '#3',
      image: 'https://images.pexels.com/photos/30236244/pexels-photo-30236244.jpeg',
      name: 'Product Name 3',
      category: 'kids',

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
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '80%' }}></div>
                <div className="bar" style={{ height: '45%' }}></div>
                <div className="bar" style={{ height: '90%' }}></div>
                <div className="bar" style={{ height: '70%' }}></div>
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
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" strokeWidth="20" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1976d2" strokeWidth="20"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.267} ${2 * Math.PI * 50}`}
                    strokeDashoffset={-2 * Math.PI * 50 * 0.733} transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#42a5f5" strokeWidth="20"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.259} ${2 * Math.PI * 50}`}
                    strokeDashoffset={-2 * Math.PI * 50 * 0.474} transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#90caf9" strokeWidth="20"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.171} ${2 * Math.PI * 50}`}
                    strokeDashoffset={-2 * Math.PI * 50 * 0.303} transform="rotate(-90 60 60)" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#ff6b35" strokeWidth="20"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.303} ${2 * Math.PI * 50}`}
                    strokeDashoffset={-2 * Math.PI * 50 * 0} transform="rotate(-90 60 60)" />
                </svg>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#1976d2' }}></span>
                  <span>2013: 26.7%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#42a5f5' }}></span>
                  <span>2014: 25.9%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#90caf9' }}></span>
                  <span>2015: 17.1%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#ff6b35' }}></span>
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
                <div className="bar" style={{ height: '50%' }}></div>
                <div className="bar" style={{ height: '70%' }}></div>
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '85%' }}></div>
                <div className="bar" style={{ height: '75%' }}></div>
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
      <div className="best-selling-section">
      <h2 className="section-title mb-2">Best Selling Products</h2>
        <div className='d-flex align-items-center ml-auto'>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg,#4e6bff,#6c8cff)",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                background: "linear-gradient(135deg,#3d57e0,#5b79ff)"
              }
            }}
            onClick={() => {

              navigate("/category/upload");
            }}
          >
            + Add Category
          </Button>
        </div>
      

        
      </div>

      {/* Product Table */}
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>UID</th>
              <th>PRODUCT</th>

              <th>IMAGE</th>
              <th>COLOR</th>

              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {

              catdata?.categoryList?.length > 0 && catdata?.categoryList.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="product-cell">

                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <img
                      src={item.images[0]}
                      style={{ cursor: "zoom-in", borderRadius: "6px" }}
                     
                    />


                  </td>

                  <td>
                    <span>{item.color}</span>
                  </td>



                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" onClick={() => openImagePreview(item.images[0])}><FaEye /></button>
                      <button className="action-btn edit" onClick={() => addme(item.id)}><FaEdit /></button>
                      <button className="action-btn delete" onClick={() => deletecat(item.id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))

            }





          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>EDIT CATEGORY</DialogTitle>
        <DialogContent>
          <DialogContentText>
            please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Edit name"
              type="text"
              fullWidth
              value={editFields.name}
              onChange={changesubmit}
            />

            <TextField
              autoFocus
              required
              margin="dense"
              id="image"
              name="image"
              label="Edit image"
              type="text"
              fullWidth
              value={editFields.images}

              onChange={addImageurl}

            />



            <TextField
              autoFocus
              required
              margin="dense"
              id="color"
              name="color"
              label="Edit color"
              type="text"
              fullWidth
              value={editFields.color}
              onChange={changesubmit}

            />
            <br />  <br />  <br />







          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit" form="subscription-form"


          >
            {
              isloading === true ? <CircularProgress /> : "submit"
            }

          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <div
          style={{
            background: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            minHeight: "100vh",
            minWidth:"80vw",
           
          }}
        >
          <img
            src={previewImg}
            alt="preview"
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "8px"
            }}
          />
        </div>
      </Dialog>
      
      <div className='d-flex tablefooter' >
        
        <Pagination
         sx={{
          '& .MuiPaginationItem-root': {
            color: '#fff',
            borderColor: '#555'
          },
          '& .Mui-selected': {
            backgroundColor: '#1976d2',
            color: '#fff'
          },
          '& .MuiPaginationItem-root:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)'
          }
        }}
         count={catdata?.totalPages} color='primary' showFirstButton showLastButton onChange={handlechange} className=''/>
        </div>
    


    </div>
    
  );
};

export default Category;

