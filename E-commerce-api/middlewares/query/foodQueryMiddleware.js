const asyncErrorWrapper = require("express-async-handler");
const { populateHelper, paginationHelper } = require("./queryMiddlewareHelpers");


const userQueryMiddleware = function(model, options){

    return asyncErrorWrapper(async function(req,res,next){
        
        const {id} = req.params;

        const total = (await model.findById(id)).foods.length;

        const paginationResult = await paginationHelper(total,undefined,req);

        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;


        let queryObject = {};

        queryObject["foods"] = {$slice: [startIndex, limit]}

        let query = model.find({_id: id}, queryObject);

        query = populateHelper(query, options.population)

        const queryResults = await query;
        
        res.queryResults = {
            success: true,
            pagination: paginationResult.pagination,
            data: queryResults
        }
        next();

    });
};

module.exports = userQueryMiddleware;