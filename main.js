require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 4000;

// DB connection
mongoose.set("strictQuery", true);
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose.connect(process.env.DB_URI, options);
const db = mongoose.connection;
db.on('error',(error) => console.log(`Error connecting to MongoDB:${error}`));
db.once('open', () => console.log('Connected to MongoDB!'));

// middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave : false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();

});

// define public directory as static
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

// set the template engine
app.set('view engine', 'ejs'); //ejs template using for view engine
app.set('views', 'views'); 

// routes
app.use(routes);


app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
});