const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

// const db = require('./util/database');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// connect to database and fetch the data from products table using mysql2

// db.execute('SELECT * FROM products')
// .then(result => {
//     console.log(result);
// }).catch(err => {
//     console.log(err);
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//registers the middleware for the incoming request
app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    });
});

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);

// sequelize.sync({ force: true })    // used to override the tables in the database
sequelize.sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Sowmya', email: 'sowmya@gmail.com' });
        }

        return user;
    })
    .then(user => {
        // console.log(user);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })

