const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL,  () => {
    console.log("INIT DATABASe")
});
