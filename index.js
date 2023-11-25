const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs')
const path = require('path')

const restaurantRoutes = require('./routes/restaurant.js');
const userRoutes = require('./routes/user.js');
const paymentRoutes = require('./routes/payment.js');
const orderRoutes = require('./routes/order.js');

const app = express();
const port = 3000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use((req, res, next) => {
    if (req.originalUrl === '/create-checkout-session/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use('/api', restaurantRoutes)
app.use('/user', userRoutes)
app.use('/create-checkout-session', paymentRoutes)
app.use('/order', orderRoutes)

app.get('/', (req, res) => {
    res.send('YumYum- server')
})


//This route is only used to create restaurants menu json files
app.post('/create-menu', (req, res) => {
    const { id, info, menu } = req.body
    const filePath = path.join(__dirname, `./data/menu/${id}.json`)
    const data = JSON.stringify({ info, menu })
    if (fs.existsSync(filePath)) {
        console.log(`File ${filePath} already exists.`);
        return;
    }
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error(err)
            res.status(500).send('An error occurred');
        } else {
            console.log("File written successfully\n");
            res.json({ success: true })
        }
    })

})


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
connectDB();

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


