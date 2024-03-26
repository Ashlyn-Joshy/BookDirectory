const yup = require("yup");

module.exports.bookvalidation = yup.object().shape({
  title: yup.string().required(),
  author: yup.string().required(),
  country: yup.string().required(),
  language: yup.string().required(),
  pages: yup.number().integer().required(),
  year: yup.number().integer().required(),
});
