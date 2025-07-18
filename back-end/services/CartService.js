class CartService {
    constructor(db) {
        this.client = db.sequelize;
        this.Cart = db.Cart;
        this.CartItem = db.CartItem;
        this.Product = db.Product;
    }

    // Fetch items in the cart
    async getCartItems(id) {
        try {
            const cart = await this.Cart.findOne({
                where: { UserId: id },
                include: [{ 
                    model: this.CartItem,
                    include: [{
                        model: this.Product,
                        attributes: ['id', 'Name', 'Price']
                    }]},]
            })

            if (!cart) {
                throw new Error('Cart not found.');
            }
            
            return cart.CartItems.map(cartItem => ({
                ProductId: cartItem.Product.id,
                ProductName: cartItem.Product.Name,
                Price: cartItem.Product.Price,
                Quantity: cartItem.Quantity,
                TotalPrice: cartItem.Quantity * cartItem.Product.Price
            }))
        } catch (err) {
            console.error('Error fetching cart items:', err.message);
            throw err;
        }
    }

    // Fetch product by id
    async getProduct(id) {
        try {
            return await this.Product.findByPk(id)
        } catch (err) {
            console.error('Error finding product by ID:', err.message);
            throw new Error('Failed to find product by ID')
        }
    }

    async findOrCreate(id) {
        try {
            // Find existing cart
            let cart = await this.Cart.findOne({
                where: { UserId: id }
            });

            // Create new cart
            if (!cart) {
                cart = await this.Cart.create({ UserId: id })
            }

            return cart;

        } catch (err) {
            console.error('Error creating cart', err.message);
            throw new Error('Failed to create cart.')
        }
    }

    async addToCart(cartid, productId, quantity) {
        try {
            // Find the product
            const product = await this.getProduct(productId);

            if (!product) {
                throw new Error('Product not found');
            }

            // Find cart item
            let cartItem = await this.CartItem.findOne({
                where: { CartId: cartid, ProductId: productId }
            })

            // Get current cart quantity in cart, or default 0
            let currentQuantity = cartItem ? cartItem.Quantity : 0;
            let totalQuantity = currentQuantity + quantity;

            // Check if there's enough stock
            if (totalQuantity > product.Quantity) {
                throw new Error(`Insufficient stock for ${product.Name}. Only ${product.Quantity - currentQuantity} more available.`);
            }

            // Increase quantity in cart
            if (cartItem) {
                cartItem.Quantity += quantity;
                await cartItem.save();
            } else {
                cartItem = await this.CartItem.create({
                    CartId: cartid,
                    ProductId: productId,
                    Quantity: quantity
                })
            }

            return cartItem;
        } catch (err) {
            console.error('Error adding to cart', err.message);
            throw err;
        }
    }

    async removeFromCart(cartid, productId, quantity) {
        try {
            // Find product
            let product = await this.getProduct(productId);

            if (!product) {
                throw new Error('Product not found');
            }

            // Find cart item
            let cartItem = await this.CartItem.findOne({
                where: { CartId: cartid, ProductId: productId }
            });

            if (!cartItem) {
                throw new Error('Item not found in cart.');
            }

            // Reduce quantity or remove item from cart
            if (cartItem.Quantity > quantity) {
                cartItem.Quantity -= quantity
                await cartItem.save()
            } else {
                await cartItem.destroy()
            }

            return cartItem;
        } catch (err) {
            console.error('Error removing from cart', err.message);
            throw err;
        }
    }

    async clearCart(cartId) {
        try {
            // Delete all cart items for the given cart ID
            return await this.CartItem.destroy({
                where: { CartId: cartId }
            })
        } catch (err) {
            console.error('Error clearing cart', err.message);
            throw new Error('Failed to clear cart.');
        }
    }
}

module.exports = CartService;