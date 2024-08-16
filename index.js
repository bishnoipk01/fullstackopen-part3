const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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

const data = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  const time = new Date(Date.now());
  const output = `<p>Phone has info for ${data.length} people <br/> ${time}`;
  res.send(output);
});

app.get("/api/persons", (req, res) => {
  res.json(data);
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  if (!name || !number)
    res.json({
      status: "error",
      message: "name and number both should be present",
    });
  else if (data.find((obj) => obj.name === name))
    res.json({ error: "name must be unique" });
  else {
    const id = Math.floor(Math.random() * 100);
    const newObj = { id, name, number };
    data.push(newObj);
    res.send("recond added successfully");
  }
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  if (id > data.length)
    res
      .status(404)
      .json({ status: "not found", message: `no record found with id ${id}` });
  const record = data.filter((obj) => obj.id === id);
  if (record.length > 0) res.json(record);
  else res.status(404).send("not found");
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const index = data.findIndex((obj) => obj.id === id);
  data.splice(index, 1);
  res
    .status(200)
    .json({ status: "success", message: `record deleted successfully!` });
});

app.get("*", (req, res) => {
  res.send("<h1>404 not found</h1>");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`app is listening at port ${PORT}`));
