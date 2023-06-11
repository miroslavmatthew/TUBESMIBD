import express from "express";
import session from "express-session";
import mysql from "mysql";
import path from "path";
import crypto from "crypto";
const PORT = 8080;
const app = express();
app.set("view engine", "ejs");
const staticPath = path.resolve("public");

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    secret: "SID",
  })
);
app.use(express.static(staticPath));
app.use(
  express.urlencoded({
    extended: true,
  })
);
const pool = mysql.createPool({
  user: "root",
  password: "",
  database: "Broklyn",
  host: "localhost",
});
const dbConnect = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const conn = await dbConnect();

const getUser = conn =>{
  
}

const addUser = (conn, fName, lName, ) =>{

}

app.get("/", (req, res) => {
  res.render("home",
  {
    isLogin: req.session.isLogin
  });
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/authlogin", (req, res) => {
  console.log("prosesLogin")
  req.session.isLogin = true;
  res.redirect("/");
});

app.post("/authsignup", (req, res) => {
  console.log("prosesSignup")
  res.redirect("/");
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
app.get("/table", (req, res) => {
  res.render("table_page");
});
app.get("/confirmation", (req, res) => {
  res.render("confirmation");
});
app.get("/success", (req, res) => {
  res.render("successOrder");
});
app.get("/ticket", (req, res) => {
  res.render("ticket");
});
app.get("/trans", (req, res) =>{
  res.render("trans_history")
});
app.get("/update", (req, res) =>{
  res.render("update_membership")
})
app.listen(PORT, () => {
  console.log("server ready");
});
