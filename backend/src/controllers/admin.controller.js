import Admin from "../models/admin.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminSecret = process.env.ADMIN_SECRET || 'admin_secret_key';

// POST : /api/admin/signup
const adminSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingAdmin = await Admin.findOne({});
        if (existingAdmin) {
            return res.status(400).json({ success: false, error: "An admin user already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ name, email, password: hashedPassword });
        await admin.save();
        res.json({ success: true, message: "Admin signed up successfully." });
    } catch (error) {
        console.error("Admin signup error:", error);
        res.status(500).json({ success: false, error: "Failed to signup admin." });
    }
}

// POST : /api/admin/login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log("Admin not found for email:", email);
            return res.status(404).json({ success: false, error: "Admin not found." });
        }
        const passCompare = bcrypt.compare(password, admin.password);
        if (passCompare) {
            const data = {
                admin: {
                    id: admin.id,
                },
            };
            const token = jwt.sign(data, adminSecret); 
            res.json({ success: true, token, isAdmin: true }); 
        } else {
            res.status(401).json({ success: false, error: "Wrong password." });
        }
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ success: false, error: "Failed to login." });
    }
}

export { 
    adminSignup, 
    adminLogin 
};