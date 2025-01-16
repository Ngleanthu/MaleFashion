const User = require("../models/user");
const bcrypt = require('bcryptjs');
const passport = require('passport');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport')

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth: {
//         api_user: ,
//         api_key: 
//     }
// })
// );

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
        failureRedirect: 'signin',
        failureFlash: true
    })(req, res, next);
    
};

// GET sign-up page
exports.getSignUp = (req, res, next) => {
    res.render("auth/signup", {
        path: "/signup",
        isAuthenticated: req.session.isLoggedIn || false,
        errorMessage: req.flash('errorMessage') || null
    });
};

// // POST sign-up (register new user)
// exports.postSignUp = (req, res, next) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const username = req.body.username;
//     const fullname = req.body.fullname;
//     User.findOne({ email: email })
//         .then(userDoc => {
//             if (userDoc) {
//                 req.flash('errorMessage', 'Email này đã được đăng ký. Vui lòng chọn email khác.');
//                 return res.redirect('/signup');
//             }

//             // Tạo token xác thực
//             const token = crypto.randomBytes(20).toString('hex');

//             // Băm mật khẩu
//             return bcrypt.hash(password, 12).then(hashedPassword => {
//                 const user = new User({
//                     email: email,
//                     fullname: fullname,
//                     username: username,
//                     password: hashedPassword,
//                     cart: { items: [] },
//                     verificationToken: token, // Lưu token xác thực vào cơ sở dữ liệu
//                     isVerified: false,
//                     tokenExpiration: Date.now() + 3600000 // Token hết hạn sau 1 giờ
//                 });

//                 return user.save();
//             });
//         })
//         .then(user => {
//             // Gửi email xác thực cho người dùng
//             const verificationUrl = `http://localhost:3000/verify-email/${user.verificationToken}`;
//             const mailOptions = {
//                 from: 'hoclionl@gmail.com',
//                 to: email,
//                 subject: 'Xác thực email của bạn',
//                 text: `Nhấn vào liên kết sau để xác thực email: ${verificationUrl}`
//             };

//             // Gửi email
//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.log(error);
//                     user.remove();  // Xóa người dùng nếu gửi email thất bại
//                     return res.status(500).send('Không thể gửi email xác thực');
//                 } else {
//                     console.log('Email xác thực đã được gửi: ' + info.response);
//                     res.send('Đã gửi email xác thực. Vui lòng kiểm tra hộp thư của bạn!');
//                 }
//             });
            
//         })
//         .catch(err => {
//             console.log(err);
//             res.redirect('/signup');
//         });
// };

// exports.verifyEmail = (req, res, next) => {

//     if (user.isVerified) {
//         return res.redirect('/signin');  // Nếu người dùng đã xác thực rồi, chuyển tới trang đăng nhập
//     }
//     const token = req.params.token;

//     User.findOne({ verificationToken: token }).then(user => {
//         if (!user) {
//             return res.redirect('/signup'); // Token không hợp lệ
//         }
//         const currentTime = Date.now();
//         if (currentTime > user.tokenExpiration){
//             return res.redirect('/signup');
//         }
//         user.isVerified = true; // Đánh dấu người dùng là đã xác thực
//         user.verificationToken = undefined; // Xóa token xác thực khỏi cơ sở dữ liệu
//         user.tokenExpiration = undefined;

//         return user.save().then(result => {
//             res.redirect('/signin'); // Điều hướng người dùng tới trang đăng nhập
//         });
//     }).catch(err => {
//         console.log(err);
//         res.redirect('/signup');
//     });
// };


exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const fullname = req.body.fullname;
    User.findOne({email: email}).then(userDoc => {
        if (userDoc) {
            req.flash('errorMessage', 'Email này đã được đăng ký. Vui lòng chọn email khác.');
            return res.redirect('/signup');
        }        
        return bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                email: email,
                fullname: fullname,
                username: username,
                password: hashedPassword,
                cart: { items: [] },
                role: 0,
                status: 1
            });
            return user.save();
        })
        .then(result => {
            // Sau khi lưu người dùng thành công, chuyển hướng đến trang signin
            res.redirect('/signin');
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
            return next(err); // Xử lý lỗi nếu có
        }
        res.redirect('/'); // Chuyển hướng về trang chủ sau khi logout
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

exports.updateUser = async (req, res) => {
    const { fullname, email, username, password } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        if (fullname) user.fullname = fullname;
        if (username) user.username = username;
        if (email) user.email = email;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12); 
            user.password = hashedPassword;
        }

        await user.save();

        return res.redirect('/profile');

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

//GET profile
exports.getProfile = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('user/profile', { user: req.user, path: '/profile' });
    } else {
        res.redirect('/signin');
    }
};
