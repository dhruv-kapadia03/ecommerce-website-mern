import Promocode from "../models/promocode.model.js";

// POST : /api/add-promocode
const addPromocode = async (req, res) => {
    const { code, discountType, discountValue, isActive = true, expiryDate } = req.body;
    if (!code || !discountType || discountValue === undefined) {
        return res.status(400).json({ message: 'Code, discountType, and discountValue are required.' });
    }
    if (!['percentage', 'fixed'].includes(discountType)) {
        return res.status(400).json({ message: 'discountType must be either "percentage" or "fixed".' });
    }
    try {
        const existingPromocode = await Promocode.findOne({ code });
        if (existingPromocode) {
            return res.status(409).json({ message: 'Promocode with this code already exists.' });
        }
        const newPromocode = new Promocode({
            code,
            discountType,
            discountValue,
            isActive,
            expiryDate
        });
        await newPromocode.save();
        res.status(201).json({ message: 'Promocode created successfully.', promocode: newPromocode });
    } catch (error) {
        console.error('Error adding promocode:', error);
        res.status(500).json({ message: 'Failed to create promocode.' });
    }
}

// POST : /api/validate-promocode
const validatePromocode = async (req, res) => {
    const { promocode, totalAmount } = req.body;
    if (!promocode || totalAmount === undefined) {
        return res.status(400).json({ valid: false, message: 'Promocode and totalAmount are required.' });
    }
    try {
        const promocodeData = await Promocode.findOne({ code: promocode, isActive: true });
        if (!promocodeData) {
            return res.json({ valid: false, message: 'Invalid or expired promocode.' });
        }
        if (promocodeData.expiryDate && new Date() > promocodeData.expiryDate) {
            return res.json({ valid: false, message: 'Promocode has expired.' });
        }
        let discountedAmount = totalAmount;
        if (promocodeData.discountType === 'percentage') {
            discountedAmount = totalAmount * (1 - promocodeData.discountValue / 100);
        } else if (promocodeData.discountType === 'fixed') {
            discountedAmount = totalAmount - promocodeData.discountValue;
            discountedAmount = Math.max(0, discountedAmount); 
        }
        return res.json({ valid: true, discountedAmount });
    } catch (error) {
        console.error('Error validating promocode:', error);
        return res.status(500).json({ valid: false, message: 'Failed to validate promocode.' });
    }
}

// GET : /api/get-promocode
const getAllPromocodes = async (req, res) => {
    try {
        const promocodes = await Promocode.find({});
        res.json(promocodes);
    } catch (error) {
        console.error('Error fetching promocodes:', error);
        res.status(500).json({ message: 'Failed to fetch promocodes.' });
    }
}

// POST : /api/delete-promocode
const deletePromocode = async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ message: 'Promocode code is required.' });
    }
    try {
        const deletedPromocode = await Promocode.findOneAndDelete({ code });
        if (!deletedPromocode) {
            return res.status(404).json({ message: 'Promocode not found.' });
        }
        res.json({ message: 'Promocode deleted successfully.', promocode: deletedPromocode });
    } catch (error) {
        console.error('Error deleting promocode:', error);
        res.status(500).json({ message: 'Failed to delete promocode.' });
    }
}

export { 
    addPromocode, 
    validatePromocode, 
    getAllPromocodes, 
    deletePromocode 
};