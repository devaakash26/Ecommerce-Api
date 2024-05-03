const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MOONGOSE);
        console.log("Database Successfully Connected")
    }
    catch (error) {
        console.log("Database Error");
    }
}
module.exports =dbConnect;