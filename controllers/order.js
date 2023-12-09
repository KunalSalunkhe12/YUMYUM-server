const Order = require('../models/order');

const getOrders = async (req, res) => {
    const { id: userId } = req.user;
    try {
        const orders = await Order.find({ userId }).sort({ created: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

module.exports = { getOrders };