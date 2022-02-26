const express = require("express");
const router = express.Router();
const category = require("../models/Category");
const product = require("../models/Product")


//Get all Category 
router.get("/", (req, res) => {
    category.find({}, (err, foundData) => {
        if (!err) {
            res.render('categories', {
                foundData: foundData,
            })
        }
        else {
            console.log(err);
        }
    })



    // View All products in a single category.
    router.get("/:id", (req, res) => {
        category.findById(req.params.id, (err, foundData) => {
            if (!err) {
                res.render("category", { foundData: foundData })

            }
            else {
                console.log(err);
            }
        }).populate('products');
    })

    //adding prod to category
    router.get("/:id/product/add", (req, res) => {

        const data = req.params.id;
        category.findById(req.params.id, (err, foundData) => {
            if (err) {
                console.log(err);
            }
            else {
                res.render("addProduct", { foundData: foundData, data })
            }
        });
    })

})

//Creating Category
router.get("/add", (req, res) => {
    res.render("addCategory");

})

//Creating Product for specific category
router.post("/:id/product", (req, res) => {
    let id = req.params.id
    category.findById(id, (err, foundcategory) => {
        if (!err) {
            let catid = foundcategory._id;
            let catname = foundcategory.name;
            const data = { name: req.body.productName, catid: catid, catname: catname }
            product.create(data, (err, foundproduct) => {
                if (!err) {
                    foundcategory.products.push(foundproduct);
                    foundproduct.foundcategory = foundcategory;
                    foundcategory.save();
                    res.redirect("/category/" + id)
                }
                else {
                    console.log(err);
                }
            })
        }
        else {
            console.log(err);
        }
    })

})

//Creating category
router.post("/", (req, res) => {
    const data = { name: req.body.categoryName };

    category.create(data, (err, data) => {
        if (!err) {
            res.redirect("/category");
        }
        else {
            console.log(err);
        }
    })
})

//Update Category
router.get("/:id/edit", (req, res) => {
    category.findById(req.params.id, (err, foundData) => {
        if (!err) {
            res.render("editCategory", { foundData: foundData })
        }
        else {
            console.log(err);
        }
    })
})



//Updating Category
router.put("/:id", (req, res) => {
    const data = { name: req.body.categoryName };

    category.findByIdAndUpdate(req.params.id, data, (err, foundData) => {
        if (!err) {
            res.redirect("/category");
        }
        else {
            console.log(err);
        }
    })
})



//Deleting Category
router.delete("/:id", (req, res) => {
    category.findByIdAndDelete(req.params.id, (err, foundData) => {
        if (!err) {
            res.redirect("/category")
        }
        else {
            console.log(err);
        }
    })
})




module.exports = router;