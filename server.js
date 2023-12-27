const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const { notFound, errorHandler } = require("./middlewares/eroorHandler");
const cookieParser = require("cookie-parser");
dotenv.config();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
const morgan = require("morgan");
const productRouter = require("./routes/productRoute");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("db connected"))
  .catch(() => console.log("problem connecting"));

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", require("./routes/UserRoutes"));
app.use("/api/product", productRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, (err) =>
  err ? console.log(err) : console.log("server listening on port: ", port)
);
