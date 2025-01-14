require('dotenv').config();
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const passport = require('passport');

// GET sign-in page
exports.getSignIn = (req, res, next) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (req.isAuthenticated()) {
        return res.redirect('/'); // Nếu đã đăng nhập, chuyển đến trang chủ
    }
    res.render("auth/signin", {
        path: '/signin', // Pass the path to the view
        isAuthenticated: req.session.isLoggedIn || false
    }); 
};

// POST sign-in (using Passport)
exports.postSignIn = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/', 
        failureRedirect: '/signin', 
        failureFlash: true 
    })(req, res, next);
};


// GET sign-up page
exports.getSignUp = (req, res, next) => {
    res.render("auth/signup", {
        path: "/signup",
        isAuthenticated: req.session.isLoggedIn || false,
        errorMessage: req.flash('error') || null // Truyền thông báo lỗi nếu có
    });
};

// POST sign-up (register new user)
exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let role = 0;
    if (password.startsWith(process.env.ADMIN_KEY)){
        role = 1;
    }
    const username = req.body.username;
    const fullname = req.body.fullname;
    User.findOne({email: email}).then(userDoc => {
        if(userDoc){
            return res.render('auth/signup', {
                errorMessage: 'Email này đã được đăng ký. Vui lòng chọn email khác.',
                path: "/signup",
            });
        }
        return bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                email: email,
                fullname: fullname,
                username: username,
                password: hashedPassword,
                cart: { items: [] },
                status: 1, 
                role: role,
                createdAt: new Date().toLocaleString('vi-VN'),
            });
            return user.save();
        })
        .catch(err => console.log(err));
    })   
    .catch(err => {
        console.log(err);
        res.redirect('/signup');
    });
};

// GET forgot password page
exports.getForgotPassword = (req, res, next) => {
    res.render("auth/forgotpassword", {
        path: "/forgotpassword",
    });
};


// GET logout
exports.getLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); 
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err); 
            }
            res.clearCookie('connect.sid'); 
            res.redirect('/'); 
        });
    });
};



// POST logout
exports.postLogout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/'); // Đăng xuất thành công, chuyển đến trang chủ
    });
};


//GET profile
exports.getProfile = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('user/profile', { user: req.user, path: '/profile' });
    } else {
        res.redirect('/signin');
    }
};
