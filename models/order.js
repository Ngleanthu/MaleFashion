
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        product: { type: Object, required: true},
        quantity: { type: Number, required: true}
    }],
    user: {
        name: {
            type: Object,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }        
    },
    createdAt: { type: String, required: true },  // Ngày tạo đơn hàng
    status: { type: String, default: 'Đang xác nhận' }
});

module.exports = mongoose.model("Order", orderSchema);