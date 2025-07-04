import React, { useState, useEffect } from "react";
import "./Promocode.css";
import toast from 'react-hot-toast'; 

const Promocode = () => {
  const [promocodeForm, setPromocodeForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    isActive: true,
    expiryDate: "",
  });
  const [promocodes, setPromocodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromocodes();
  }, []);

  const fetchPromocodes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-promocode');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPromocodes(data);
    } catch (error) {
      console.error("Error fetching promocodes:", error);
      toast.error("Failed to load promocodes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromocodeForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-promocode', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...promocodeForm,
          // Ensure discountValue is a number
          discountValue: parseFloat(promocodeForm.discountValue),
          // Convert expiryDate to ISO string if it exists and is not empty
          expiryDate: promocodeForm.expiryDate ? new Date(promocodeForm.expiryDate).toISOString() : undefined,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed with status: ${response.status}`);
      }
      const data = await response.json();
      setPromocodes((prevPromocodes) => [...prevPromocodes, data.promocode]);
      setPromocodeForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        isActive: true,
        expiryDate: "",
      }); // Reset form
      toast.success('Promocode added successfully!'); 
    } catch (error) {
      console.error("Error adding promocode:", error);
      toast.error('Failed to add promocode'); 
    }
  };

  const handleDelete = async (code) => {
    // if (!window.confirm(`Are you sure you want to delete promocode "${code}"?`)) {
    //   return;
    // }
    try {
      const response = await fetch('/api/delete-promocode', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed with status: ${response.status}`);
      }
      setPromocodes((prevPromocodes) =>
        prevPromocodes.filter((promocode) => promocode.code !== code)
      );
      toast.success('Promocode deleted successfully!'); 
    } catch (error) {
      console.error("Error deleting promocode:", error);
      toast.error('Failed to delete promocoode.'); 
    }
  };

  return (
    <div className="promocode-container">
      <div className="add-promocode">
        <h1>Add Promocode</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Code</label>
            <input
              type="text"
              className="code"
              name="code"
              placeholder="Type Here"
              value={promocodeForm.code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="discountType">Discount Type</label>
            <select
              className="discountType"
              name="discountType"
              value={promocodeForm.discountType}
              onChange={handleChange}
              required
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="discountValue">Discount Value</label>
            <input
              type="number"
              className="discountValue"
              name="discountValue"
              placeholder="Type Here"
              value={promocodeForm.discountValue}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="isActive">Is Active</label>
            <input
              type="checkbox"
              className="isActive"
              name="isActive"
              checked={promocodeForm.isActive}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="date"
              className="expiryDate"
              name="expiryDate"
              value={promocodeForm.expiryDate}
              onChange={handleChange}
            />
          </div>
          <button className="submit-btn" type="submit">Add Code</button>
        </form>
      </div>

      <div className="promocode-list">
        <h2>All Promocodes</h2>
        {loading ? (
          <p>Loading promocodes...</p>
        ) : promocodes.length === 0 ? (
          <p>No promocodes added yet.</p>
        ) : (
          <div className="promocode-grid">
            <div className="grid-header">
              <span>Code</span>
              <span>Type</span>
              <span>Value</span>
              <span>Active</span>
              <span>Expiry Date</span>
              <span>Actions</span>
            </div>
            {promocodes.map((promocode) => (
              <div key={promocode.code} className="grid-row">
                <span data-label="Code">{promocode.code}</span>
                <span data-label="Type">{promocode.discountType}</span>
                <span data-label="Value">{promocode.discountValue}</span>
                <span data-label="Active">{promocode.isActive ? "Yes" : "No"}</span>
                <span data-label="Expiry Date">
                  {promocode.expiryDate
                    ? new Date(promocode.expiryDate).toLocaleDateString()
                    : "--"}
                </span>
                <span className="actions">
                  <button className="delete-btn" onClick={() => handleDelete(promocode.code)}>
                    ❌
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Promocode;