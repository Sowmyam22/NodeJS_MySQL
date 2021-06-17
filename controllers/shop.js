const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
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
exports.getProduct = (req, res) => {
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

exports.getIndex = (req, res) => {
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

exports.postCart = (req, res) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  // using sequelize

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productId)

    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      })
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    })
  // Product.findById(productId, product => {
  //     Cart.addProduct(productId, product.price);
  // })
  // res.redirect('/cart');
}

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            pageTitle: 'My Shop',
            path: '/cart',
            products: products
          });
        })
        .catch(err => {
          console.log(err);
        });
    }).catch(err => {
      console.log(err);
    });


  // Cart.getCart(cart => {
  //     Product.fetchAll(products => {
  //         const cartProducts = [];

  //         for (product of products) {
  //             const cartProductData = cart.products.find(prod => prod.id === product.id);

  //             if (cartProductData) {
  //                 cartProducts.push({ productData: product, qty: cartProductData.qty });
  //             }
  //         }
  //         res.render('shop/cart', {
  //             pageTitle: 'My Shop',
  //             path: '/cart',
  //             products: cartProducts
  //         });
  //     })
  // })
}

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body.productId;

  // using sequelize to delete the cart item
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err)
    })

  // Product.findById(productId, product => {
  //   Cart.deleteProduct(productId, product.price);
  //   res.redirect('/cart');
  // });
}

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts()
    })
    .then(products => {
      req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            }))
        })
        .catch(err => {
          console.log(err);
        })
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'My Shop',
        path: '/orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
}

// exports.getCheckout = (req, res) => {
//   res.render('shop/checkout', {
//     pageTitle: 'My Shop',
//     path: '/checkout'
//   });
// }