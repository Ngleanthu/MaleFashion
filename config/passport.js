const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Đảm bảo đúng đường dẫn tới model User

// Cấu hình chiến lược đăng nhập local (email và mật khẩu)
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            // Tìm người dùng trong database theo email
            const user = await User.findOne({ email: email });
            
            if (!user) {
                return done(null, false, { message: 'Email không tồn tại' });
            }

            // So sánh mật khẩu người dùng nhập và mật khẩu trong cơ sở dữ liệu
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                return done(null, user); // Đăng nhập thành công
            } else {
                return done(null, false, { message: 'Mật khẩu không đúng' });
            }
        } catch (err) {
            console.log(err);
            return done(err); // Trả lại lỗi nếu có
        }
    })
);

// Cấu hình cách lưu trữ thông tin người dùng trong session
passport.serializeUser((user, done) => {
    done(null, user.id); // Lưu ID người dùng vào session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Lấy thông tin người dùng từ ID trong session
    } catch (err) {
        done(err); // Trả lại lỗi nếu có
    }
});

module.exports = passport; // Xuất khẩu passport
