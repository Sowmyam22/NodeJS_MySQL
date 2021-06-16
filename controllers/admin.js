const Product = require('../models/product');

// get the product form
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'My Shop',
        path: '/admin/add-product',
        editing: false
    });
};

// add product 
exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;

    //inserting data and creating product using sequelize

    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    //     // userId: req.user.id
    // })

    // when has the relations we can replace the above code as this
    req.user
        .createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,
        })
        .then(result => {
            console.log("Created Product");
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        })

    // storing the product in the fs

    // const product = new Product(null, title, imageUrl, price, description);

    // product.save()
    //     .then(() => {
    //         res.redirect('/');
    //     })
    //     .catch(err => { console.log(err) });
};

// get the edit product form
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    const productId = req.params.productId;

    req.user
        .getProducts({ where: { id: productId } })
        // Product.findByPk(productId)
        .then(products => {       // if no relation we use findByPk and fetch the single product
            const product = products[0];    // only if we get multiple products
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'My Shop',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => {
            console.log(err);
        })

    // Product.findById(productId, product => {
    //     if (!product) {
    //         res.redirect('/');
    //     }
    //     res.render('admin/edit-product', {
    //         pageTitle: 'My Shop',
    //         path: '/admin/edit-product',
    //         editing: editMode,
    //         product: product
    //     });
    // })
};

exports.postEditProduct = (req, res, next) => {
    const { productId, title, imageUrl, price, description } = req.body;

    // const updatedProduct = new Product(productId, title, imageUrl, price, description);
    // updatedProduct.save();

    // using sequelize to update the product details

    Product.findByPk(productId)
        .then(product => {
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;

            return product.save();   // sequelize provides save() method to update the details in the database
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}

// To get admin products along with edit and delete functionality
exports.getProducts = (req, res, next) => {
    // using sequelize to fetch the products

    // Product.findAll()
    req.user
        .getProducts()
        .then(products => {
            res.render('admin/products', {
                pageTitle: 'My Shop',
                path: '/admin/products',
                prods: products
            });
        })
        .catch(err => {
            console.log(err);
        })

    // using mysql2 to fetch the products

    // Product.fetchAll()
    //     .then(([products]) => {
    //         res.render('admin/products', {
    //             pageTitle: 'My Shop',
    //             path: '/admin/products',
    //             prods: products
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;

    // Product.deleteById(productId);
    // res.redirect('/admin/products');

    // using sequelize to delete the product

    // Product.destroy({ where: { id: productId } })
    //     .then(result => {
    //         res.redirect('/admin/products');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })

    // or

    Product.findByPk(productId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}