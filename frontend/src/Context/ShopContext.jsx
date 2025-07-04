import React, { useState, createContext, useEffect } from "react";
import toast from 'react-hot-toast';

export const ShopContext = createContext(null);

const getDefaultCart = ()=>{
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0 ;
    }
    return cart;
}

const ShopContextProvider = (props)=>{

    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [selectedSizes, setSelectedSizes] = useState({});
    const [userId, setUserId] = useState(null); 

    useEffect(()=>{
        const fetchProducts = async ()=> {
            try {
                const res = await fetch('/api/getallproducts');
                const data = await res.json();
                setAll_Product(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
                toast.error("Failed to load products.");
            }
        };
        fetchProducts();

        const authToken = localStorage.getItem('auth-token');
        if (authToken) {
            fetch('/api/getuser', { 
                method: 'GET',
                headers: {
                    'auth-token': authToken,
                    'Content-Type': 'application/json',
                },
            }).then((res) => res.json())
                .then((data) => {
                    if (data && data._id) {
                        setUserId(data._id); // Store the userId in the context
                    } else {
                        console.error("User data or userId not found in response:", data);
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error);
                });

            fetch('/api/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': authToken,
                    'Content-Type': 'application/json',
                },
                body: "",
            }).then((res) => res.json())
            .then((data) => setCartItems(data));
        }
    }, []);

    const addToCart = (itemId, size = '') => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        setSelectedSizes((prev) => ({ ...prev, [itemId]: size }));
        const authToken = localStorage.getItem('auth-token');
        if (authToken) {
            fetch('/api/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': authToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": itemId }),
            })
                .then((res) => res.json())
                .then((data) => console.log(data))
                .catch((error) => console.error("Error adding to cart:", error));
        }
        toast.success("Product Added to Cart.");
    };

    useEffect(() => {
        const storedSizes = JSON.parse(localStorage.getItem("selectedSizes"));
        if (storedSizes) {
            setSelectedSizes(storedSizes);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedSizes", JSON.stringify(selectedSizes));
    }, [selectedSizes]);

    const removeFromCart = (itemId) => {
        setSelectedSizes((prev) => {  // remove size from localstorage
        const updatedSizes = { ...prev };
        if (!cartItems[itemId] || cartItems[itemId] === 1) {
            delete updatedSizes[itemId];
        }
        return updatedSizes;
        });
        setCartItems((prev)=>({...prev, [itemId]:prev[itemId]-1}));
        const authToken = localStorage.getItem('auth-token');
        if (authToken) {
            fetch('/api/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': authToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": itemId }),
            }).then((res) => res.json())
            .then((data) => console.log(data))
            .catch((error) => console.error("Error removing from cart:", error));
        }
        toast.success("Product Removed from Cart.");
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = ()=>{
        let totalItems = 0;
        for (const item in cartItems) 
        {
            if (cartItems[item] > 0) 
            {
                totalItems += cartItems[item];
            }
        }
        return totalItems;
    }
    
    const contextvalue = {
        getTotalCartAmount, 
        getTotalCartItems, 
        all_product, 
        cartItems, 
        selectedSizes, 
        addToCart, 
        removeFromCart,
        userId
    };
    
    return (
        <ShopContext.Provider value={contextvalue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
