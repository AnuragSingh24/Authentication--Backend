const mongoose = require("mongoose");

require("dotenv").config();


exports.connect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
        .then(() => { console.log("Db connection successfully") })
        .catch((err) => {
            console.log(err);
            process.exit(1);

        })
}
