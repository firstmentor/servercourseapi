const express = require("express");
const app = express();
const connectDB = require("./database/connectdb");
const web = require("./routes/web");
const cors =require('cors')
const fileUpload = require('express-fileupload');
//dot env config
const dotenv = require("dotenv")
var cookieParser = require('cookie-parser')
app.use(cookieParser())

dotenv.config()


connectDB();

  app.use(cors({
    origin: 'http://localhost:5173', // आपके React app का exact origin
    credentials: true               // ये जरूरी है for cookies/auth
  }));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));




// localhost:3000/api
app.use("/api", web);

app.listen(process.env.PORT, () => {
  console.log(`Server start on port ${process.env.PORT}`);
});
