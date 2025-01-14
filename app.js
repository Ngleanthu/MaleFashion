require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./config/database').mongoConnect;
const mongoose = require('mongoose')
const session = require('express-session')
// const MongoDBStore = require('connect-mongodb-session')(session)
const passport = require("./config/passport");

const flash = require('connect-flash');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const User = require('./models/user')

const MONGO_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;


const app = express();

// const store = new MongoDBStore( {
//     uri: MONGO_URI,
//     collection: 'sessions'
// })
// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình session
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());

// Khởi tạo Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    // User.findById("678554e7b5dc05401b8a81ed").then(user =>{
    //     res.locals.user = user || null; 
    //     next();
    // })
    // .catch(err => {
    //     console.error(err);
    //     res.locals.user = null;  // Gán null nếu có lỗi
    //     next();
    // });
    if (req.isAuthenticated()) {
        res.locals.user = req.user;  // Truyền thông tin user cho tất cả các view
    } else {
        res.locals.user = null;  // Nếu chưa đăng nhập, user là null
    }
    next();
});



app.use(productRoutes);
app.use('/admin', adminRoutes);
app.use(authRoutes);

// Admin dashboard and pages
// app.get('/admin/dashboard', (req, res) => res.render('admin/dashboard', { path: '/dashboard' }));
// app.get('/manage-users', (req, res) => res.render('admin/manage-users', { path: '/manage-users' }));

// User pages
app.get('/', (req, res) => res.render('user/index', { path: '/'}));

app.get('/about', (req, res) => res.render('user/about', { path: '/about' }));
app.get('/blog', (req, res) => res.render('user/blog', { path: '/blog' }));
app.get('/blog-details', (req, res) => res.render('user/blog-details', { path: '/blog-details' }));
app.get('/contact', (req, res) => res.render('user/contact', { path: '/contact' }));

// mongodb+srv://ngleanthu:ngleanthu@cluster0.jxr73.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect(
        MONGO_URI
    )
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));