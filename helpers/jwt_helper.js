const JWT = require("jsonwebtoken");
const createError = require("http-errors");

const client = require("../helpers/init_redis");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "60s",
        issuer: "your own website",
        audience: userId,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          return reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());

    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return next(createError.Unauthorized());
        } else {
          return next(createError.Unauthorized(err.message));
        }
      }

      req.payload = payload;
      next();
    });
  },
  signRefershToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
        issuer: "your own website",
        audience: userId,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          return reject(createError.InternalServerError());
        }

        client
          .SET(userId, token, {
            EX: 365*24*60*60,
          })
          .then(() => {
            console.log(token);
            resolve(token);
          })
          .catch((err) => {
            if (err) {
              console.log(err.message);
              reject(createError.InternalServerError());
            }
          });
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized());

          const userId = payload.aud;
          client
            .get(userId)
            .then((result) => {
              if (refreshToken === result) {
                resolve(userId);
              }else{
                reject(createError.Unauthorized())
              }
            })
            .catch((err) => {
              console.log(err.message);
              reject(createError.InternalServerError());
            });
        }
      );
    });
  },
};
