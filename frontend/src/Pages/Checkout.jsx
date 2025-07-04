import React, {useState, useContext, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./CSS/Checkout.css";
import {ShopContext} from "../Context/ShopContext.jsx";
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {cartItems, all_product, getTotalCartAmount, userId} = useContext(ShopContext);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [finalTotal, setFinalTotal] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newShippingAddress, setNewShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const fetchUserAddresses = async () => {
    if (userId) {
      try {
        const response = await fetch(`/api/users/${userId}/addresses`);
        if (response.ok) {
          const data = await response.json();
          setSavedAddresses(data);
          if (data.length > 0 && !selectedAddressId) {
            setSelectedAddressId(data[0]._id);
          }
        } else {
          console.error("Failed to fetch user addresses");
          toast.error("Failed to load saved addresses.");
        }
      } catch (error) {
        console.error("Error fetching user addresses:", error);
        toast.error("Error loading saved addresses.");
      }
    }
  };

  useEffect(() => {
    fetchUserAddresses();
    const itemsInCart = Object.keys(cartItems).filter((key) => cartItems[key] > 0);
    const detailedItems = itemsInCart.map((itemId) => {
      const product = all_product.find((p) => p.id === Number(itemId));
      return product ? {...product, quantity: cartItems[itemId]} : null;
    }).filter(Boolean);
    setCheckoutItems(detailedItems);
    setFinalTotal(location.state?.finalTotal || getTotalCartAmount());

    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          toast.error("Failed to load Razorpay SDK. Please try again later.");
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };
    loadRazorpay();
  }, [cartItems, all_product, getTotalCartAmount, location.state?.finalTotal, userId]);
  

  const handleAddressSelect = (event) => {
    setSelectedAddressId(event.target.value);
  };

  const handleNewAddressInputChange = (event) => {
    const {name, value} = event.target;
    setNewShippingAddress({...newShippingAddress, [name]: value});
  };

  const handleAddNewAddress = () => {
    setShowNewAddressForm(true);
  };

  const handleSaveNewAddress = async (event) => {
    event.preventDefault();
    if (!userId) { 
      toast.error("User not logged in.");
      return;
    }
    try {
      const response = await fetch(`/api/users/${userId}/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newShippingAddress),
      });
      if (response.ok) {
        const newAddresses = await response.json();
        setSavedAddresses(newAddresses);
        if (newAddresses.length > 0) {
          setSelectedAddressId(newAddresses[newAddresses.length - 1]._id);
        }
        setShowNewAddressForm(false);
        setNewShippingAddress({ name: "", address: "", city: "", state: "", zipCode: "" });
        toast.success("New address saved!");
      } else {
        console.error("Failed to save new address");
        toast.error("Failed to save new address.");
      }
    } catch (error) {
      console.error("Error saving new address:", error);
      toast.error("Error saving new address.");
    }
  };

  const renderAddressForm = () => (
    <form className="shipping-form" onSubmit={handleSaveNewAddress}>
      <div className="form-group">
        <label htmlFor="new-name">Name:</label>
        <input type="text" id="new-name" name="name" value={newShippingAddress.name} onChange={handleNewAddressInputChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="new-address">Address:</label>
        <textarea id="new-address" name="address" value={newShippingAddress.address} onChange={handleNewAddressInputChange} rows="2" required />
      </div>
      <div className="form-group">
        <label htmlFor="new-city">City:</label>
        <input type="text" id="new-city" name="city" value={newShippingAddress.city} onChange={handleNewAddressInputChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="new-state">State:</label>
        <input type="text" id="new-state" name="state" value={newShippingAddress.state} onChange={handleNewAddressInputChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="new-zipCode">Zip Code:</label>
        <input type="text" id="new-zipCode" name="zipCode" value={newShippingAddress.zipCode} onChange={handleNewAddressInputChange} required />
      </div>
      <button type="submit" className="save-address-btn">Save Address</button>
      <button type="button" onClick={() => setShowNewAddressForm(false)} className="cancel-address-btn">Cancel</button>
    </form>
  );

  const handlePay = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }
    try {
      const orderResponse = await fetch("/api/create-razorpay-order", {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: finalTotal }),
        }
      );
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        // console.error("Failed to create Razorpay order", errorData);
        toast.error("Failed to initiate payment. Please try again.");
        return;
      }

      const orderData = await orderResponse.json();
      const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId);

      const options = {
        // key: process.env.REACT_APP_RAZORPAY_KEY_ID,   // use this method or below
        key: orderData.key,   
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: "CLOSY",
        description: "Payment for your order",
        handler: async (response) => {
          try {
            const verificationResponse = await fetch("/api/verify-razorpay-payment", {
              method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  address: selectedAddress, 
                  userId: userId,
                  cartItems: cartItems,
                  totalAmount: finalTotal,
                }),
              }
            );
            if (verificationResponse.ok) {
              navigate("/payment-success");
            } else {
              navigate("/payment-failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            navigate("/payment-failed");
          }
        },
        prefill: {
          name: selectedAddress?.name || undefined,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

      rzp1.on("payment.failed", (response) => {
        console.error("Razorpay Payment Failed:", response);
        navigate("/payment-failed");
      });
    } catch (error) {
      console.error("Error during payment initiation:", error);
      toast.error("Failed to initiate payment. Please try again later.");
    }
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="checkout-page">
      <button onClick={handleBackToCart} className="back-btn">
        Back to Cart
      </button>
      <div className="checkout-grid">
        <div className="checkout-column">
          <div className="shipping-info">
            <h2>Shipping Address</h2>
            {savedAddresses.length > 0 ? (
              <div className="address-selection">
                <select value={selectedAddressId} onChange={handleAddressSelect} className="address-select">
                  <option value="">Select an address</option>
                  {savedAddresses.map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.name}, {address.address}, {address.city}, {address.state} - {address.zipCode}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleAddNewAddress} className="button add-new-address-btn">Add New</button>
              </div>
            ) : (
              <div>
                <p>No saved addresses found.</p>
                <button type="button" onClick={handleAddNewAddress} className="button add-new-address-btn">Add New</button>
              </div>
            )}
            {showNewAddressForm && renderAddressForm()}
          </div>
        </div>

        <div className="checkout-column">
          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="order-items">
              {checkoutItems.map((item) => (
                <div key={item.id} className="item-details-checkout">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-image-checkout"
                  />
                  <div className="item-info-checkout">
                    <span className="item-name-checkout">{item.name}</span>
                    <span className="item-quantity-checkout">
                      Quantity: {item.quantity}
                    </span>
                    <span className="item-price-checkout">
                      ₹{item.new_price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total-checkout">
              <span>Total:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
            <button onClick={handlePay} className="pay-button" disabled={!selectedAddressId}>
              Pay Now
            </button>
            {!selectedAddressId && <p className="error-message">Please select a shipping address before proceeding.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;