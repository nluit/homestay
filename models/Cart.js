module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id) {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item[0].ROOMTYPE_PRICE * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item[0].ROOMTYPE_PRICE;
    };

    // this.addByOne = function(id) {
    //     this.items[id].qty++;
    //     this.items[id].price += this.items[id].item.price;
    //     this.totalQty++;
    //     this.totalPrice += this.items[id].item.price;
    // }

    this.reduceByOne = function(id) {

        if (this.items[id].qty > 1) {
            this.items[id].qty--;
            this.items[id].price -= this.items[id].item.price;
            this.totalQty--;
            this.totalPrice -= this.items[id].item.price;
        } else if (this.items[id].qty == 1) {
            this.totalQty = 0
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }

    this.generateArray = function() {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};