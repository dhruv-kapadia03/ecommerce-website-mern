import { Router } from 'express';
import {
    addPromocode,
    validatePromocode,
    getAllPromocodes,
    deletePromocode
} from '../controllers/promocode.controller.js';

const router = Router();

router.post('/add-promocode', addPromocode);
router.post('/validate-promocode', validatePromocode);
router.get('/get-promocode', getAllPromocodes);
router.post('/delete-promocode', deletePromocode);

export default router;