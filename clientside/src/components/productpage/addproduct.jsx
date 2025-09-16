import React, { useEffect, useState } from "react";
import { Image } from "lucide-react";
import axios from "axios";
import APIURL from "../path";
import { ToastContainer, toast } from 'react-toastify';
import { ButtonLoader } from '../LoaderVariants';


const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    sizes:[],
    images: [],
    material: "100% Cotton",
    description: "",
    userId:"",
  });
  const [categories] = useState(["shoes", "shirts", "pants","trousers","jeance","watch","jacket","skirt",]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [customSize, setCustomSize] = useState("");
  const [Customcategory, setCustomcategor] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const toggleSelection = (list, setList, value) => {
    setList((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleRemoveImage = (indexToRemove) => {
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);

    const imageUrls = [];
    files.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onloadend = () => {
            imageUrls.push(reader.result);
            setProduct(prev => ({ ...prev, images: [...prev.images, reader.result] }));
        };
    });
};

  const addCustomSize = () => {
    if (!customSize.trim()) return; 
    setProduct(prev => ({...prev,sizes: [...prev.sizes, customSize] }));
    setCustomSize(""); 
  };

  function removeSize(size) {
    setProduct(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, index) => index !== size)
    }));    
  }

  const addCustomcategory = () => {
    if (!customSize.trim()) return; 
    setProduct(prev => ({...prev,sizes: [...prev.sizes, customSize] }));
    setCustomSize(""); 
  };



  const addProducts = async (e) => {
    e.preventDefault();
    try {
        setSubmitLoading(true);
        const userId = localStorage.getItem("userId");

        const updatedProduct = { ...product, userId };
        console.log("Submitting Product:", updatedProduct);

        const res = await axios.post(APIURL + "/addproduct", updatedProduct);

        if (res.status === 201) {
            toast.success(res.data.msg);

            setProduct({
                name: "",
                brand: "",
                category: "",
                price: "",
                stock: "",
                sizes: [],
                images: [],
                material: "100% Cotton",
                description: "",
                userId: "",
            });


            setImagePreviews([]); 
            setSelectedSizes([]);
            setCustomSize("");

            console.log("Form reset successfully!");
        }
    } catch (error) {
      toast.error(error.response?.data.msg,error.response?.data.error || error.message);

        console.error("Error saving product:", error.response?.data || error.message);
    } finally {
        setSubmitLoading(false);
    }
};

  return (
    <div className="w-full p-8 bg-white">
        <form onSubmit={addProducts}>
      <h2 className="text-xl font-bold text-blue-600">Product Information</h2>
      <input type="text" name="name" placeholder="Product Name" className="border p-2 rounded w-full mt-2" required value={product.name} onChange={handleChange} />
      <input type="text" name="brand" placeholder="Brand" className="border p-2 rounded w-full mt-2" required value={product.brand} onChange={handleChange} />
      <div className="flex flex-col w-full space-y-2">
      {/* Category Dropdown */}
        <select
            name="category"
            className="border p-2 rounded w-full mt-2"
            value={product.category}
            onChange={handleChange} required
        >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
            ))}
        </select>

        {/* Description Textarea */}
        <textarea
            name="description"
            placeholder="Description"
            className="border p-2 rounded w-full mt-2 h-32 resize-none"
            value={product.description}
            onChange={handleChange}
             required
        />
      </div>

      <h3 className="text-lg font-semibold text-blue-600 mt-6">Upload Product Images</h3>
      <label className="border-2 border-gray-300 border-dashed p-6 w-full flex flex-col items-center justify-center cursor-pointer">
        <Image className="h-10 w-10 text-gray-500" />
        <span className="text-gray-500 mt-2">Browse Or Desktop</span>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload}  className="hidden" />
      </label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative group">
              <img 
                src={src} 
                alt="Uploaded preview" 
                className="w-full h-24 object-cover rounded" 
              />
                <button 
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>

      <h3 className="text-lg font-semibold text-blue-600 mt-6">Product Variants</h3>
      <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
    <h4 className="font-semibold">Sizes</h4>
    <div className="flex mt-2">
        <input
            type="text"
            name="size"
            placeholder="Custom Size"
            className="border p-2 rounded w-full"
            value={customSize} 
            onChange={(e) => setCustomSize(e.target.value)}
        />
        <button type="button" onClick={addCustomSize} className="bg-blue-500 text-white p-2 ml-2 rounded">
            Add
        </button>
    </div>
          <ul className="flex flex-wrap gap-2 items-center">
        {product.sizes.map((size, index) => (
          <li key={index} className="flex items-center border rounded-md px-3 py-1 bg-gray-50 hover:bg-gray-100 transition-colors">
            <span className="mr-2 text-sm font-medium">{size}</span>
            <button onClick={()=>removeSize(index)} className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-200">
              <img 
                className="h-2 w-2 opacity-70" 
                src="https://cdn-icons-png.flaticon.com/128/657/657059.png" 
                alt="Remove size" 
              />
            </button>
          </li>
        ))}
      </ul>
  </div>

      </div>

      <h3 className="text-lg font-semibold text-blue-600 mt-6">Pricing & Stock</h3>
      <input type="number" name="price" placeholder="Price" className="border p-2 rounded w-full mt-2" value={product.price} required onChange={handleChange} />
      <input type="number" name="stock" placeholder="Stock" className="border p-2 rounded w-full mt-2" value={product.stock} required onChange={handleChange} />

      <div className="flex justify-between mt-6">
        <button className="text-blue-500 border border-blue-500 px-4 py-2 rounded">Cancel</button>
        <div className="flex space-x-4">
          <button className="border border-gray-500 px-4 py-2 rounded">Draft</button>
          <button type="submit" disabled={submitLoading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
            {submitLoading ? <ButtonLoader text="Saving..." /> : "Save"}
          </button>
        </div>
      </div>
      </form>
      <ToastContainer/>

    </div>
  );
};

export default ProductForm;
