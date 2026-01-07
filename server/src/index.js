const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

app.get("/test", (req, res) => {
  console.log(req.cookies);
  res.send("ok");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));