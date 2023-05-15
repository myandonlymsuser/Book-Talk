const router = require("express").Router();
const Book = require("../models/Book");

router.get('/', (req, res) => { 
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    return res.render('home/home', { isAuth: req.session.isAuth, _id });
 });

router.get('/catalog', async (req, res) => {
    try {
        let books = await Book.find({}).lean(), _id;
        req.session.user ? _id = req.session.user._id : _id = null;
        return res.render('home/catalog', { isAuth: req.session.isAuth, _id, books });
    } catch (catalogErr) {
        return console.log(`catalogErr: ${catalogErr}`);
    }
});

module.exports = router;