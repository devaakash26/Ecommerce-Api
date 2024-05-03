const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const auth = require('./Routes/auth');
const productRouter = require('./Routes/productRoutes');
const blogRouter = require('./Routes/BlogRoutes');
const categoryRouter = require('./Routes/pcategoryRoutes')
const BrandRouter = require('./Routes/Brandroutes');
const CouponRouter = require('./Routes/CouponRoutes');
const ColorRouter= require('./Routes/color-Routes');
const uploadRouter = require('./Routes/upload-Routes');
const EnquireRouter= require("./Routes/enqRoutes");

const BCategoryRouter = require('./Routes/bcategoryRoutes');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middleware/errorDetection');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
dbConnect();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/user', auth);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter)
app.use('/api/bcategory', BCategoryRouter)
app.use('/api/brand', BrandRouter)
app.use('/api/coupon', CouponRouter)
app.use('/api/color',ColorRouter);
app.use("/api/upload", uploadRouter);
app.use('/api/enquire',EnquireRouter);



app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})
