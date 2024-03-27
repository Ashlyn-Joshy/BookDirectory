const yup = require("yup");

module.exports.bookvalidation = yup.object().shape({
  title: yup.string().required(),
  author: yup.string().required(),
  country: yup.string().required(),
  language: yup.string().required(),
  pages: yup.number().integer().required().positive().min(50),
  year: yup
    .number()
    .integer()
    .positive()
    .required()
    .max(2024, "limit is upto 2024"),
});

module.exports.reviewValidation = yup.object().shape({
  text: yup.string().required(),
  rating: yup.number().integer().min(1).max(5).required(),
});
