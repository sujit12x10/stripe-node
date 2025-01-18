const express = require('express');
const app = express();
require("dotenv").config();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

// Middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('BLACK Payment home'));

const port = process.env.PORT || 7000;

// Checkout API
app.get('/', (req, res) => res.send('Home Page Route'));
app.post("/api/create-checkout-session", async(req, res) => {
    const {products} = req.body

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name:product.name,
                images: [product.image_url1]
            },
            unit_amount: product.price * 100
        },
        quantity: product.quantity
    }))

    const couponCode = req.body.coupon ? [{coupon: req.body.coupon}] : []
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "https://blake-online-store.vercel.app/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://blake-online-store.vercel.app/cancel",  
        discounts: couponCode, 
    })

    res.json({id: session.id})
})

app.listen(port, () => {
    console.log("server started")
})