const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = "whsec_97459639adbbc849729b5e2d02fd73133258531e0a5ad98b484967c6700b07cc"

const payment = async (req, res) => {
    const { cartData, userId } = req.body;

    const customer = await stripe.customers.create({
        metadata: {
            userId: userId,
        },
    });

    try {
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
            shipping_address_collection: {
                allowed_countries: ["US", "IN"],
            },
            customer: customer.id,
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });


        res.json({ url: session.url });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const webhook = (req, res) => {
    const rawBody = req.rawBody.toString('utf8');
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutCompleted = event.data.object;
            console.log(checkoutCompleted)
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
}

module.exports = { payment, webhook };
