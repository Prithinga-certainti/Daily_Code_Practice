const express=require('express');
const app=express();
app.use(express.json());
const orders =[];
function validatorOrder(req,res,next){
    const { customerName, customerType, items } = req.body;
    if (!customerName || !customerType || !items?.length) {
        return res.status(400).json({
        message: "Invalid Order"
        });
    }
    next();
}
function calculateTotal(items) {
    return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
    }, 0);
}
function applyDiscount(total, customerType) {
    if (customerType === "Premium") {
    return total * 0.9;
    }
    if (customerType === "Gold") {
    return total * 0.8;
    }
    return total;
}
app.post("/orders", validateOrder, (req, res) => {
    const { customerName, customerType, items } = req.body;
    const totalAmount = calculateTotal(items);
    const finalAmount = applyDiscount(totalAmount, customerType);
    const order = {
        id: Date.now(),
        customerName,
        customerType,
        items,
        totalAmount,
        finalAmount,
        status: "Processing"
    };
    orders.push(order);
    res.status(201).json(order);
});
app.get("/orders", (req, res) => {
    res.json(orders);
});
app.patch("/orders/:id", (req, res) => {
    const order = orders.find(order => order.id == req.params.id);
    if (!order) {
    return res.status(404).json({
    message: "Order Not Found"
    });
    }
    order.status = req.body.status;
    res.json(order);
});
app.listen(3000, () => {
    console.log("Server Running in port 3000");
});
