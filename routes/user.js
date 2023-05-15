const router = require("express").Router();
const Book = require("../models/Book");

router.get('/profile/:id', async (req, res) => {    
    let _id;

    req.session.user ? _id = req.session.user._id : _id = null;
    if (!req.session.user._id.equals(req.params.id)) return res.redirect('/');
    
    const email = req.session.user.email;

    try {
        const wished = await Book.find({ wishingList: req.session.user._id }).lean();
        return res.render('user/profile', { isAuth: req.session.isAuth, _id, email, wished });
    } catch (profileErr) {
        return console.log(`profileErr: ${profileErr}`);
    }
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) res.status(400).send('Unable to log out');
            else return res.redirect('/');
        });
    } else res.end();
});

module.exports = router;