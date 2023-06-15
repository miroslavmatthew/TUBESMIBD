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
const getNonMember = (conn, email) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM User where namaPemesan = ? `;
    conn.query(sql, [email], (err, conn) => {
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
const insertNonMember = (conn, email) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO user( namaPemesan) VALUES(?)`;
    conn.query(sql, [email], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const insertTransaksi = (conn, idU, idTiket, tgl, jam) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Transaksi(idU, idTiket, tglTransaksi, waktuTransaksi) VALUES(?, ?, ?, ?)`;
    conn.query(sql, [idU, idTiket, tgl, jam], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
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
const insertTiket = (conn, status, tgl, jam, harga, noMej) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Tiket(Status, Tanggal, Jam, hargaTiket, noMeja) VALUES(?, ?, ?, ?, ?) `;
    conn.query(sql, [status, tgl, jam, harga, noMej], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const getListTiket = (conn) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Tiket `;
    conn.query(sql, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const addTable = (conn, nomor) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO mejab(noMeja, posisiM) VALUES(?, ?)`;
    conn.query(sql,[nomor, nomor], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const delTable = (conn, nomor) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM mejab WHERE noMeja = ?`;
    conn.query(sql,[nomor], (err, conn) => {
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
    res.redirect("/admin");
  } else {
    if (member.length != 0) {
      req.session.isLogin = "user";
      req.session.ids = member[0].idU;
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
    let user = await getMember(conn, username, hashpass);
    console.log(user);
    req.session.ids = user[0].idU;
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
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Zero-padding the month
  const day = String(date.getDate()).padStart(2, "0"); // Zero-padding the day
  
  return `${year}-${month}-${day}`;
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0"); // Zero-padding the hours
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Zero-padding the minutes
  const seconds = String(date.getSeconds()).padStart(2, "0"); // Zero-padding the seconds
  
  return `${hours}:${minutes}:${seconds}`;
}

app.post("/success", async (req, res) => {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  const formattedTime = formatTime(currentDate);
  let nome = req.body.noMeja.substring(req.body.noMeja.indexOf("#") + 1).trim();
  let insert = await insertTiket(
    conn,
    "Booked",
    req.body.hari,
    req.body.jam,
    req.body.harga,
    nome
  );
  if (req.session.isLogin) {
    let listTiket = await getListTiket(conn);
    let trans = await insertTransaksi(
      conn,
      req.session.ids,
      listTiket.length,
      formattedDate,
      formattedTime
    );
  } else {
    let regis = await insertNonMember(conn, req.body.email);
    let getids = await getNonMember(conn, req.body.email);
    let listTiket = await getListTiket(conn);
    let trans = await insertTransaksi(
      conn,
      getids[0].idU,
      listTiket.length,
      formattedDate,
      formattedTime
    );
    
  }res.render("successOrder", {
      isLogin: req.session.isLogin,
    });
  console.log(req.body);
});
app.get("/ticket", (req, res) => {
  res.render("ticket");
});
app.get("/history", (req, res) => {
  res.render("trans_history");
});
app.get("/trans", (req, res) => {
  res.render("trans_history");
});
app.get("/admin", async(req, res) => {

  const tables = await getTables(conn);
  res.render("home_admin", {
    tables: tables
  });
});
app.get("/update", (req, res) => {
  res.render("update_membership");
});
app.listen(PORT, () => {
  console.log("server ready");
});
app.get("/shift",middlewareAdmin, (req, res) => {
  res.render("shift");
});