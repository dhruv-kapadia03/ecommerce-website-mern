import connectDB from './config/db.js';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config({ 
    path: './env' 
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
        app.get('/', (req, res) => res.send("API Working."));
    });
})
.catch((err) => {
    console.error("MONGO db connection failed !!! ", err);
});

