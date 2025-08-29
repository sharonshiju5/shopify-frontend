import React, { useEffect, useState } from "react";
import { Image } from "lucide-react";
import axios from "axios";
import APIURL from "../path";
import { ToastContainer, toast } from 'react-toastify';

const Editproduct = (productid) => {
    const [product, setProduct] = useState({
        name: "",
        brand: "",
        category: "",
        price: "",
        stock: "",
        sizes: [],
        images: [],
        material: "100% Cotton",
        description: "",
        productid: "",
    });

    useEffect(() => {
            if (productid?.prodId) {
                setProduct(prev => ({ ...prev, ...productid.prodId, productid: productid.prodId._id || "",}));
            }
    }, [productid]);

  const [categories] = useState(["shoes", "shirts", "pants","trousers",""]);
    const [customSize, setCustomSize] = useState("");
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleChange = (e) => {
        setProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...previews]);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setProduct(prev => ({ ...prev, images: [...prev.images, reader.result] }));
            };
        });
    };

    const addCustomSize = () => {
        if (!customSize.trim()) return;
        setProduct(prev => ({ ...prev, sizes: [...prev.sizes, customSize] }));
        setCustomSize("");
    };

    const addProducts = async (e) => {
        e.preventDefault();
        try {
            const updatedProduct = { ...product, productid: String(product.productid) };
            const res = await axios.post(`${APIURL}/updateproduct`, updatedProduct);

            if (res.status === 200) {
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
                    productid: "",
                });
                setImagePreviews([]);
                setCustomSize("");
            }
        } catch (error) {
            console.error("Error saving product:", error.response?.data || error.message);
            toast.error("Failed to save product");
        }
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const remImage = (index) => {
        setProduct(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    function removeSize(size) {
        setProduct(prev => ({
          ...prev,
          sizes: prev.sizes.filter((_, index) => index !== size)
        }));    
    }
    return (
        <div className="w-full p-8 bg-white">
            <form onSubmit={addProducts}>
                <h2 className="text-xl font-bold text-blue-600">Product Information</h2>
                <input type="text" name="name" placeholder="Product Name" className="border p-2 rounded w-full mt-2" value={product.name} onChange={handleChange} />
                <input type="text" name="brand" placeholder="Brand" className="border p-2 rounded w-full mt-2" value={product.brand} onChange={handleChange} />
                <div className="flex flex-col w-full space-y-2">
                    <select name="category" className="border p-2 rounded w-full mt-2" value={product.category} onChange={handleChange}>
                        <option value="">Select Category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <textarea name="description" placeholder="Description" className="border p-2 rounded w-full mt-2 h-32 resize-none" value={product.description} onChange={handleChange} />
                </div>

                <h3 className="text-lg font-semibold text-blue-600 mt-6">Upload Product Images</h3>
                <label className="border-2 border-gray-300 border-dashed p-6 w-full flex flex-col items-center justify-center cursor-pointer">
                    <Image className="h-10 w-10 text-gray-500" />
                    <span className="text-gray-500 mt-2">Browse Or Desktop</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                    {product.images.map((imgSrc, index) => (
                        <div key={index} className="relative group">
                            <img src={imgSrc} alt={`Product ${index}`} className="w-full h-24 object-cover rounded" />
                            <button 
                              type="button" 
                              onClick={() => remImage(index)} 
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm"
                              aria-label="Remove image">
                              ✕
                            </button>
                        </div>
                    ))}
                </div>
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
                        <button type="button" onClick={()=>removeSize(index)} className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-200">
                          <img 
                            className="h-2 w-2 opacity-70" 
                            src="https://cdn-icons-png.flaticon.com/128/657/657059.png" 
                            alt="Remove size" 
                          />
                        </button>
                    </li>
                    ))}
                </ul>
                
                <h3 className="text-lg font-semibold text-blue-600 mt-6">Pricing & Stock</h3>
                <input type="number" name="price" placeholder="Price" className="border p-2 rounded w-full mt-2" value={product.price} onChange={handleChange} />
                <input type="number" name="stock" placeholder="Stock" className="border p-2 rounded w-full mt-2" value={product.stock} onChange={handleChange} />
                
                <div className="flex justify-between mt-6">
                    <button className="text-blue-500 border border-blue-500 px-4 py-2 rounded">Cancel</button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Editproduct;
