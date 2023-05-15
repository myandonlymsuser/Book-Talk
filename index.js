const express = require("express");
const session = require("express-session");
const handlebars = require("express-handlebars").engine;
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express(), MONGO_URI = 'mongodb://127.0.0.1:27017/book_talk';
const store = new MongoDBStore({ uri: MONGO_URI, collection: 'mySessions' });

mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
    store.on('error', storeOnErr => { console.log(storeOnErr); });

    app.use(session({ secret: '@B00kT@lk@Secret', cookie: { maxAge: 604800000 }, store: store, resave: true, saveUninitialized: true }));
    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(methodOverride((req, res) => {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            const method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));
    app.engine('hbs', handlebars({ defaultLayout: 'main', extname: "hbs", layoutsDir: __dirname + "/views/layout", partialsDir: __dirname + "/views/partials" }));
    app.set('view engine', 'hbs');
    app.set('views', __dirname + "/views");

    app.use('/', require('./routes/home'));
    app.use('/user', require('./routes/user'));
    app.use('/guest', require('./routes/guest'));
    app.use('/book', require('./routes/book'));
    app.get('*', (req, res) => {
        let _id;
        req.session.user ? _id = req.session.user._id : _id = null;
        return res.render('home/404', { isAuth: req.session.isAuth, _id });
    });

    app.listen(3000, console.log(`App run on port: 3000`));
}, mongoErr => { console.log(`mongoErr: ${mongoErr}`); });
