const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
require("./helpers/init_mongodb");
const { verifyAccessToken } = require("./helpers/jwt_helper");
const AuthRoute = require("./Routes/Auth_routes");
require('./helpers/init_redis')

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  res.send("server is working");
});

app.get("/home", verifyAccessToken, async (req, res, next) => {
 // console.log(req.headers["authorization"]);

  res.send("This is the home page and this page is protected");
});

app.use("/auth", AuthRoute);

app.use(async (req, res, next) => {
  // const error = new Error('Not Found')
  // error.status=404
  // next(error)
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
