const router = require("express").Router();
const Book = require("../models/Book");
const { isUser } = require('../util/guestUser');
const createEdit = require('../util/createEdit');

// DETAILS
router.get('/details/:id', async (req, res) => {
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    const id = req.params.id;

    try {
        const book = await Book.findById(id).lean();

        if (!book) return res.render('home/404', { isAuth: req.session.isAuth, _id });

        const isOwner = req.session.user._id.equals(book.owner);
        const isWished = book.wishingList.filter(f => f.equals(req.session.user._id)).length > 0;

        return res.render('book/details', { isAuth: req.session.isAuth, _id, book, isOwner, isWished });
    } catch (detailsErr) {
        return console.log(`detailsErr: ${detailsErr}`);
    }
});

// WISH BOOK
router.get('/wish/:id', isUser, async (req, res) => {
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    const id = req.params.id;

    try {
        const book = await Book.findById(id).lean();
        
        if (!book) return res.render('home/404', { isAuth: req.session.isAuth, _id });
        if (book.owner.equals(req.session.user._id)) return res.render('home/404', { isAuth: req.session.isAuth, _id });

        let wishingList = [...book.wishingList, req.session.user._id];
        await Book.findByIdAndUpdate(id, { $set: { wishingList } });

        return res.redirect(`/book/details/${id}`);
    } catch (catalogErr) {
        return console.log(`catalogErr: ${catalogErr}`);
    }
});

// CREATE REVIEW
router.get('/create', isUser, (req, res) => { 
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    return res.render('book/create', { isAuth: req.session.isAuth, _id }) 
});

router.post('/create', isUser, async (req, res) => {
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    let { title, author, genre, stars, image, review } = req.body; 
    stars = +stars; title = title.trim(); author = author.trim(); genre = genre.trim(); image = image.trim(); review = review.trim();
    let old = { title, author, genre, stars, image, review };
    
    const errors = createEdit(title, author, genre, stars, image, review);

    if (0 < errors.length) return res.render('book/create', { isAuth: req.session.isAuth, _id, errors, old });

    try {
        const book = new Book({ title, author, genre, stars, image, review, owner: _id });
        await book.save();
        return res.redirect('/catalog');
    } catch (createErr) {
        return console.log(`createErr: ${createErr}`);
    }
});

// DELETE
router.get('/delete/:id', isUser, async (req, res) => {
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    const id = req.params.id;

    try {
        const book = await Book.findById(id).lean();

        if (!book) return res.render('home/404', { isAuth: req.session.isAuth, _id });
        if (!book.owner.equals(req.session.user._id)) return res.render('home/404', { isAuth: req.session.isAuth, _id });
        await Book.findByIdAndDelete(id);
        return res.redirect('/catalog');
    } catch (deleteErr) {
        return console.log(`deleteErr: ${deleteErr}`);
    }
});

// EDIT BOOK
router.get('/edit/:id', isUser, async (req, res) => {
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    const id = req.params.id;

    try {
        const book = await Book.findById(id).lean();

        if (!book) return res.render('home/404', { isAuth: req.session.isAuth, _id });
        if (!book.owner.equals(req.session.user._id)) return res.render('home/404', { isAuth: req.session.isAuth, _id });

        return res.render('book/edit', { isAuth: req.session.isAuth, _id, book });
    } catch (deleteErr) {
        return console.log(`deleteErr: ${deleteErr}`);
    }
});

router.put('/edit/:id', isUser, async (req, res) => {
    let _id;
    req.session.user ? _id = req.session.user._id : _id = null;
    let { title, author, genre, stars, image, review } = req.body; 
    stars = +stars; title = title.trim(); author = author.trim(); genre = genre.trim(); image = image.trim(); review = review.trim();
    let old = { title, author, genre, stars, image, review }, options = {};
    const errors = createEdit(title, author, genre, stars, image, review), id = req.params.id;

    if (0 < errors.length) return res.render('book/edit', { isAuth: req.session.isAuth, _id, errors, old });

    try {
        const book = await Book.findById(id).lean();

        if (!book) return res.render('home/404', { isAuth: req.session.isAuth, _id });
        if (!book.owner.equals(req.session.user._id)) return res.render('home/404', { isAuth: req.session.isAuth, _id });
        if (title != book.title) options.title = title;
        if (author != book.author) options.author = author;
        if (genre != book.genre) options.genre = genre;
        if (stars != book.stars) options.stars = stars;
        if (image != book.image) options.image = image;
        if (review != book.review) options.review = review;

        await Book.findByIdAndUpdate(id, options);
        return res.redirect(`/book/details/${id}`);
    } catch (updateErr) {
        return console.log(`updateErr: ${updateErr}`);
    }
});

module.exports = router;