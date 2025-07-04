import { Router } from "express";

import { signupUser, 
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
} from "../controllers/user.controller.js";

import { authenticateUser, fetchUser } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/allusers', getAllUsers);
router.post('/removeuser', removeUser);

router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, upload.single('profileImage'), updateUserProfile);
router.put('/profile/password', authenticateUser, updateUserPassword);

router.post('/users/:userId/addresses', addNewAddress);
router.get('/users/:userId/addresses', getUserAddresses);
router.put('/users/:userId/addresses/:addressId', updateUserAddress);
router.delete('/users/:userId/addresses/:addressId', deleteUserAddress);

router.get('/getuser', fetchUser, getUserData);
router.post('/addtocart', fetchUser, addToCart);
router.post('/removefromcart', fetchUser, removeFromCart);
router.post('/getcart', fetchUser, getCart);
router.post('/getcheckoutproducts', fetchUser, getCheckoutProducts);

export default router;