const User = require("../models/user.js");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


// SIGNUP
module.exports.signup = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        const newUser = new User({
            email,
            username
        });

        const registeredUser = await User.register(
            newUser,
            password
        );

        req.login(registeredUser, (err) => {

            if (err) {
                return next(err);
            }

            req.flash(
                "success",
                "Welcome to TripSphere!"
            );

            res.redirect("/listings");
        });

    } catch (err) {

        req.flash("error", err.message);

        res.redirect("/signup");
    }
};

// LOGIN FORM


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


// LOGIN


module.exports.login = (req, res) => {

    req.flash(
        "success",
        "Welcome back to TripSphere!"
    );

    const redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
};



// LOGOUT


module.exports.logout = (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash(
            "success",
            "You have been logged out!"
        );

        res.redirect("/listings");
    });
};