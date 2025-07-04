import Product from "../models/product.model.js";

// add a new product : POST : /api/addproduct
const addProduct = async (req, res) => {
    try {
        let products = await Product.find();
        let id;
        if (products.length > 0) {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id + 1;
        }
        else {
            id = 1;
        }
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price
        });
        console.log(product);
        await product.save();
        console.log("Product Saved.");
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.log("Error adding product:", error);
        res.status(500).json({ success: false, error: "Failed to add product." });
    }
}

// remove a product : POST : /api/removeproduct
const removeProduct = async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        console.log("Product removed.");
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.log("Error removing product:", error);
        res.status(500).json({ success: false, error: "Failed to remove product." });
    }
}

// getting all products : GET : /api/allproducts
const getAllProducts = async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("All Products Fetched.");
        res.send(products);
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ success: false, error: "Failed to fetch all products." });
    }
};

// update the stock status : POST : /api/updateStockStatus
const updateStockStatus = async (req, res) => {
    try {
        const {id, newStockStatus} = req.body;
        const result = await Product.findOneAndUpdate(
            {id: id},
            {available: newStockStatus},  // Update 'available' field
            {new: true}  // return updated document
        ); 
        if (!result) {
            return res.status(404).send({ error: "Product not found" });
        }
        console.log("Stock status updated");
        res.status(200).send({ message: "Stock status updated successfully", updatedProduct: result });
    } catch (error) {
        console.error("Error updating stock status:", error);
        res.status(500).send({ error: "Failed to update stock status" });
    }
}


// ------------------------------------------------------------------------------ //
// collection based products
const getNewCollections = async (req, res) => {
    try {
        let products = await Product.find({});
        let newcollection = products.slice(1).slice(-8);
        console.log("New Collections Fetched.");
        res.send(newcollection);
    } catch (error) {
        console.error("Error fetching new collections:", error);
        res.status(500).json({ success: false, error: "Failed to fetch new collections." });
    }
}; 

const getKidsCollections = async (req, res) => {
    try {
        let products = await Product.find({ category: 'kid' });
        let slicedItems = products.slice(0 ,8);
        console.log("Kids Collection Fetched.");
        res.send(slicedItems);
    } catch (error) {
        console.error("Error fetching kids collections:", error);
        res.status(500).json({ success: false, error: "Failed to fetch kids collections." });
    }
}

const getWomensCollections = async (req, res) => {
    try {
        let products = await Product.find({ category: 'women' });
        let slicedItems = products.slice(0 ,8);
        console.log("Women Collection Fetched.");
        res.send(slicedItems);
    } catch (error) {
        console.error("Error fetching women collections:", error);
        res.status(500).json({ success: false, error: "Failed to fetch women collections." });
    }
}

const getMensCollections = async (req, res) => {
    try {
        let products = await Product.find({ category: 'men' });
        let slicedItems = products.slice(0 ,8);
        console.log("Men Collection Fetched.");
        res.send(slicedItems);
    } catch (error) {
        console.error("Error fetching men collections:", error);
        res.status(500).json({ success: false, error: "Failed to fetch men collections." });
    }
}
// ------------------------------------------------------------------------------ //


// ------------------------------------------------------------------------------ //
// Popular Products
const getPopularProducts = async (req, res) => {
    try {
        const popularItemIds = [
            '67ea6fc1040ce29eaad8548c',
            '67ea702b040ce29eaad854ab',
            '67ea70a3040ce29eaad854c6',
            '67ea7155040ce29eaad854dd',
        ];
        const popularItems = await Product.find({ _id: { $in: popularItemIds } });
        if (popularItems.length === 4) {
            console.log("Popular Products Fetched.");
            res.send(popularItems);
        } else {
            console.log("Error: Could not retrieve all specific popular items.");
            res.status(500).send("Error: Could not retrieve all specific popular items.");
        }
    } catch (error) {
        console.error("Error fetching specific popular items:", error);
        res.status(500).send("Internal Server Error");
    }
}

const getPopularInKids = async (req, res) => {
    try {
        let products = await Product.find({ category: 'kid' });
        let slicedProducts = products.slice(0, 4); 
        console.log("Popular in Kids Fetched.");
        res.send(slicedProducts);
    } catch (error) {
        console.error("Error fetching popular kids products:", error);
        res.status(500).json({ success: false, error: "Failed to fetch popular kid products." });
    }
}

const getPopularInWomens = async (req, res) => {
    try {
        let products = await Product.find({ category: 'women' });
        let slicedProducts = products.slice(0, 4); 
        console.log("Popular in Women Fetched.");
        res.send(slicedProducts);
    } catch (error) {
        console.error("Error fetching popular women products:", error);
        res.status(500).json({ success: false, error: "Failed to fetch popular women products." });
    }
}
const getPopularInMens = async (req, res) => {
    try {
        let products = await Product.find({ category: 'men' });
        let slicedProducts = products.slice(0, 4); 
        console.log("Popular in Men Fetched.");
        res.send(slicedProducts);
    } catch (error) {
        console.error("Error fetching popular men products:", error);
        res.status(500).json({ success: false, error: "Failed to fetch popular men products." });
    }
}
// ------------------------------------------------------------------------------ //


// ------------------------------------------------------------------------------ //
// Realated Products
const getRelatedProducts = async (req, res) => {
        try {
        const relatedItemIds = [
            '67ea6fc1040ce29eaad8548c',
            '67ea702b040ce29eaad854ab',
            '67ea70a3040ce29eaad854c6',
            '67ea7155040ce29eaad854dd',
        ];
        const relatedItems = await Product.find({ _id: { $in: relatedItemIds } });
        if (relatedItems.length === 4) {
            console.log("Related Products Fetched.");
            res.send(relatedItems);
        } else {
            console.log("Error: Could not retrieve all specific related items.");
            res.status(500).send("Error: Could not retrieve all specific related items.");
        }
    } catch (error) {
        console.error("Error fetching specific related items:", error);
        res.status(500).send("Internal Server Error");
    }
}

const getRelatedInKids = async (req, res) => {
    try {
        let related = await Product.find({ category: 'kid' });
        let slicedProducts = related.slice(0, 4); 
        console.log("Related in Kids Fetched.");
        res.send(slicedProducts);
    } catch (error) {
        console.error("Error fetching related kids products:", error);
        res.status(500).json({ success: false, error: "Failed to fetch related kids products." });
    }
}

const getRelatedInWomens = async (req, res) => {
    try {
        let related = await Product.find({ category: 'women' });
        let slicedProducts = related.slice(0, 4); 
        console.log("Related in Women Fetched.");
        res.send(slicedProducts);
    } catch (error) {
        console.error("Error fetching related women products:", error);
        res.status(500).json({ success: false, error: "Failed to fetch related women products." });
    }
}

const getRelatedInMens = async (req, res) => {
    try {
        let related = await Product.find({ category: 'men' });
        let slicedProducts = related.slice(0, 4); 
        console.log("Related in Men Fetched.");
        res.send(slicedProducts);
    } catch (error) {
        console.error("Error fetching related men products:", error);
        res.status(500).json({ success: false, error: "Failed to fetch related men products." });
    }
}
// ------------------------------------------------------------------------------ //

export { 
    addProduct,
    removeProduct,
    getAllProducts,
    updateStockStatus,
    getNewCollections,
    getKidsCollections,
    getWomensCollections,
    getMensCollections,
    getPopularProducts,
    getPopularInKids,
    getPopularInWomens,
    getPopularInMens,
    getRelatedProducts,
    getRelatedInKids,
    getRelatedInWomens,
    getRelatedInMens
};