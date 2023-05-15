const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { isGuest } = require("../util/guestUser");
const loginRegister = require("../util/loginRegister");

// REGISTER
router.get('/register', isGuest, (req, res) => {
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    return res.render('guest/register', { isAuth: req.session.isAuth, _id });
});

router.post('/register', isGuest, async (req, res) => {
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    let { username, email, password, confirm } = req.body;
    username = username.trim(); email = email.trim(); password = password.trim();
    const errors = loginRegister(username, email, password, confirm);

    if (0 < errors.length) return res.render('guest/register', { isAuth: req.session.isAuth, _id, errors, old: { username, email, password, confirm } });

    try {
        let user = await User.findOne({ email });

        if (user) return res.render('guest/register', { isAuth: req.session.isAuth, _id, errors: [{ err: "This email is allready in use" }], old: { username, email, password, confirm } });

        bcrypt.genSalt(10, (genSaltErr, salt) => {
            if (genSaltErr) return res.render('guest/register', { isAuth: req.session.isAuth, _id, errors: [{ err: `genSaltErr: ${genSaltErr}` }], old: { username, email, password, confirm } });

            bcrypt.hash(password, salt, async (hashErr, hash) => {
                if (hashErr) return res.render('guest/register', { isAuth: req.session.isAuth, _id, errors: [{ err: `hashErr: ${hashErr}` }], old: { username, email, password, confirm } });

                user = new User({ username, email, password: hash });
                req.session.isAuth = true;
                req.session.user = user;
                await user.save();
                return res.redirect('/');
            });
        });
    } catch (registerErr) {
        return console.log(`registerErr: ${registerErr}`);
    }
});

// LOGIN
router.get('/login', isGuest, (req, res) => {
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    return res.render('guest/login', { isAuth: req.session.isAuth, _id });
});

router.post('/login', isGuest, async (req, res) => {
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    let { email, password } = req.body;
    email = email.trim(); password = password.trim();
    const errors = loginRegister("username", email, password, "confirm", false);

    if (0 < errors.length) return res.render('guest/login', { isAuth: req.session.isAuth, _id, errors, old: { email, password } });

    try {
        const user = await User.findOne({ email });

        if (!user) return res.render('guest/login', { isAuth: req.session.isAuth, _id, errors: [{ err: "Wrong credentials!" }], old: { email, password } });

        bcrypt.compare(password, user.password, (compareErr, bres) => {
            if (!bres) return res.render('guest/login', { isAuth: req.session.isAuth, _id, errors: [{ err: "Wrong credentials!" }], old: { email, password } });
            if (compareErr) return res.render('guest/login', { isAuth: req.session.isAuth, _id, errors: [{ err: `compareErr: ${compareErr}` }], old: { email, password } });

            req.session.isAuth = true;
            req.session.user = user;
            return res.redirect('/');
        });
    } catch (loginErr) {
        return console.log(`loginErr: ${loginErr}`);
    }
});

module.exports = router;