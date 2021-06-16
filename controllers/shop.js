const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([products]) => {
            res.render('shop/product-list', {
                pageTitle: 'My Shop',
                path: '/products',
                prods: products
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

// to get the particular product => product detail
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId)
        .then(([product]) => {
            res.render('shop/product-detail', {
                pageTitle: 'My Shop',
                path: '/products',
                product: product[0]
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([products]) => {
            res.render('shop/index', {
                pageTitle: 'My Shop',
                path: '/',
                prods: products
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);
    })
    res.redirect('/cart');
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];

            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);

                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart', {
                pageTitle: 'My Shop',
                path: '/cart',
                products: cartProducts
            });
        })
    })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;

    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { pageTitle: 'My Shop', path: '/orders' });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { pageTitle: 'My Shop', path: '/checkout' });
}