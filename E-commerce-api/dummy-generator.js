const Product = require("./models/Product");
const Food = require("./models/Food");
const User = require("./models/User");
const fs = require("fs");
const connectDatabase = require("./helpers/database/connectDatabase");
const CustomError = require("./helpers/error/CustomError");

const dotenv = require("dotenv");

const path = "./dummy/";

const users = JSON.parse(fs.readFileSync(path + "users.json" ));
const products = JSON.parse(fs.readFileSync(path + "products.json" ));
const foods = JSON.parse(fs.readFileSync(path + "foods.json" ));



dotenv.config({
    path : "./config/env/config.env"
});

connectDatabase();

const importAllData = async function(){
    try {
        await User.create(users);
        await Product.create(products);
        await Food.create(foods);
        console.log("Import Process Successful");

    }   
    catch(err) {
        console.log(err);
        console.err("There is a problem with import process");
    }
    finally {
        process.exit();
    }
};

const deleteAllData = async function(){
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Food.deleteMany();
        console.log("Delete Process Successful");


    }   
    catch(err) {
        console.log(err);
        console.err("There is a problem with delete process");
    }
    finally {
        process.exit();
    }
};

if (process.argv[2] == "--import"){
    importAllData();
}
else if (process.argv[2] == "--delete"){
    deleteAllData();
}
