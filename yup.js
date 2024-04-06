const yup = require("yup");

module.exports.bookvalidation = yup.object().shape({
  title: yup.string().required(),
  author: yup.string().required(),
  country: yup.string().required(),
  language: yup.string().required(),
  pages: yup
    .number()
    .integer()
    .required()
    .positive()
    .min(50, '"Page number maximum is 50"'),
  year: yup
    .number()
    .integer()
    .positive()
    .required()
    .max(2024, "year limit is upto 2024"),
});

module.exports.reviewValidation = yup.object().shape({
  text: yup.string().required(),
  rating: yup.number().integer().min(1).max(5).required(),
});

module.exports.singupValidation = yup.object().shape({
  name: yup.string().required(),
  email: yup
    .string()
    .email()
    .required()
    .matches(
      /@[a-z]+\.(com|in|org)$/,
      "Email must have a valid domain suffix .com , .in , .org"
    ),
  password: yup
    .string()
    .required()
    .min(8)
    .max(15)
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});
