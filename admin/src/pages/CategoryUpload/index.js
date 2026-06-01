import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Rating from '@mui/material/Rating';
import { FaCloudUploadAlt, FaTimes, FaHome } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import './CategoryUpload.css';
import { fetchDataFromAPI, postDataToAPI } from '../../utils/api';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';


// Styled Breadcrumb Component
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const ProductUpload = () => {

  useEffect(() => {
    window.scrollTo(0, 0);

  }, []);
  const [isloading, setisloading] = useState(false);
  const history = useNavigate();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: 'None',
    subCategory: 'None',
    price: '',
    oldPrice: '',
    isFeatured: 'None',
    productStock: '',
    brand: '',
    discount: '',
    productRams: 'None',
    rating: 0
  });

  const [uploadedImages, setUploadedImages] = useState([]);

  const [formfields, setFormfields] = useState({
    name: '',
    images: [],
    color: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id) => {
    setUploadedImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product Data:', formData);
    console.log('Images:', uploadedImages);
    // Add your submit logic here
    alert('Product uploaded successfully!');
  };
  const addCategory = (e) => {
    if (formfields.name !== "" && formfields.images.length !== 0 && formfields.color !== "") {
      e.preventDefault();
      setisloading(true);
      console.log(formfields);
      postDataToAPI('/api/category/create', formfields).then(res => {
        setisloading(false);
        console.log(res);
        history("/dashboard")
      });
    }

  }
  const changesubmit = (e) => {
    setFormfields({
      ...formfields,
      [e.target.name]: e.target.value
    })

  }
  const addImageurl = (e) => {
    const arr = [];
    arr.push(e.target.value);
    setFormfields({
      ...formfields,
      images: arr
    })
  }


  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4 mb-4">
        <h5 className="mb-0">Category Add</h5>

        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
          <StyledBreadcrumb
            component="a"
            href="#"
            label="Dashboard"
            icon={<FaHome style={{ fontSize: '14px' }} />}
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
          />
          <StyledBreadcrumb
            component="a"
            href="#"
            label="Category"
            onClick={(e) => {
              e.preventDefault();
              navigate('/products');
            }}
          />
          <StyledBreadcrumb label="ADD Category" />
        </Breadcrumbs>

      </div>

      <form onSubmit={addCategory} className="product-upload-form">
        {/* Basic Information Section */}
        <div className="card shadow border-0 w-100 mb-4">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0">Basic Information</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <TextField
                  fullWidth
                  label="Category Name"
                  name="name"
                  value={formfields.name}
                  onChange={changesubmit}
                  variant="outlined"
                  required
                />
              </div>

            </div>

            <div className="row">
              <div className="col-12 mb-3">
                <TextField
                  fullWidth
                  label="image Url"
                  name="images"
                  value={formfields.images}
                  onChange={addImageurl}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-3">
                <TextField
                  fullWidth
                  label="color"
                  name="color"
                  value={formfields.color}
                  onChange={changesubmit}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                />
              </div>
            </div>






          </div>
        </div>

        {/* Media And Published Section */}
        <div className="card shadow border-0 w-100 mb-4">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0">Media And Published</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 mb-3">
                <div className="image-upload-container">
                  {uploadedImages.map((image, index) => (
                    <div key={image.id} className="image-upload-box uploaded">
                      <img src={image.preview} alt={`Upload ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  {uploadedImages.length < 2 && (
                    <div className="image-upload-box">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="image-upload" className="upload-label">
                        <FaCloudUploadAlt className="upload-icon" />
                        <span>image upload</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="card shadow border-0 w-100">
          <div className="card-body">
            <Button
              type="submit"
              variant="contained"
              className="publish-button"
              fullWidth
              size="large"
              disabled={isloading}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {isloading ? (
                <CircularProgress size={26} sx={{ color: "white" }} />
              ) : (
                <>
                  <FaCloudUploadAlt style={{ marginRight: 8 }} />
                  PUBLISH AND VIEW
                </>
              )}
            </Button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductUpload;

