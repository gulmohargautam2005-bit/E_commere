import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  CircularProgress,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Breadcrumbs,
  Chip
} from '@mui/material';
import { emphasize, styled } from '@mui/material/styles';
import { FaEdit, FaTrash, FaHome, FaImage } from 'react-icons/fa';
import { fetchDataFromAPI, deletedata } from '../../utils/api';
import { useContext } from 'react';
import { Mycontext } from '../../AdminApp';
import './SubCategory.css';

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

const SubCategory = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);
  const [subCatData, setSubCatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

  // Fetch subcategories from API
  useEffect(() => {
    window.scrollTo(0, 0);
    context.setProgress(20);
    setLoading(true);
    
    fetchDataFromAPI('/api/subCat')
      .then((res) => {
        // Handle both array and object responses
        const subCategoryList = Array.isArray(res) ? res : (res.subCategoryList || res.subCategories || []);
        setSubCatData(subCategoryList);
        context.setProgress(100);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching subcategories:', error);
        setLoading(false);
        context.setProgress(100);
      });
  }, []);

  // Handle delete
  const handleDeleteClick = (subCategory) => {
    setSubCategoryToDelete(subCategory);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (subCategoryToDelete) {
      deletedata(`/api/subCat/${subCategoryToDelete._id || subCategoryToDelete.id}`)
        .then(() => {
          // Reload subcategories
          fetchDataFromAPI('/api/subCat')
            .then((res) => {
              const subCategoryList = Array.isArray(res) ? res : (res.subCategoryList || res.subCategories || []);
              setSubCatData(subCategoryList);
            })
            .catch((error) => console.error('Error reloading subcategories:', error));
        })
        .catch((error) => {
          console.error('Error deleting subcategory:', error);
          alert('Failed to delete subcategory');
        });
    }
    setDeleteDialogOpen(false);
    setSubCategoryToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSubCategoryToDelete(null);
  };

  // Handle edit - navigate to edit page
  const handleEdit = (subCategory) => {
    // Navigate to edit page or open edit dialog
    navigate(`/subCategory/edit/${subCategory._id || subCategory.id}`);
  };

  // Get category image
  const getCategoryImage = (item) => {
    if (item?.category?.images && item.category.images.length > 0) {
      return item.category.images[0];
    }
    if (item?.images && item.images.length > 0) {
      return item.images[0];
    }
    return null;
  };

  // Get category name
  const getCategoryName = (item) => {
    if (typeof item.category === 'object' && item.category?.name) {
      return item.category.name;
    }
    return item.category || 'N/A';
  };

  // Get subcategory name
 
  const getSubCategoryName = (item) => {
    if (!item) return 'N/A';
    return item.subCat || item.subCategory || item.name || 'N/A';
  };

  if (loading) {
    return (
      <div className="subcategory-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </div>
    );
  }

  return (
    <div className="subcategory-container">
      {/* Header Card */}
      <Card className="subcategory-header-card" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <div className="header-content">
            <div className="header-left">
              <Typography variant="h5" component="h1" className="page-title">
                Sub Category List
              </Typography>
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
                <StyledBreadcrumb label="Sub Category" />
              </Breadcrumbs>
            </div>
            <Link to="/subCategory/add" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                className="add-button"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                  },
                }}
              >
                Add Sub Category
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* SubCategory Table Card */}
      <Card className="subcategory-table-card" sx={{ boxShadow: 3 }}>
        <CardContent>
          {!subCatData || (Array.isArray(subCatData) && subCatData.length === 0) || 
           (subCatData.subCategoryList && subCatData.subCategoryList.length === 0) ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight="300px"
              py={4}
            >
              <FaImage size={64} style={{ color: '#ccc', marginBottom: 16 }} />
              <Typography variant="h6" color="textSecondary">
                No subcategories available
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Add your first subcategory to get started
              </Typography>
            </Box>
          ) : (
            <div className="product-table-container">
              <table className="product-table">
                <thead>
                  <tr>
                    <th style={{ width: '200px' }}>CATEGORY IMAGE</th>
                    <th>CATEGORY</th>
                    <th>SUB CATEGORY</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(subCatData) ? subCatData : subCatData.subCategoryList || []).map((item, index) => {
                    const imageUrl = getCategoryImage(item);
                    return (
                      <tr key={item._id || item.id || index}>
                        <td>
                          <div className="d-flex align-items-center" style={{ width: '150px' }}>
                            <div className="imgWrapper" style={{ width: '50px', flex: '0 0 50px' }}>
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={getCategoryName(item)}
                                  className="category-image"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) {
                                      e.target.nextSibling.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <div
                                className="image-placeholder"
                                style={{ display: imageUrl ? 'none' : 'flex' }}
                              >
                                <FaImage size={20} />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span>{getCategoryName(item)}</span>
                        </td>
                        <td>
                          <span>{getSubCategoryName(item)}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(item)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteClick(item)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Sub Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{getSubCategoryName(subCategoryToDelete)}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubCategory;

