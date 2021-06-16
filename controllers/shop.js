const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    //fetching the products using sequelize

    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: 'My Shop',
                path: '/products',
                prods: products
            });
        })
        .catch(err => {
            console.log(err);
        })

    // using mysql2 to fetch all the products from database

    // Product.fetchAll()
    //     .then(([products]) => {
    //         res.render('shop/product-list', {
    //             pageTitle: 'My Shop',
    //             path: '/products',
    //             prods: products
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
}

// to get the particular product => product detail
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;

    // finding the product using the sequelize 

    Product.findByPk(productId)         // in sequelize findById is replace by findByPk
        .then(product => {
            res.render('shop/product-detail', {
                pageTitle: 'My Shop',
                path: '/products',
                product: product
            });
        })
        .catch(err => {
            console.log(err);
        })

    // or we can use findAll along with where clause in the sequelize to find the product

    // Product.findAll({ where: { id: productId } })
    //     .then(products => {
    //         res.render('shop/product-detail', {
    //             pageTitle: 'My Shop',
    //             path: '/products',
    //             product: products[0]
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })

    // using mysql2

    // Product.findById(productId)
    //     .then(([product]) => {
    //         res.render('shop/product-detail', {
    //             pageTitle: 'My Shop',
    //             path: '/products',
    //             product: product[0]
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })

}

exports.getIndex = (req, res, next) => {
    //fetching the products using sequelize

    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'My Shop',
                path: '/',
                prods: products
            });
        })
        .catch(err => {
            console.log(err);
        })

    // using mysql2 

    // Product.fetchAll()
    //     .then(([products]) => {
    //         res.render('shop/index', {
    //             pageTitle: 'My Shop',
    //             path: '/',
    //             prods: products
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
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