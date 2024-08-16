const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

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

app.get("/info", (req, res, next) => {
  const time = new Date(Date.now());
  Person.find({})
    .then((data) =>
      res.send(`<p>Phone has info for ${data.length} people <br/> ${time}`)
    )
    .catch((err) => next(err));
});

app.get("/api/persons", (req, res, next) => {
  const data = Person.find({})
    .then((data) => res.json(data))
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, err) => {
  const { name, number } = req.body;
  if (!name || !number)
    res.json({
      status: "error",
      message: "name and number both should be present",
    });
  else {
    const person = new Person({ name, number });
    person
      .save()
      .then((saved) => res.json(saved))
      .catch((err) => next(err));
  }
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById({ id })
    .then((person) => {
      if (!person.length) res.json("no person found with that id");
      else res.json(person);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  console.log(req.body);
  const { name, number } = req.body;
  if (!number)
    res.json({
      status: "error",
      message: "number should be present",
    });
  else {
    Person.findOneAndUpdate({ name }, { name, number })
      .then((updated) => res.json(updated))
      .catch((err) => next(err));
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete({ id })
    .then(() => res.status(204).send())
    .catch((err) => next(err));
});

app.get("*", (req, res) => {
  res.send("<h1>404 not found</h1>");
});

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  res.status(500).json({ status: "fail", message: "something went wrong!" });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`app is listening at port ${PORT}`));
