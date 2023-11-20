const Order = require('../models/order');

const getOrders = async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ userId });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export default getOrders;