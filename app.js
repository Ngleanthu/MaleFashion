const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./config/database').mongoConnect;
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
    User.findById('676db8d20fd5d1c80888b6b7')
        .then(user => {
            req.user = new User(user.email, user.fullname, user.username, user.password, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
   
});
app.use(productRoutes);
app.use(authRoutes);
app.use('/manage-products', adminRoutes);

// Admin dashboard and pages
app.get('/dashboard', (req, res) => res.render('admin/dashboard', { path: '/dashboard' }));
app.get('/manage-users', (req, res) => res.render('admin/manage-users', { path: '/manage-users' }));

// User pages
app.get('/', (req, res) => res.render('user/index', { path: '/' }));
app.get('/signin', (req, res) => res.render('user/signin', { path: '/signin' }));
app.get('/forgotpassword', (req, res) => res.render('user/forgotpassword', { path: '/forgotpassword' }));
app.get('/about', (req, res) => res.render('user/about', { path: '/about' }));
app.get('/blog', (req, res) => res.render('user/blog', { path: '/blog' }));
app.get('/blog-details', (req, res) => res.render('user/blog-details', { path: '/blog-details' }));

app.get('/checkout', (req, res) => res.render('user/checkout', { path: '/checkout' }));
app.get('/contact', (req, res) => res.render('user/contact', { path: '/contact' }));
// app.get('/shopping-cart', (req, res) => res.render('user/shopping-cart', { path: '/shopping-cart' }));
// Start the server after database connection
mongoConnect(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});
