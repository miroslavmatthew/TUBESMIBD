import express from "express";
import session from "express-session";
import mysql from "mysql";
import path from "path";
import crypto from "crypto";
const PORT = 8080;
const app = express();
app.set("view engine", "ejs");
const staticPath = path.resolve("public");
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SID",
  })
);
app.use(express.static(staticPath));
app.use(
  express.urlencoded({
    extended: true,
  })
);
// const pool = mysql.createPool({
//   user: "root",
//   password: "",
//   database: "IDE",
//   host: "localhost",
// });
// const dbConnect = () => {
//   return new Promise((resolve, reject) => {
//     pool.getConnection((err, conn) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(conn);
//       }
//     });
//   });
// };
// const conn = await dbConnect();

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/reservation", (req, res) => {
  res.render("reservation");
});
app.get("/forgotpass", (req, res) => {
  res.render("forgot_pass");
});
app.listen(PORT, () => {
  console.log("server ready");
});
