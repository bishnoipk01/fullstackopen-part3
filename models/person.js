const mongoose = require("mongoose");
const dotenv = require("dotenv").config({});

const URI = process.env.DATABASE_URI;
mongoose.set("strictQuery", false);

mongoose
  .connect(URI)
  .then(() => console.log("connected to database successfully!"))
  .catch((err) => console.log("error connecting to database", err.message));

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
});

PersonSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", PersonSchema);

module.exports = Person;
