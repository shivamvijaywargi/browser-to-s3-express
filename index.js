const express = require("express");
const indexRouter = require("./indexRouter.js");

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use(indexRouter);

const PORT = 5623;

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
