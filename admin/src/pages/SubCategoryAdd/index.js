import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Breadcrumbs,
  Chip
} from '@mui/material';
import { emphasize, styled } from '@mui/material/styles';
import { FaHome, FaCloudUploadAlt } from 'react-icons/fa';
import { fetchDataFromAPI, postDataToAPI } from '../../utils/api';
import { useContext } from 'react';
import { Mycontext } from '../../AdminApp';
import './SubCategoryAdd.css';

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

const SubCategoryAdd = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    subCat: ''
  });

  // Fetch categories for dropdown
  useEffect(() => {
    window.scrollTo(0, 0);
    context.setProgress(20);
    
    fetchDataFromAPI('/api/category/')
      .then((res) => {
        const categoryList = res.categoryList || res.categories || [];
        setCategories(categoryList);
        context.setProgress(100);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        context.setProgress(100);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.subCat) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    postDataToAPI('/api/subCat/create', formData)
      .then((res) => {
        setIsLoading(false);
        alert('Subcategory created successfully!');
        navigate('/subcategory/upload');
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error creating subcategory:', error);
        alert(error.response?.data?.message || 'Failed to create subcategory');
      });
  };

  return (
    <div className="subcategory-add-container">
      {/* Header Card */}
      <Card className="subcategory-add-header" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <div className="header-content">
            <div>
              <h5 className="page-title">Add Sub Category</h5>
              <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
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
                  label="Sub Category"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/subcategory/upload');
                  }}
                />
                <StyledBreadcrumb label="Add Sub Category" />
              </Breadcrumbs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card className="subcategory-add-form-card" sx={{ boxShadow: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit} className="subcategory-form">
            {/* Basic Information Section */}
            <div className="form-section">
              <h5 className="section-title">Basic Information</h5>
              
              <div className="form-row">
                <FormControl fullWidth variant="outlined" className="form-field">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                    required
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No categories available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </div>

              <div className="form-row">
                <TextField
                  fullWidth
                  label="Sub Category Name"
                  name="subCat"
                  value={formData.subCat}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  className="form-field"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="submit-section">
              <Button
                type="submit"
                variant="contained"
                className="submit-button"
                fullWidth
                size="large"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={26} sx={{ color: 'white' }} />
                ) : (
                  <>
                    <FaCloudUploadAlt style={{ marginRight: 8 }} />
                    CREATE SUB CATEGORY
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubCategoryAdd;

