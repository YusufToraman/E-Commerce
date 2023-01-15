const searchHelper = (searchKey, query, req) => {
 
    if(req.query.search){
        const searchObject = {};

        const regex = new RegExp(req.query.search, "i");
        searchObject[searchKey] = regex;

        return query = query.where(searchObject);
    }

    return query;
};

const populateHelper = (query, population) =>{

    return query.populate(population);
}

const productSortHelper = (query,req) => {

    const sortKey = req.query.sortBy;

    if(sortKey === "most-rating"){
        return query.sort("-rating -createdAt");
    }

    else if(sortKey === "less-rating"){
        return query.sort("rating -createdAt");
    }

    else if(sortKey === "most-review"){
        return query.sort("-numReviews -createdAt");
    }

    else if(sortKey === "less-review"){
        return query.sort("numReviews -createdAt");
    }

    return query.sort("-createdAt");
};

const paginationHelper = async (totalDocuments,query,req) => {

    const pagination = {};

    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 5;   

    const startIndex = (page - 1) * limit;

    const endIndex = page * limit;
    
    const total = totalDocuments;

    if(startIndex > 0){
        pagination.previous = {
            page: page - 1,
            limit: limit
        }
    }

    if(endIndex < total){
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }

    return {
        query: query === undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination: pagination,
        startIndex,
        limit
    };
};


module.exports = {
    searchHelper,
    populateHelper,
    paginationHelper,
    productSortHelper
};