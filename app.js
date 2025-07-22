const express = require("express");
const app = express();
const connectDB = require("./database/connectdb");
const web = require("./routes/web");
const cors = require("cors");
const fileUpload = require("express-fileupload");
//dot env config
const dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
app.use(cookieParser());

dotenv.config();

connectDB();

app.use(
  cors({
    origin: "https://pncourse.netlify.app", // Your frontend domain
    credentials: true, // allow credentials (cookies)
  })
);

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// localhost:3000/api
app.use("/api", web);

app.listen(process.env.PORT, () => {
  console.log(`Server start on port ${process.env.PORT}`);
});
