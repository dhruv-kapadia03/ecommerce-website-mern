import Users from "../models/user.model.js";
import Product from "../models/product.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'jwt_secret_key';
const saltRounds = 10;

// ------------------------------------------------------------------------------ //
const signupUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, error: "Please provide all required fields." });
    }
    if (password.length < 6 || password.length > 8) {
        return res.status(400).json({ success: false, error: "Password must be between 6 to 8 characters." });
    }
    try {
        let check = await Users.findOne({ email: email });
        if (check) {
            return res.status(400).json({ success: false, error: "Existing user found with same email." });
        }

        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new Users({
            name: username,
            email: email,
            password: hashedPassword,
            cartData: cart
        });
        await user.save();

        const data = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(data, jwtSecret);
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ success: false, error: "Failed to sign up user." });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: "Please provide email and password." });
    }
    let user = await Users.findOne({email: req.body.email}); // finding the user for login
    if (user) {
    const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, jwtSecret);
            res.json({success: true, token, name: user.name}); 
        }
        else {
            res.json({success: false, error: "Wrong password."})
        }
    }
    else {
        res.json({success: false, error: "Wrong email."})
    }
}
// ------------------------------------------------------------------------------ //


// ------------------------------------------------------------------------------ //
const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({});
        const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const removeUser = async (req, res) => {
    try {
        const { email } = req.body;
        await Users.findOneAndDelete({ email });
        res.json({ success: true, message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const user = await Users.findById(req.userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updates = { name, email };
        if (req.file) {
            updates.profileImage = `http://localhost:${process.env.PORT}/images/${req.file.filename}`;
        }
        const updatedUser = await Users.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
}

const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide both current and new password."})
        }
        if (newPassword.length < 6 || newPassword.length > 8) {
            return res.status(400).json({ message: 'New password must be between 6 and 8 characters.' });
        }
        const user = await Users.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password.' });
        }
        // if (!newPassword) {
        //     return res.status(400).json({ message: 'New password cannot be empty.' });
        // }
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: 'Password updated successfully. Please login again.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Failed to update password.' });
    }
}
// ------------------------------------------------------------------------------ //


// ------------------------------------------------------------------------------ //
const addNewAddress = async (req, res) => {
    try {
        const userId = req.params.userId;
        const newAddress = req.body;
        const user = await Users.findByIdAndUpdate(
            userId,
            { $push: { addresses: newAddress } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(201).json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserAddresses = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUserAddress = async (req, res) => {
    try {
        const userId = req.params.userId;
        const addressId = req.params.addressId;
        const updatedAddress = req.body;
        const user = await Users.findOneAndUpdate(
            { _id: userId, 'addresses._id': addressId },
            { $set: { 'addresses.$': updatedAddress } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User or address not found' });
        }
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteUserAddress = async (req, res) => {
    try {
        const userId = req.params.userId;
        const addressId = req.params.addressId;
        const user = await Users.findByIdAndUpdate(
            userId,
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User or address not found' });
        }
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// ------------------------------------------------------------------------------ //


// ------------------------------------------------------------------------------ //
const getUserData = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).send('Internal Server Error');
    }
} 

const addToCart = async (req, res) => {
    try {
        console.log("Added", req.body.itemId);
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, error: "User not found." });
        }
        userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Added to cart.");
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, error: "Failed to add to cart." });
    }
}

const removeFromCart = async (req, res) => {
    try {
        console.log("Removed", req.body.itemId);
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, error: "User not found." });
        }
        if (userData.cartData[req.body.itemId] > 0)
            userData.cartData[req.body.itemId] -= 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Removed from cart.");
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ success: false, error: "Failed to remove from cart." });
    }
}

const getCart = async (req, res) => {
    try {
        console.log("Get Cart.");
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, error: "User not found." });
        }
        res.json(userData.cartData);
    } catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).json({ success: false, error: "Failed to get cart." });
    }
}

const getCheckoutProducts = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'User email is required.' });
        }
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const userCart = user.cartData;
        const productIdsInCart = Object.keys(userCart)
            .filter(key => userCart[key] > 0)
            .map(Number); // Convert keys (product IDs) to numbers
        if (productIdsInCart.length === 0) {
            return res.json([]);
        }
        const products = await Product.find({ id: { $in: productIdsInCart } });
        const checkoutProducts = products.map(product => {
            const productIdString = String(product.id); //Convert product.id to string to match cartData key
            return {
                ...product.toObject(),
                quantity: userCart[productIdString] || 0  //access quantity, default to 0 if not found
            };
        });
        res.json(checkoutProducts);
        console.log(checkoutProducts);
    } catch (error) {
        console.error('Error fetching checkout products by email:', error);
        res.status(500).json({ error: 'Failed to fetch checkout products.' });
    }
}
// ------------------------------------------------------------------------------ //

export { 
    signupUser, 
    loginUser, 
    getAllUsers, 
    removeUser, 
    getUserProfile, 
    updateUserProfile,
    updateUserPassword,
    addNewAddress,
    getUserAddresses,
    updateUserAddress,
    deleteUserAddress,
    getUserData,
    addToCart,
    removeFromCart,
    getCart,
    getCheckoutProducts
};