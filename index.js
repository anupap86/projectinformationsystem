const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config");
const collectionRoutes = require("./routes/collectionRoutes");
const AuthRoutes = require("./routes/authRoutes");


const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

app.use("/api", collectionRoutes.routes);
app.use("/api", AuthRoutes.authroutes);


app.listen(config.port, () => {
  console.log("Service endpoint= %s", config.url);
});
