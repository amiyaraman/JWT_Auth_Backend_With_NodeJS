const User = require("../Models/user.model");
const { authSchema } = require("../helpers/validation_schema");

const {
  signAccessToken,
  signRefershToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");

const client = require("../helpers/init_redis");

module.exports = {
  register: async (req, res, next) => {
    try {
      // if(!email || !password) throw createError.BadRequest()

      const result = await authSchema.validateAsync(req.body);

      const doesExist = await User.findOne({ email: result.email });

      if (doesExist)
        throw createError.Conflict(`${result.email} already been register`);

      const user = new User(result);
      const savedUser = await user.save();
      const accessToken = await signAccessToken(savedUser.id);
      const refreshToken = await signRefershToken(savedUser.id);

      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) {
        error.status = 422;
      }
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);

      const user = await User.findOne({ email: result.email });

      if (!user) throw createError.NotFound("User not register");

      const isMatched = await user.isValidPassword(result.password);

      if (!isMatched)
        throw createError.Unauthorized("Username/Password not valid");

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefershToken(user.id);

      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) {
        return next(createError.BadRequest("Invalid Username/Password"));
      }
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();

      const userId = await verifyRefreshToken(refreshToken);

      const accessToken = await signAccessToken(userId);
      const refToken = await signRefershToken(userId);

      res.send({ accessToken: accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      client
        .DEL(userId)
        .then((val) => {
          console.log(val);
          res.sendStatus(204);
        })
        .catch((err) => {
          console.log(err.message);
          throw createError.InternalServerError();
        });
    } catch (error) {
      next(error);
    }
  },
};
