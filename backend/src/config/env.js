require("dotenv").config();
const Joi = require("joi");

const schema = Joi.object({
  PORT: Joi.number().required(),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required()
}).unknown();

const { error, value } = schema.validate(process.env);

if (error) {
  throw new Error(`Env validation error: ${error.message}`);
}

module.exports = value;
