const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./config/database').mongoConnect;
const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb+srv://ngleanthu:ngleanthu@cluster0.jxr73.mongodb.net/fashion?retryWrites=true&w=majority';


const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const User = require('./models/user')
const app = express();

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use((req, res, next) => {
    User.findById('6778d80ca2da271b7464af64')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
   
});
app.use(productRoutes);
app.use('/manage-products', adminRoutes);
app.use(authRoutes);

// Admin dashboard and pages
app.get('/dashboard', (req, res) => res.render('admin/dashboard', { path: '/dashboard' }));
app.get('/manage-users', (req, res) => res.render('admin/manage-users', { path: '/manage-users' }));

// User pages
app.get('/', (req, res) => res.render('user/index', { path: '/' }));

app.get('/about', (req, res) => res.render('user/about', { path: '/about' }));
app.get('/blog', (req, res) => res.render('user/blog', { path: '/blog' }));
app.get('/blog-details', (req, res) => res.render('user/blog-details', { path: '/blog-details' }));
app.get('/contact', (req, res) => res.render('user/contact', { path: '/contact' }));
// app.get('/shopping-cart', (req, res) => res.render('user/shopping-cart', { path: '/shopping-cart' }));
// Start the server after database connection
// mongoConnect(() => {
//     app.listen(3000, () => {
//         console.log('Server is running on port 3000');
//     });
// });

// mongodb+srv://ngleanthu:ngleanthu@cluster0.jxr73.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect(
    'mongodb+srv://ngleanthu:ngleanthu@cluster0.jxr73.mongodb.net/test?retryWrites=true&w=majority'
    )
    .then(result => {
        User.findOne()
        .then(existingUser => {
            if (existingUser) {
                console.log('User already exists.');
                return;
            }
            const user = new User({
                email: 'ngleanthu@gmail.com',
                fullname: 'Anh Thư',
                username: 'ngleanthu',
                password: '123456',
                cart: { items: [] }
            });
            return user.save();
        });
        app.listen(3000);
    })
    .catch(err => console.log(err));