import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ message: 'Authentication required.' });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.user.id;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error); 
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

const fetchUser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({error: "Please authenticate using valid token."});
    }
    else {
        try {
            const data = jwt.verify(token, jwtSecret);
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({error: "Please authenticate using valid token."});
        }
    }
}

export { authenticateUser, fetchUser };