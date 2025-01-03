const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
// const ProductRouter = require('./Routes/ProductRouter');
const AdminRouter = require('./Routes/AdminRouter');

require('dotenv').config();
require('./Models/db');

const app = express();
const PORT = process.env.PORT || 8080;

// Health check route
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/auth', AuthRouter);
// app.use('/products', ProductRouter);
app.use('/admin', AdminRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: err.message
    });
});

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });

module.exports = app;
