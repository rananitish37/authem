const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    sku:{
        type: String,
        unique: true,
    },
    name:{
        type: String,
        required: true,
    },
    brand:{
        type: String,
        required: true,
    },
    colorway:{
        type: String,
        required: true,
    },
    size:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    images:{
        type: [String],
    },
    category:{
        type: String,
        enum: ["sneakers","apparel","accessories"],
        default: "sneakers",
    },
    condition:{
        type: String,
        enum: ["new", "used", "like new"],
        default: "new",
    },
    initialPrice:{
        type: Number,
        min: 0,
    },
    isActive:{
        type: Boolean,
        default: true,
    }
},{
    timestamps: true,
})

productSchema.pre("save", function(next){
    if(!this.sku){
        const brand    = this.brand.toUpperCase().replace(/ /g,"");
        const name     = this.name.toUpperCase().replace(/ /g,"");
        const colorway = this.colorway.toUpperCase().slice(0,3);
        const size     = this.size;
        this.sku = `${brand}-${name}-${colorway}-${size}`;
    }
    next();
})

const Product = mongoose.model("Product",productSchema);
module.exports = Product;