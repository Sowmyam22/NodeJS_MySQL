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

    const product = new Product(null, title, imageUrl, price, description);

    product.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => { console.log(err) });
};

// get the edit product form
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }

    const productId = req.params.productId;
    Product.findById(productId, product => {
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
};

exports.postEditProduct = (req, res, next) => {
    const { productId, title, imageUrl, price, description } = req.body;

    const updatedProduct = new Product(productId, title, imageUrl, price, description);
    updatedProduct.save();

    res.redirect('/admin/products');
}

// To get admin products along with edit and delete functionality
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([products]) => {
            res.render('admin/products', {
                pageTitle: 'My Shop',
                path: '/admin/products',
                prods: products
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;

    Product.deleteById(productId);
    res.redirect('/admin/products');
}