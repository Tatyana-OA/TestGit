function parseError(err) {
    //to parse validation error
    if (err.name =="ValidationError") {
        //checks if mongoose error
        return Object.values(err.errors).map(e=>e.properties.message)
    } else {
        return [err.message]
    }
}

module.exports = {
    parseError
}