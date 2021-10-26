const express = require('express');
const connectDB = require('./database/connection');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');

const PORT = process.env.PORT || 3001;

const app = express();

// connect database
connectDB();


app.use(cors()); // for server to be acceible by other origin
app.use(express.json()); // for parsing json
app.use(express.urlencoded({ extended: true })); // for parsing url encoded data

// ROUTES
app.use("/auth", authRouter);

app.get('/', (req, res) => {
    res.send('Hello World, this is UFAR');
    }
);


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
}
);