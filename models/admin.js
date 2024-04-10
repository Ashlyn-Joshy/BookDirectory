const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  adminId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 15,
  },
  isAdminApproved: Boolean,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//hashing the password before saving into the database
adminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method to login user
adminSchema.statics.login = async function (adminId, password) {
  const admin = await this.findOne({ adminId });
  if (admin) {
    const auth = await bcrypt.compare(password, admin.password);
    if (auth) {
      return admin;
    }
    throw new Error("inncorrect password");
  }
  throw new Error("inncorrect admin_id");
};
module.exports = mongoose.model("Admin", adminSchema);
