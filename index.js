const express = require('express')


//initialization of configuration files
const {PORT} = require('./config')
const databaseConfig = require('./config/database')
const expressConfig = require('./config/express')
const routesConfig = require('./config/routes')


start()
async function start() {

    const app = express();
    // use database and express config on the app
    await databaseConfig(app)
    expressConfig(app)
    routesConfig(app)

    app.get('/', (req,res) => res.send('It works'))
    app.listen(PORT, () => {
    console.log(`App started at http://localhost:${PORT}`)
})

}

