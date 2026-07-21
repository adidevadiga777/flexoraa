require('dotenv').config();
const app = require('./src/app');
const conectToDb = require('./src/config/database');
const { redis } = require('./src/config/cache');

conectToDb()
app.listen(3000, () => {
    console.log("server is running on port 3000")
})