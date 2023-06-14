import express from "express";
import session from "express-session";
import mysql from "mysql";
import path from "path";
import crypto from "crypto";
import { name } from "ejs";
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
const getTikets = (conn, date, time) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM tiket WHERE tanggal = ? AND jam = ?`;
    conn.query(sql, [date, time], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const getTables = (conn) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM mejab`;
    conn.query(sql, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const getAdmin = (conn, username, password) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM User where UsernameAdmin = ? and PasswordAdmin = ?`;
    conn.query(sql, [username, password], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const getMember = (conn, username, password) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM User where Username = ? and Password = ?`;
    conn.query(sql, [username, password], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const insertNewMember = (
  conn,
  username,
  password,
  nama,
  alamat,
  idKelurahan
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO user(Username, Password, namaMember, Alamat, idKelurahan) VALUES(?, ?, ?, ?, ?)`;
    conn.query(
      sql,
      [username, password, nama, alamat, idKelurahan],
      (err, conn) => {
        if (err) {
          reject(err);
        } else {
          resolve(conn);
        }
      }
    );
  });
};
const getUsername = (conn) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT UsernameAdmin,Username FROM User `;
    conn.query(sql, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
let data;
app.get("/username", async (req, res) => {
  const lsusername = await getUsername(conn);
  res.send({ lsusername });
});
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

const middlewareMember = (req, res, next) => {
  if (!req.session.isLogin || req.session.isLogin == "user") {
    next();
  } else {
    res.redirect("/forbidden");
  }
};
const middlewareAdmin = (req, res, next) => {
  if (req.session.isLogin == "admin") {
    next();
  } else {
    res.redirect("/forbidden");
  }
};
app.get("/", middlewareMember, (req, res) => {
  res.render("home", {
    isLogin: req.session.isLogin,
  });
});
app.get("/login", (req, res) => {
  if (req.session.isLogin) {
    res.redirect("/forbidden");
  }
  res.render("login", {
    err: false,
    sgp: false,
  });
});
app.post("/authlogin", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let hashpass = crypto.createHash("sha256").update(password).digest("base64");
  let admin = await getAdmin(conn, username, hashpass);
  let member = await getMember(conn, username, hashpass);
  if (admin.length != 0) {
    req.session.isLogin = "admin";
    res.redirect("/homeAdmin");
  } else {
    if (member.length != 0) {
      req.session.isLogin = "user";
      res.redirect("/");
    } else {
      res.render("login", {
        sgp: false,
        err: true,
      });
    }
  }
});

app.post("/authsignup", async (req, res) => {
  console.log("prosesSignup");
  let nameMember = req.body.firstName;
  let urbanVillage = req.body.urbanVillage;
  let username = req.body.username;
  let password = req.body.password;
  let hashpass = crypto.createHash("sha256").update(password).digest("base64");
  let alamat = req.body.alamat;

  let inserted = await insertNewMember(
    conn,
    username,
    hashpass,
    nameMember,
    alamat,
    urbanVillage
  );
  req.session.isLogin = "user";
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
app.get("/table", async (req, res) => {
  let tanggal = req.query.date;
  let time = req.query.time;

  let date = new Date(tanggal);

  // Format the date as desired (e.g., "June 13, 2023")
  let formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tickets = await getTikets(conn, tanggal, time);
  const tables = await getTables(conn);
  const harga = 40000;
  var formattedHarga = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(harga);

  data = { hari: formattedDate, jam: time, harga: formattedHarga };
  const booked_tables = [];
  for (let i = 0; i < tickets.length; i++) {
    booked_tables.push(tickets[i].noMeja);
  }
  // console.log(booked_tables);
  res.render("table_page", {
    isLogin: req.session.isLogin,
    booked_tables: booked_tables,
    tables: tables,
  });
});
app.post("/confirmation", (req, res) => {
  let noMej = req.body.noMeja;
  // console.log(req);
  res.render("confirmation", {
    datas: data,
    noMeja: noMej,
    isLogin: req.session.isLogin,
  });
});
app.post("/success", (req, res) => {
  console.log(req.body);
  res.render("successOrder");
});
app.get("/ticket", (req, res) => {
  res.render("ticket");
});
app.get("/trans", (req, res) => {
  res.render("trans_history");
});
app.get("/homeAdmin", middlewareAdmin, (req, res) => {
  res.render("home_admin");
});
app.get("/update", (req, res) => {
  res.render("update_membership");
});
app.listen(PORT, () => {
  console.log("server ready");
});
