const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const Order = require("../models/order");

const payment = async (req, res) => {
    const { cartData } = req.body;
    const { id: userId } = req.user

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
                    metadata: {
                        imageId: data.item.imageId
                    },
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

const fulfillOrder = async (customerData, checkoutCompleted) => {

    const order = new Order({
        userId: customerData.metadata.userId,
        payment_intent: checkoutCompleted.payment_intent,
        line_items: {
            data: checkoutCompleted.line_items.data
        },
        amount_total: checkoutCompleted.amount_total,
        created: checkoutCompleted.created,
        currency: checkoutCompleted.currency,
        customer: checkoutCompleted.customer,
        customer_details: {
            address: {
                city: checkoutCompleted.customer_details.address.city,
                country: checkoutCompleted.customer_details.address.country,
                line1: checkoutCompleted.customer_details.address.line1,
                line2: checkoutCompleted.customer_details.address.line2,
                postal_code: checkoutCompleted.customer_details.address.postal_code,
                state: checkoutCompleted.customer_details.address.state
            },
            email: checkoutCompleted.customer_details.email,
            name: checkoutCompleted.customer_details.name
        },
        payment_status: checkoutCompleted.payment_status
    });

    try {
        await order.save();
        console.log("Order saved successfully")
    } catch (error) {
        console.log(error);
    }
}

const webhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutCompleted = await stripe.checkout.sessions.retrieve(
                event.data.object.id,
                {
                    expand: ['line_items'],
                }
            );
            const customerData = await stripe.customers.retrieve(checkoutCompleted.customer);

            if (checkoutCompleted.payment_status === 'paid') {
                fulfillOrder(customerData, checkoutCompleted)

                res.status(200).json({ success: true, message: 'Webhook processed successfully' });

            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
}

module.exports = { payment, webhook };
