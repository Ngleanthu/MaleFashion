const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./config/database').mongoConnect;
const productRoutes = require('./routes/products');
const app = express();
const authRoutes = require('./routes/auth');
const addProductRoutes = require('./routes/admin')

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/shop', productRoutes);
app.use(authRoutes);

app.use('/manage-products', addProductRoutes);
app.get('/dashboard', (req, res) => {
    res.render('admin/dashboard', {path: '/dashboard' });
});

app.get('/manage-products', (req, res) => {
    res.render('admin/manage-products', {path: '/manage-products' });
});
app.get('/manage-users', (req, res) => {
    res.render('admin/manage-users', {path: '/manage-users' });
});
app.get('/', (req, res) => {
    res.render('user/index', {path: '/' });
});

app.get('/signin', (req, res) => {
    res.render('user/signin', {path: '/signin' });
});
app.get('/forgotpassword', (req, res) => {
    res.render('user/forgotpassword', {path: '/forgotpassword' });
});
// app.get('/signup', (req, res) => {
//     res.render('user/signup', {path: '/signup' });
// });
mongoConnect(() => {
    app.listen(3000);
});
