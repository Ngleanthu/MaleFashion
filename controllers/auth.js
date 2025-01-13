exports.getSignIn = (req, res, next) => {
    res.render("auth/signin", {
        path: "/signin",
    });
};
exports.postSignIn = (req, res, next) => {
    res.render("auth/signin", {
        path: "/signin",
    });
};
exports.getSignUp = (req, res, next) => {
    res.render("auth/signup", {
        path: "/signup",
    });
};
exports.getForgotPassword = (req, res, next) => {
    res.render("auth/forgotpassword", {
        path: "/forgotpassword",
    });
};