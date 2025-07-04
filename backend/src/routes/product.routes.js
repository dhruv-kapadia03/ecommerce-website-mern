import { Router } from 'express';

import {
    addProduct,
    removeProduct,
    getAllProducts,
    updateStockStatus,
    getNewCollections,
    getKidsCollections,
    getWomensCollections,
    getMensCollections,
    getPopularProducts,
    getPopularInKids,
    getPopularInWomens,
    getPopularInMens,
    getRelatedProducts,
    getRelatedInKids,
    getRelatedInWomens,
    getRelatedInMens

} from '../controllers/product.controller.js';

const router = Router();

router.post('/addproduct', addProduct);
router.post('/removeproduct', removeProduct);
router.get('/getallproducts', getAllProducts);
router.post('/updatestockstatus', updateStockStatus);

router.get('/newcollections', getNewCollections);
router.get('/kidscollections', getKidsCollections);
router.get('/womenscollections', getWomensCollections);
router.get('/menscollections', getMensCollections);

router.get('/popular', getPopularProducts);
router.get('/popularinkids', getPopularInKids);
router.get('/popularinwomens', getPopularInWomens);
router.get('/popularinmens', getPopularInMens);

router.get('/relatedproducts', getRelatedProducts);
router.get('/relatedinkids', getRelatedInKids);
router.get('/relatedinwomens', getRelatedInWomens);
router.get('/relatedinmens', getRelatedInMens);

export default router;