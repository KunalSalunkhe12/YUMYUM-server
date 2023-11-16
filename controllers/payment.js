const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const payment = async (req, res) => {
    const { cartData } = req.body;


    const cartDataArr = Object.values(cartData);
    const lineItems = cartDataArr.map((data) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: data.item.name,
                images: [
                    `https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/${data.item.imageId}`
                ],
            },
            unit_amount: data.item.price || data.item.defaultPrice,
        },
        quantity: data.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
};

module.exports = { payment };
