const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const { default: mongoose } = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static("dist"));

morgan.token("body", (req) => {
  if (req.method == "POST") return JSON.stringify(req.body);
});
const format =
  ":method :url :status :res[content-length] - :response-time ms :body";

app.use(morgan(format));

// app.get("/info", (req, res) => {
//   const time = new Date(Date.now());
//   const output = `<p>Phone has info for ${data.length} people <br/> ${time}`;
//   res.send(output);
// });

app.get("/api/persons", (req, res) => {
  const data = Person.find({}).then((data) => res.json(data));
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  if (!name || !number)
    res.json({
      status: "error",
      message: "name and number both should be present",
    });
  // else if (data.find((obj) => obj.name === name))
  //   res.json({ error: "name must be unique" });
  else {
    const person = new Person({ name, number });
    person.save().then((saved) => res.json(saved));
  }
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById({ id }).then((person) => {
    if (!person.length) res.json("no person found with that id");
    else res.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.deleteOne({ id }).then(() => res.json("deleted successfully!"));
});

app.get("*", (req, res) => {
  res.send("<h1>404 not found</h1>");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`app is listening at port ${PORT}`));
