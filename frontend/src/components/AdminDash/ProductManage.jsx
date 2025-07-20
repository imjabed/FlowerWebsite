import axios from "axios";
import { useEffect, useState } from "react";

function ProductManage() {
  const deployedurl = import.meta.env.VITE_BACKEND_URL;
  const localurl='http://localhost:5678';
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${deployedurl}/api/products/show`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      alert("Failed to load products");
    }
  };

  const deleteProduct = async(id) => {
    if(!window.confirm("Are you sure you want to delete the product?")) return;
    try{
      await axios.delete(`${deployedurl}/api/products/delete/${id}`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      })
     alert("Product deleted successfully");
     fetchProducts();
    }
    catch(err)
    {
      console.error("Delete Error", err);
      alert("Failed to delete product");
    }
  }

  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productTitle: "",
    productDescription: "",
    productCategory: "",
    productColor: "",
    productPrice: "",
    productStock: "",
    productImages: null, 
    productGender: "" 
  });

  const handleEditClick = (product) => {
  setEditingProduct(product._id);
  setFormData({ ...product });
  };
  const handleChange = (e) => {
    if (e.target.name === "productImages") {
      setFormData({ ...formData, productImages: e.target.files });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };


const handleUpdate = async () => {
  try {
    const data = new FormData();

    for (const key in formData) {
      if (key === "productImages" && formData.productImages) {
        for (let img of formData.productImages) {
          data.append("productImages", img);
        }
      } else if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    await axios.put(`${deployedurl}/api/products/update/${editingProduct}`, data, {

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Product updated successfully");
    setEditingProduct(null);
    fetchProducts();
  } catch (err) {
    console.error("Update error", err);
    alert("Failed to update product");
  }
};



  const [addFormData, setAddFormData] = useState({
    productTitle: "",
    productDescription: "",
    productCategory: "",
    productColor: "",
    productPrice: "",
    productStock: "",
    productImage: null,
    productGender : ""

  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "productImages") {
      setAddFormData((prev) => ({ ...prev, productImages: files }));
    } else {
      setAddFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


const handleAddProduct = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    for (const key in addFormData) {
      if (key === "productImages") {
        for (const img of addFormData.productImages) {
          data.append("productImages", img); 
        }
      } else {
        data.append(key, addFormData[key]);
      }
    }

    await axios.post(`${deployedurl}/api/products/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Product added successfully");
    setAddFormData({
      productTitle: "",
      productDescription: "",
      productCategory: "",
      productColor: "",
      productPrice: "",
      productStock: "",
      productImages: null,
      productGender: ""
    });
    setShowAddForm(false);
    fetchProducts();
  } catch (err) {
    console.error("Add Product Error:", err);
    alert("Failed to add product");
  }
};


  return (
    <>
    <div className="p-6 bg-pink-50 min-h-screen">
      <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">Product Database</h2>
      <div className="overflow-x-auto rounded shadow-md">
        <table className="min-w-full bg-white border border-pink-200">
          
          <thead className="bg-pink-600 text-white">
            <tr>
              <th className="border border-pink-300 px-4 py-3">Image</th>
              <th className="border border-pink-300 px-4 py-3">Name</th>
              <th className="border border-pink-300 px-4 py-3">Description</th>
              <th className="border border-pink-300 px-4 py-3">Category</th>
              <th className="border border-pink-300 px-4 py-3">Color</th>
              <th className="border border-pink-300 px-4 py-3">Price</th>
              <th className="border border-pink-300 px-4 py-3">Stock</th>
              <th className="border border-pink-300 px-4 py-3">For</th>
              <th className="border border-pink-300 px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length ? (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-pink-100 transition-all duration-200">
                <td className="border border-pink-200 px-4 py-3 text-center">
                  {Array.isArray(product.productImages) && product.productImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.startsWith("http") ? img : `${deployedurl}/uploads/products/${img}`}
                      alt="Product"
                      className="w-12 h-12 inline-block object-cover rounded mr-1"
                    />
                  ))}
                </td>
                  <td className="border border-pink-200 px-4 py-3 font-semibold text-pink-700">
                    {product.productTitle}
                  </td>
                  <td className="border border-pink-200 px-4 py-3">{product.productDescription}</td>
                  <td className="border border-pink-200 px-4 py-3">{product.productCategory}</td>
                  <td className="border border-pink-200 px-4 py-3">{product.productColor || "N/A"}</td>
                  <td className="border border-pink-200 px-4 py-3">₹{product.productPrice}</td>
                  <td className="border border-pink-200 px-4 py-3">{product.productStock}</td>
                  <td className="border border-pink-200 px-4 py-3">{product.productGender}</td>
                  <td className="px-4 py-2 space-x-2">
                  {
                    editingProduct === product._id ? (
                      <div className="space-y-2">
                        <input name="productTitle" value={formData.productTitle} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                        <input name="productDescription" value={formData.productDescription} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                        <input name="productCategory" value={formData.productCategory} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                        <input name="productColor" value={formData.productColor} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                        <input name="productPrice" type="number" value={formData.productPrice} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                        <input name="productStock" type="number" value={formData.productStock} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                        <input name="productGender" value={formData.productGender} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
                       <input type="file" name="productImages" multiple onChange={handleChange} className="w-full border px-2 py-1 rounded" />

                        <div className="flex gap-2 mt-2">
                          <button onClick={handleUpdate} className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded mb-2">Save</button>
                          <button onClick={() => setEditingProduct(null)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mb-2">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick(product)} className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded">
                        Edit
                      </button>
                    )
                  }

                  <button onClick={() => deleteProduct(product._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded cursor-pointer">
                    Delete
                  </button>
                </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No products available
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      <div className="flex justify-center m-5">
        <button onClick={() => setShowAddForm(!showAddForm)} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
          {showAddForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddProduct} className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto mb-8 space-y-4">
          <h3 className="text-xl font-semibold text-pink-700 mb-4">Add New Product</h3>
          <input type="text" name="productTitle" placeholder="Title" value={addFormData.productTitle} onChange={handleAddChange} className="w-full border px-3 py-2 rounded" required />
          <input type="text" name="productDescription" placeholder="Description" value={addFormData.productDescription} onChange={handleAddChange} className="w-full border px-3 py-2 rounded" required />
          <input type="text" name="productCategory" placeholder="Category" value={addFormData.productCategory} onChange={handleAddChange} className="w-full border px-3 py-2 rounded" required />
          <input type="text" name="productColor" placeholder="Color" value={addFormData.productColor} onChange={handleAddChange} className="w-full border px-3 py-2 rounded" />
          <input type="number" name="productPrice" placeholder="Price" value={addFormData.productPrice} onChange={handleAddChange} className="w-full border px-3 py-2 rounded" required />
          <input type="number" name="productStock" placeholder="Stock" value={addFormData.productStock} onChange={handleAddChange} className="w-full border px-3 py-2 rounded" required />
          <input type="text" name="productGender" placeholder="Gender" value={addFormData.productGender} onChange={handleAddChange} className="w-full border px-3 py-2 rounded" required />

          <input type="file" name="productImages" multiple onChange={handleAddChange} className="w-full border px-3 py-2 rounded" />
          <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded">Submit</button>
        </form>
      )}



    </div>


    
    </>

  );
}

export default ProductManage;
