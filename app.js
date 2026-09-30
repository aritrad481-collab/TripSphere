// =====================================================
// DOTENV
// =====================================================

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const dns = require("dns");


dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);
dns.setDefaultResultOrder("ipv4first");
// =====================================================
// DNS CONFIGURATION
// =====================================================




// =====================================================
// IMPORTS
// =====================================================

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const reviewRouter = require("./routes/review.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");

const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user.js");


// =====================================================
// DATABASE CONFIGURATION
// =====================================================

const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
    console.error("❌ ATLASDB_URL is not defined in .env");
    process.exit(1);
}

console.log("MongoDB URL loaded:", true);


// =====================================================
// APP CONFIGURATION
// =====================================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({
    extended: true
}));

app.use(methodOverride("_method"));

app.use(express.static(
    path.join(__dirname, "public")
));


// =====================================================
// SESSION
// =====================================================

const sessionOptions = {
    secret: process.env.SECRET,

    resave: false,

    saveUninitialized: true,

    cookie: {
        expires: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),

        maxAge: 7 * 24 * 60 * 60 * 1000,

        httpOnly: true
    }
};

app.use(session(sessionOptions));

app.use(flash());


// =====================================================
// PASSPORT
// =====================================================

app.use(passport.initialize());

app.use(passport.session());

passport.use(
    new LocalStrategy(User.authenticate())
);

passport.serializeUser(
    User.serializeUser()
);

passport.deserializeUser(
    User.deserializeUser()
);


// =====================================================
// LOCALS
// =====================================================

app.use((req, res, next) => {

    res.locals.currUser = req.user;

    res.locals.success = req.flash("success");

    res.locals.error = req.flash("error");

    next();
});


// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.redirect("/listings");
});


// =====================================================
// ROUTES
// =====================================================

app.use(
    "/listings",
    listingRouter
);

app.use(
    "/listings",
    reviewRouter
);

app.use(
    "/",
    userRouter
);


// =====================================================
// 404 ERROR
app.all("/{*splat}", (req, res, next) => {

    next(
        new ExpressError(
            404,
            "Page Not Found!"
        )
    );

});


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

    const {
        statusCode = 500,
        message = "Something went wrong!"
    } = err;

    res
        .status(statusCode)
        .render("error.ejs", {
            message
        });

});


// =====================================================
// DATABASE + SERVER START
// =====================================================

async function main() {

    try {

        console.log("🔄 Connecting to MongoDB Atlas...");

        await mongoose.connect(dbUrl);

        console.log(
            "✅ Connected to MongoDB Atlas"
        );

        app.listen(8080, () => {

            console.log(
                "🚀 Server is listening on port 8080"
            );

            console.log(
                "🌐 http://localhost:8080"
            );

        });

    } catch (err) {

        console.error(
            "❌ MongoDB connection failed:"
        );

        console.error(
            err.message
        );

        process.exit(1);
    }
}

main();