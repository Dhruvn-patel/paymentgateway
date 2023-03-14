const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const ejs = require('ejs');
const path = require('path');

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 7802;
const PUBLIC_KEY = 'pk_test_51MlOuZSDCHf8adi5O3PcUJXupmmuqOYUD89GRKpGA9gCW41P72S1YlXJzDVwFeb5sjCSoJ2r6DNb2TpobFKDWW0I00KQQjqixv';
const PRE_KEY = 'sk_test_51MlOuZSDCHf8adi5vk1J7x4WJhF3zpvAzchoAYMPTkO4mo7FxbijKBrVJz9b0fHahC0MeK1s62IsTyHIRfCAATZk00cLoLX19Z';
const stripe = require('stripe')(PRE_KEY);

app.get('/', (req, res) => {
    res.render('home.ejs', {
        PUBLIC_KEY: PUBLIC_KEY
    });
});


app.post('/payment', (req, res) => {


    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Gautam Sharma',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '110092',
            city: 'New Delhi',
            state: 'Delhi',
            country: 'India',
        }
    })
        .then((customer) => {

            return stripe.charges.create({
                amount: 7000, // Charing Rs 25
                description: 'Web Development Product',
                currency: 'USD',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("Success") // If no error occurs
        })
        .catch((err) => {
            res.send(err) // If some error occurs
        });
})






app.listen(PORT, (err) => {
    if (err) console.log(err.message);
    console.log(`http://localhost:${PORT}`);
})
