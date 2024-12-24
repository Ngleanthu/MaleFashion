const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('user/signup', { path: '/signup', error: null }); // Truyền path cho view
});

router.post('/signup', async (req, res) => {
    const { name, email, username, password, confirmPassword } = req.body;

    // Validation
    if (password !== confirmPassword) {
        return res.status(400).render('user/signup', { path: '/signup', error: "Passwords do not match" });
    }

    try {
        // Logic để thêm user vào database
        res.redirect('/signin'); // Chuyển hướng tới trang đăng nhập
    } catch (error) {
        console.error(error);
        res.status(500).render('user/signup', { path: '/signup', error: "Something went wrong" });
    }
});


module.exports = router;
