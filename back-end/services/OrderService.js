const { Op } = require('sequelize');
const MembershipService = require('./MembershipService');
const CartService = require('./CartService');

class OrderService {
    constructor(db) {
        this.client = db.sequelize;
        this.Order = db.Order;
        this.OrderItem = db.OrderItem;
        this.CartItem = db.CartItem;
        this.Cart = db.Cart;
        this.Product = db.Product;
        this.membershipService = new MembershipService(db);
        this.cartService = new CartService(db);
    }

    // Generate a random order number
    randomOrderNr() {
        return Math.random().toString(36).substring(2,10);
    }

    // Create a new order for the user
    async createOrder(id) {
        try {
            // Get the user's cart and cart items
            const cart = await this.Cart.findOne({
                where: { UserId: id },
                include: [{ model: this.CartItem }]
            });
            
            // Check if cart is empty
            if (!cart || cart.CartItems.length === 0) {
                throw new Error('Cart is empty.');
            }
            
            let totalItems = 0;
            let totalPrice = 0;
            const orderItemData = [];

            // Get the user's current membership status
            const currentMembership = await this.membershipService.getUserMembership(id);
            const currentDiscount = await currentMembership.DiscountPercent;

            
            // Check each item in the cart
            for (const item of cart.CartItems) {
                const product = await this.Product.findByPk(item.ProductId);
                
                // Check if there is enough stock
                if (product.Quantity < item.Quantity) {
                    throw new Error(`Insufficient stock for ${product.Name}, only ${product.Quantity} in stock.`);
                }
                totalItems += item.Quantity;

                // Apply membership discount
                const discountPrice = product.Price * (1 - currentDiscount / 100);
                totalPrice += discountPrice * item.Quantity

                // Store order item data
                orderItemData.push({
                    ProductId: product.id,
                    Quantity: item.Quantity,
                    PriceAtTime: discountPrice,
                })
                product.Quantity -= item.Quantity
                await product.save();
            }
            
            // Fetch previous orders from the user
            const previousOrders = await this.Order.findAll({
                where: { UserId: id },
                attributes: ['id']
            })
            const previousOrdersId = previousOrders.map(order => order.id);

            // Calculate total items purchased previously
            let previousItems = 0;
            if (previousOrdersId.length > 0) {
                previousItems = await this.OrderItem.sum('Quantity', {
                    where: {
                        OrderId: { [Op.in]: previousOrdersId }
                    }
                })
                previousItems = previousItems || 0;
            }

            // Calculate current order and previous orders
            const totalPurchases = previousItems + totalItems;
            
            // Create a new order
            const order = await this.Order.create({
                UserId: id,
                OrderNumber: this.randomOrderNr(),
                Status: 'In Progress',
                MembershipStatus: currentMembership.Status,
                TotalPrice: totalPrice.toFixed(2)
            })
            
            // Add each item to the order
            for (const itemData of orderItemData) {
                await this.OrderItem.create({
                    OrderId: order.id,
                    ...itemData
                })
            }

            // Clear the cart
            await this.cartService.clearCart(cart.id);

            // Update the user's membership after purchase
            await this.membershipService.updateMembership(id, totalPurchases);
            
            return order;
        } catch (err) {
            console.error('Error creating order', err.message);
            throw err;
        }
    }

    // Fetch order for the user
    async getOrder(id) {
        try {
            const order = await this.Order.findAll({
                where: { UserId: id },
                include: [{ model: this.OrderItem }]
            })
            
            return order;
        } catch (err) {
            console.error('Error finding order', err.message);
            throw new Error('Failed to find order');
        }
    }

    // Update the status of an order
    async updateStatus(id, status) {
        try {
            await this.Order.update(
                { Status: status },
                { where: { id: id } }
            )
            return await this.Order.findByPk(id);
        } catch (err) {
            console.error('Error updating order status', err.message);
            throw new Error('Failed to update order status');
        }
    }

    // Get all users orders
    async getOrders() {
        try {
            const orders = await this.Order.findAll({
                include: [{ model: this.OrderItem }]
            });

            const orderStatus = { 'In Progress': [], 'Ordered': [], 'Completed': [] };

            orders.forEach(order => {
                const status = order.Status;
                if (status && orderStatus[status]) {
                    orderStatus[status].push(order)
                }
            })
            return orderStatus

        } catch (err) {
            console.error('Error finding orders', err.message);
            throw new Error('Failed to find orders');
        }
    }
}

module.exports = OrderService;