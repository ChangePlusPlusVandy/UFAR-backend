const express = require('express');
const expressJWT = require('express-jwt');
const connectDB = require('./database/connection');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
const formRouter = require('./routes/formRoutes');
const dataRouter = require('./routes/dataRoutes');
const validationRouter = require('./routes/validationRoutes');
const functions = require('./database/functions');
//const testEndPoint = require('./routes/GetUsersTest');

const PORT = process.env.PORT || 3001;

const app = express();

console.log("Testing form");

const authMiddleware = expressJWT({
        secret: process.env.JWT_SECRET,
        algorithms: ["HS256"],
        credentialsRequired: false 
    });

// connect database
connectDB();

app.use(cors()); // for server to be accessible by other origin
app.use(express.json()); // for parsing json
app.use(express.urlencoded({ extended: true })); // for parsing url encoded data
app.use(authMiddleware);

// ROUTES
app.use("/auth", authMiddleware, authRouter);
app.use("/form", authMiddleware, formRouter);
app.use("/data", authMiddleware, dataRouter);
app.use("/validation", authMiddleware, validationRouter);

app.get('/', (req, res) => {
    res.send('Hello World, this is UFAR');
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});