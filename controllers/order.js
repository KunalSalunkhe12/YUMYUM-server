const Order = require('../models/order');

const getOrders = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    try {
        const orders = await Order.find({ userId });
        console.log(orders);
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

module.exports = { getOrders };