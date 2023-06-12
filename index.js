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

const getKota = (conn) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Kota `;
    conn.query(sql, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const getKecamatan = (conn, idKota) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Kecamatan where idKota = ? `;
    conn.query(sql, [idKota], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const getKelurahan = (conn, idKecamatan) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Kelurahan where idKecamatan = ? `;
    conn.query(sql, [idKecamatan], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const getUser = (conn) => {};

const addUser = (conn, fName, lName) => {};
app.get("/kota", async (req, res) => {
  const kota = await getKota(conn);
  res.send({ kota });
});
app.get("/kecamatan", async (req, res) => {
  const kecamatan = await getKecamatan(conn, req.query.idKota);
  res.send({ kecamatan });
});
app.get("/kelurahan", async (req, res) => {
  const kelurahan = await getKelurahan(conn, req.query.idKecamatan);
  res.send({ kelurahan });
});
app.get("/", (req, res) => {
  res.render("home", {
    isLogin: req.session.isLogin,
  });
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/authlogin", (req, res) => {
  console.log("prosesLogin");
  req.session.isLogin = true;
  res.redirect("/");
});

app.post("/authsignup", (req, res) => {
  console.log("prosesSignup");
  res.redirect("/");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/reservation", (req, res) => {
  res.render("reservation", {
    isLogin: req.session.isLogin,
  });
});
app.get("/forgotpass", (req, res) => {
  res.render("forgot_pass");
});
app.get("/table", (req, res) => {
  res.render("table_page", {
    isLogin: req.session.isLogin,
  });
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
app.get("/trans", (req, res) => {
  res.render("trans_history");
});
app.get("/update", (req, res) => {
  res.render("update_membership");
});
app.listen(PORT, () => {
  console.log("server ready");
});
