const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errHandler = require("./middleware/errHandler");
const cors = require("cors");
const PORT = process.env.PORT || 3500;

app.use(logger);

const whiteList = [
  "https://www.google.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

app.use('/', require('./routes/root'));
app.use("/subdir", require("./routes/subdir"));
app.use('/employees', require('./routes/api/employees'));



app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
