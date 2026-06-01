import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Box,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Rating,
  Pagination,
  Card,
  CardContent
} from '@mui/material';
import { FaSearch, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { fetchDataFromAPI, deletedata } from '../../utils/api';
import { useContext } from 'react';
import { Mycontext } from '../../AdminApp';
import './ProductList.css';

const ProductList = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const itemsPerPage = 10;

  // Fetch products from API
  useEffect(() => {
    window.scrollTo(0, 0);
    context.setProgress(20);
    setLoading(true);

    fetchDataFromAPI('/api/products/')
      .then((res) => {
        // Handle both array and object responses
        const productList = Array.isArray(res) ? res : (res.products || res.productList || []);
        setProducts(productList);
        setFilteredProducts(productList);
        context.setProgress(100);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
        context.setProgress(100);
      });
  }, []);

  // Filter products by search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
      setPage(1);
    } else {
      const filtered = products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      setPage(1);
    }
  }, [searchTerm, products]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price || 0);
  };

  // Calculate final price with discount
  const calculateFinalPrice = (price, discount) => {
    if (!discount || discount === 0) return price;
    return price - (price * discount / 100);
  };

  // Truncate description
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Handle delete
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deletedata(`/api/products/${productToDelete._id}`)
        .then(() => {
          // Reload products
          fetchDataFromAPI('/api/products/')
            .then((res) => {
              const productList = Array.isArray(res) ? res : (res.products || res.productList || []);
              setProducts(productList);
              setFilteredProducts(productList);
            })
            .catch((error) => console.error('Error reloading products:', error));
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        });
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Handle edit - navigate to product upload page
  // TODO: Implement edit functionality in ProductUpload component
  const handleEdit = (product) => {
    // For now, navigate to upload page
    // You can enhance ProductUpload to support editing by passing product ID
    navigate(`/products/upload/${product._id}`);
  };

  // Get product image (first image from images array or placeholder)
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  // Get category name
  const getCategoryName = (product) => {
    if (typeof product.category === 'object' && product.category?.name) {
      return product.category.name;
    }
    return product.category || 'N/A';
  };
  const getsubCategoryName = (product) => {
    if (typeof product.subCat === 'object' && product.subCat?.name) {
      return product.subCat.name;
    }
    return product.subCat || 'N/A';
  };

  if (loading) {
    return (
      <div className="product-list-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      {/* Header Card */}
      <Card className="product-list-header" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <div className="header-content">
            <Typography variant="h4" component="h1" className="page-title">
              Product Listing
            </Typography>
            <TextField
              placeholder="Search products by name..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table Card */}
      <Card className="product-table-card" sx={{ boxShadow: 3 }}>
        <CardContent>
          {filteredProducts.length === 0 ? (
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
                {searchTerm ? 'No products found matching your search' : 'No products available'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {searchTerm ? 'Try a different search term' : 'Add your first product to get started'}
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table className="product-table">
                  <TableHead>
                    <TableRow className="table-header-row">
                      <TableCell className="table-header-cell">Image</TableCell>
                      <TableCell className="table-header-cell">Name</TableCell>
                      <TableCell className="table-header-cell">Description</TableCell>
                      
                      <TableCell className="table-header-cell">Category</TableCell>
                      <TableCell className="table-header-cell">subCategory</TableCell>
                      <TableCell className="table-header-cell">Brand</TableCell>
                      <TableCell className="table-header-cell">Price</TableCell>
                      <TableCell className="table-header-cell">Discount %</TableCell>
                      <TableCell className="table-header-cell">Final Price</TableCell>
                      <TableCell className="table-header-cell">Stock</TableCell>
                      <TableCell className="table-header-cell">Rating</TableCell>
                      <TableCell className="table-header-cell">Featured</TableCell>
                      <TableCell className="table-header-cell">Ram</TableCell>

                      <TableCell className="table-header-cell">Weight</TableCell>
                      <TableCell className="table-header-cell">Size</TableCell>

                      <TableCell className="table-header-cell">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedProducts.map((product) => {
                      const finalPrice = calculateFinalPrice(product.price, product.discount);
                      const imageUrl = getProductImage(product);
                      const isLowStock = (product.countInStock || product.countInstock || 0) < 5;

                      return (
                        <TableRow key={product._id} className="table-row">
                          <TableCell>
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="product-thumbnail"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className="product-thumbnail-placeholder"
                              style={{ display: imageUrl ? 'none' : 'flex' }}
                            >
                              <FaImage size={24} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {product.name || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" className="description-cell">
                              {truncateText(product.description, 60)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {getCategoryName(product)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {getsubCategoryName(product)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {product.brand || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <div className="price-cell">
                              {product.discount > 0 ? (
                                <>
                                  <Typography
                                    variant="body2"
                                    className="original-price"
                                  >
                                    {formatPrice(product.price)}
                                  </Typography>
                                </>
                              ) : (
                                <Typography variant="body2" fontWeight={600}>
                                  {formatPrice(product.price)}
                                </Typography>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.discount > 0 ? (
                              <Chip
                                label={`${product.discount}%`}
                                size="small"
                                color="error"
                                sx={{ fontWeight: 600 }}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} color="primary">
                              {formatPrice(finalPrice)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.countInStock || product.countInstock || 0}
                              size="small"
                              color={isLowStock ? 'error' : 'default'}
                              sx={{
                                fontWeight: 600,
                                backgroundColor: isLowStock ? '#ffebee' : undefined,
                                color: isLowStock ? '#c62828' : undefined,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Rating
                              value={product.rating || 0}
                              readOnly
                              precision={0.5}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.isFeatured ? 'Yes' : 'No'}
                              size="small"
                              color={product.isFeatured ? 'success' : 'default'}
                              sx={{
                                fontWeight: 600,
                                backgroundColor: product.isFeatured ? '#e8f5e9' : undefined,
                                color: product.isFeatured ? '#2e7d32' : undefined,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {product.productRam?.length ? product.productRam.join(", ") : "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {product.productWeight?.length ? product.productWeight.join(", ") : "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {product.productSize.length ? product.productSize.join(", ") : "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>

                            <div className="action-buttons">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(product)}
                                className="action-btn edit-btn"
                                title="Edit"
                              >
                                <FaEdit />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(product)}
                                className="action-btn delete-btn"
                                title="Delete"
                              >
                                <FaTrash />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4} mb={2}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    showFirstButton
                    showLastButton
                    size="large"
                  />
                </Box>
              )}

              {/* Results count */}
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
                Showing {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
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

export default ProductList;

