import { useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { FaImages } from "react-icons/fa";
import { useContext } from "react";
import { Mycontext } from "../../AdminApp";
import Dialog from '@mui/material/Dialog';




import { deletedata, Editdata, fetchDataFromAPI, postDataToAPI } from '../../utils/api';

import './ProductUpload.css';

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
  const { id } = useParams();

  const fd = new FormData();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [productRam, setproductRam] = useState('')
  const [productsize, setproductSize] = useState('')
  const [productWeight, setproductWeight] = useState('')
  const [isloading, setisloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imgFiles, setimgfies] = useState([]);
  const [preview, setpreview] = useState([]);
  const [previewImg, setPreviewImg] = useState("");

  const [uploadedImages, setUploadedImages] = useState([]);
  // =============================================
  // edit mode 

  useEffect(() => {
    if (!id) return;

    fetchDataFromAPI(`/api/products/${id}`).then((product) => {
      // 1) populate text/number fields
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category?._id || product.category,
        category: product.subcategory?._id || product.subcategory,
        price: product.price,
        isFeatured: product.isFeatured,
        catName:product.catName,
        subCat:product.subCat,
        countInstock: product.countInstock,
        brand: product.brand,
        discount: product.discount,
        rating: product.rating,
      });

      // 2) populate images state for media section
      setpimage(product.images || []);
      setpreview(product.images || []); // so thumbnails show immediately
    });

  }, [id]);
  const openImagePreview = (img) => {
    setPreviewImg(img);
    setPreviewOpen(true);
  };

  // =====================================================
  const addproduct = (e) => {
    e.preventDefault();

    // simple top-to-bottom validation: show first missing field only
    const name = formData.name?.trim();

    if (!name) {
      setErrorMessage("Please fill Name");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  
    if (!formData.productSize || formData.productSize.length === 0) {
      setErrorMessage('Please fill Name');
      window.scrollTo(0, 0);
      return;
    }
    if (!formData.productWeight || formData.productWeight.length ===0) {
      setErrorMessage('Please fill Name');
      window.scrollTo(0, 0);
      return;
    }
    if (!formData.description || !formData.description.trim()) {
      setErrorMessage('Please fill Description');
      window.scrollTo(0, 0);
      return;
    }
    if (!formData.category) {
      setErrorMessage('Please select Category');
      window.scrollTo(0, 0);
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMessage('Please enter a valid Price');
      window.scrollTo(0, 0);
      return;
    }
    if (formData.isFeatured === '' || formData.isFeatured === null || formData.isFeatured === undefined) {
      setErrorMessage('Please select Is Featured');
      window.scrollTo(0, 0);
      return;
    }
    if (!formData.brand || !formData.brand.trim()) {
      setErrorMessage('Please fill Brand');
      window.scrollTo(0, 0);
      return;
    }
    if (!formData.countInstock || Number(formData.countInstock) <= 0) {
      setErrorMessage('Please enter Stock Count');
      window.scrollTo(0, 0);
      return;
    }
    if (!formData.rating || Number(formData.rating) <= 0) {
      setErrorMessage('Please give a Rating');
      window.scrollTo(0, 0);
      return;
    }
    if (!pimage || pimage.length === 0) {
      setErrorMessage('Please upload at least one Product Image');
      window.scrollTo(0, 0);
      return;
    }

    // clear any previous error if all validations pass
    setErrorMessage('');

    fd.append('name', formData.name);
    fd.append('description', formData.description);
    fd.append('brand', formData.brand);
    fd.append('price', formData.price);
    fd.append('oldPrice', formData.oldPrice);
    fd.append('category', formData.category);
    fd.append('subcategory', formData.subcategory);

    fd.append('catName', formData.catName);
    fd.append("subCat",formData.subCat);
    fd.append('countInstock', formData.countInstock);
    fd.append('rating', formData.rating);
    fd.append('isFeatured', formData.isFeatured);
    fd.append('productRam', formData.productRam);
    fd.append('productWeight', formData.productWeight);
    fd.append('productSize', formData.productSize);

    const productData = {
      ...formData,
      images: pimage
    };

    console.log(productData);
    setisloading(true);
    if (id) {
      Editdata(`/api/products/${id}`, productData)
      .then(() => {
        setisloading(false);
        navigate("/products/list");
      })
      .catch(err => {
        setisloading(false);
        console.log(err);
      });
    }
    else{
    postDataToAPI("/api/products/create", productData)
      .then(() => {
        

        // reset form
        setFormData({
          name: '',
          description: '',
          category: '',
          subcategory:'',
          price: 0,
          isFeatured: false,
          countInstock: 0,
          brand: '',
          catName:"",
          subCat:'',
          discount: 0,
          rating: 0,
          productRam: [],
          productWeight: [],
          productSize: [],
        });

        // reset images
        setpimage([]);
        setisloading(false);

        // clear input field
        if (productimage.current) {
          productimage.current.value = "";
        }
        navigate("/products/list");
      })
      .catch(err => console.log(err.response?.data || err.message));
  };
}

  const[catdata, setcatdata] = useState([])
  const[subcatdata, setsubcatdata] = useState([])
  const [pimage, setpimage] = useState([]);

  const productimage = useRef();

  const Addimage = () => {
    const val = productimage.current.value;
    if (!val) return;

    setpimage(prev => [...prev, val]);
    productimage.current.value = "";


  }

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory:'',
    price: 0,
    isFeatured: false,
    countInstock: 0,
    catName:'',
    subCat:"",
    brand: '',
    discount: 0,
    rating: 0,
    productRam: [],
    productWeight: [],
    productSize: [],
  });


  useEffect(() => {
    fetchDataFromAPI('/api/category/').then(res => {
      console.log("CATEGORY API:", res);
      setcatdata(res.categoryList);
    });
  }, []);
  useEffect(() => {
    fetchDataFromAPI("/api/subCat/").then((res) => {
      setsubcatdata(res.subCategoryList );
    });
  }, []);

  useEffect(() => {
    let tmp = [];

    for (let i = 0; i < imgFiles.length; i++) {
      tmp.push(URL.createObjectURL(imgFiles[i]));
    }

    const objectUrls = tmp;
    setpreview(objectUrls);

    // free memory
    for (let i = 0; i < objectUrls.length; i++) {
      return () => {
        URL.revokeObjectURL(objectUrls[i]);
      };
    }
  }, [imgFiles]);

  const handlechangerams = (event) => {
    const {
      target: { value },
    } = event;
  
    setFormData(prev => ({
      ...prev,
      productRam: typeof value === 'string' ? value.split(',') : value,
    }));
  };
  const handlechangesize = (e) => {
    setproductSize(e.target.value)
    setFormData(() => ({
      ...formData,
      productSize: (e.target.value)
    })
    )
  }
  const handlechangeweight = (e) => {
    setproductWeight(e.target.value)
    setFormData(() => ({
      ...formData,
      productWeight: (e.target.value)
    })
    )
  }
  const selectcat = (cat) => {
    setFormData(prev => ({
      ...prev,
      catName: cat
    }));
  };
  const selectsubcat = (cat) => {
    setFormData(prev => ({
      ...prev,
      subCat: cat
    }));
  };













  const onChangeFile = async (e, apiEndPoint) => {
    try {
      const imgArr = [];
      const files = e.target.files;
      setimgfies(e.target.files)
      const fd = new FormData();   // <-- must be capital F

      for (let i = 0; i < files.length; i++) {
        // validate the files and set alerbox on wrong filetype
        const file = files[i];
        imgArr.push(file);
        fd.append('images', file);
      }

      const res = await postDataToAPI(apiEndPoint, fd);
      console.log("UPLOAD RESPONSE:", res);
      setpimage(res);


    } catch (error) {
      console.error("IMAGE UPLOAD ERROR:", error);
    }
  };















  const filteredSubCats = subcatdata.filter(
    (item) => item.category?._id?.toString() === formData.category?.toString()
  );





  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isFeatured' ? value === 'true' : value
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



  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4 mb-4">
        <h5 className="mb-0">Product Upload</h5>
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
            label="Products"
            onClick={(e) => {
              e.preventDefault();
              navigate('/products');
            }}
          />
          <StyledBreadcrumb label="Product Upload" />
        </Breadcrumbs>
      </div>

      {errorMessage && (
        <div className="mb-3">
          <Alert variant="filled" severity="error">
            {errorMessage}
          </Alert>
        </div>
      )}





      <form onSubmit={addproduct} className="product-upload-form ">
        <div className='row'>
          <div className='col-sm-9'>
            <div className="card shadow border-0 w-100 mb-4">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0">Basic Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <TextField
                      fullWidth
                      label="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3 ">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        label="Category"
                      >
                        {
                          catdata.length !== 0 && catdata.map((cat, index) => {
                            return (
                              <MenuItem key={cat._id} value={cat._id} onClick={()=>selectcat(cat.name)}>{cat.name}</MenuItem>
                            )
                          })

                        }
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className='row'>
                <FormControl fullWidth variant="outlined">
                      <InputLabel>Sub-Category</InputLabel>
                      <Select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        label="subcategory"
                      >
                        {
                          filteredSubCats.length !== 0 && filteredSubCats.map((cat, index) => {
                            return (
                              <MenuItem key={cat._id} value={cat._id} onClick={()=>selectsubcat(cat.subCat)}>{cat.subCat}</MenuItem>
                            )
                          })

                        }
                      </Select>
                    </FormControl>
             
                </div>

                <div className="row">
                  <div className="col-12 mb-3">
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={4}
                      required
                    />
                  </div>
                  {/* <div className="col-12 mb-3">
                      <TextField
                        fullWidth
                        label="Images"
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        variant="outlined"
                        inputRef={productimage}
                        multiline
                        rows={4}
                        required
                      />
                    </div>
                    <Button variant='contained' onClick={Addimage}>ADD IMAGE</Button> */}


                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <TextField
                      fullWidth
                      label="Price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Product Ram</InputLabel>

                      <Select
                        multiple
                        name="productRam"
                        value={formData.productRam || []}
                        onChange={handlechangerams}
                        label="Product Ram"
                        renderValue={(selected) => selected.join(", ")}
                      >
                        <MenuItem value="4GB">4GB</MenuItem>
                        <MenuItem value="8GB">8GB</MenuItem>
                        <MenuItem value="16GB">16GB</MenuItem>
                        <MenuItem value="32GB">32GB</MenuItem>
                      </Select>

                    </FormControl>
                  </div>
                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Is Featured</InputLabel>
                      <Select
                        name="isFeatured"
                        value={formData.isFeatured}

                        onChange={handleChange}
                        label="Is Featured"
                      >
                        <MenuItem value="true">true</MenuItem>
                        <MenuItem value="false">false</MenuItem>

                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-md-6 mb-3">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Product Size</InputLabel>
                      <Select
                        multiple
                        name="productSize"
                        value={formData.productSize || []}
                        onChange={handlechangesize}
                        label="Product Size"
                        renderValue={(selected) => selected.join(", ")}
                      >
                        <MenuItem value="">
                          <em value={null}>None</em>
                        </MenuItem>
                        <MenuItem value={"S"}>S</MenuItem>
                        <MenuItem value={"M"}>M</MenuItem>
                        <MenuItem value={"XL"}>XL</MenuItem>
                        <MenuItem value={"XXL"}>XXL</MenuItem>

                      </Select>
                    </FormControl>
                  </div>



                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <TextField
                      fullWidth
                      label="Brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Product Weight</InputLabel>
                      <Select
                        multiple
                        name="productRam"
                        value={formData.productWeight || []}
                        onChange={handlechangeweight}
                        label="Product weight"
                        renderValue={(selected) => selected.join(", ")}
                      >
                        <MenuItem value="">
                          <em value={null}>None</em>
                        </MenuItem>
                        <MenuItem value={"100g"}>100g</MenuItem>
                        <MenuItem value={"200g"}>200g</MenuItem>
                        <MenuItem value={"500g"}>500g</MenuItem>
                        <MenuItem value={"1Kg"}>1Kg</MenuItem>
                        <MenuItem value={"2kg"}>2kg</MenuItem>

                      </Select>
                    </FormControl>
                  </div>

                </div>


                <div className="row">
                  <div className="col-md-6 mb-3 mt-4">
                    <TextField
                      fullWidth
                      label="Price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </div>
                  <div className="col-md-6 mb-3 mt-4">
                    <TextField
                      fullWidth
                      label="Discount"
                      name="discount"
                      type='number'
                      value={formData.discount}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </div>






                </div>

                <div className="row">
                  <div className="col-md-6 mb-3 mt-4">
                    <TextField
                      fullWidth
                      label="countInstock"
                      name="countInstock"
                      type="number"
                      value={formData.countInstock}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="rating-section">
                      <label className="rating-label">Ratings</label>
                      <Rating
                        name="rating"
                        value={formData.rating}
                        onChange={(event, newValue) => {
                          setFormData(prev => ({ ...prev, rating: newValue }));
                        }}
                        size="large"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow border-0 w-100 mb-4">
              <div className='imagesuploadsec'>
                <div className="row">
                  {/* LEFT SIDE */}
                  <div className="col">

                    <h5 className="mt-3 ms-3 me-3 ">Media And Published</h5>
                    <hr></hr>

                    <div className="imageupload d-flex flex-wrap gap-3 mt-3 ms-3 mb-5">

                      {/* Uploaded images */}
                      {preview.length !== 0 && preview.map((item, index) => (
                        <div className="img" key={index}>
                          <img src={item} alt={`p-${index}`} />
                        </div>
                      ))}

                    </div>
                    <div className="imageupload d-flex flex-wrap gap-3 mt-3 ms-3 mb-5">
                      {/* Upload button */}
                      <div className="uploadbox">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          multiple
                          onChange={(e) => onChangeFile(e, "/api/products/upload")}
                          style={{ display: "none" }}
                        />
                        <label htmlFor="image-upload" className="upload-label">
                          <FaImages size={30} />
                          <span>Upload</span>
                        </label>
                      </div>

                    </div>
                  </div>




                </div>

              </div>
            </div>


            {/* Media And Published Section */}
            {/* <div className="card shadow border-0 w-100 mb-4">
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
            </div> */}

            {/* Submit Button */}
            <div className="card shadow border-0 w-100">
              <div className="card-body">
                <Button
                  type="submit"
                  variant="contained"
                  className="publish-button"

                  fullWidth
                  size="large"
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


          </div>


          <div className="col-sm-3">
            <div className=" sticky box shadow p-3 card-details  pb-5">
              <h5 className='text-black'> Product Images</h5>
              <hr></hr>
              <div className='imggrid ddflex'>

                {
                  preview.length !== 0 && preview?.map((item, index) => {
                    return (<div className='img mt-3' key={index}>
                      <img onClick={() => openImagePreview(item)} src=
                        {item} alt={`p-${index}`}
                      />
                    </div>)
                  })
                }



              </div>
            </div>


          </div>
        </div>
      </form>
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
            minWidth: "80vw",

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




    </div>
  );
};

export default ProductUpload;

