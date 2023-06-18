import { jsPDF } from "jspdf";
import PDFDocument from 'pdfkit';
import fs from 'fs';
// Default export is a4 paper, portrait, using millimeters for units
import express from "express";
import session from "express-session";
import mysql from "mysql";
import path from "path";
import crypto from "crypto";
import { name } from "ejs";
import multer from "multer";
import { trace } from "console";
const PORT = 8080;
const app = express();
app.set("view engine", "ejs");
const staticPath = path.resolve("public");

let harga = 40000;

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
const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,"public");
  },
  filename: (req,file,cb)=>{
    console.log(file);
    cb(null,"img.jpg");
  }
})
const upload = multer({storage:storage});
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
const checkMejaTiket = (conn, noMeja) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Tiket Where noMeja = ? AND Status = 'Booked'`;
    conn.query(sql, [noMeja], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};

const getRepsMember = (conn, query) => {
  return new Promise((resolve, reject) => {
    const sql = query;
    conn.query(sql, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};

const getDis = (conn) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT idKota as id,namaKota as class FROM Kota`;
    conn.query(sql, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const getSubDis = (conn) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT idKecamatan as id,namaKecamatan as class FROM Kecamatan`;
    conn.query(sql, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const getUrban = (conn) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT idKelurahan as id,namaKelurahan as class FROM Kelurahan`;
    conn.query(sql, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};

const gethistory = (conn, idu) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Transaksi join Tiket on Transaksi.idTiket=Tiket.idTiket where Transaksi.idU=?;`;
    conn.query(sql, [idu], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const limitHis = (conn, idu, lim) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Transaksi join Tiket on Transaksi.idTiket=Tiket.idTiket where Transaksi.idU=? limit ?,4;`;
    conn.query(sql, [idu, lim], (err, conn) => {
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
    conn.query(sql, [nomor, nomor], (err, conn) => {
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
    conn.query(sql, [nomor], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const getUser = (conn) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM User where Username is not null ;`;
    conn.query(sql, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const limitUser = (conn, lim) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM User where Username is not null limit ?,4;`;
    conn.query(sql, [lim], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const getUserById = (conn,id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM User join Kelurahan on User.idKelurahan=Kelurahan.idKelurahan join Kecamatan on Kelurahan.idKecamatan=Kecamatan.idKecamatan join Kota on Kecamatan.idKota=Kota.idKota where idU = ?`;
    conn.query(sql,[id], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};
const updateMember = (
  conn,
  username,
  nama,
  alamat,
  idKelurahan,idU
) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE `user` SET `Username` = ?, `namaMember` = ?, `Alamat` = ?, `idKelurahan` = ? WHERE `user`.`idU` = ?;";
    conn.query(
      sql,
      [username, nama, alamat, idKelurahan,idU],
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
const middlewarePublic = (req, res, next) => {
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
const middlewareNonMember = (req, res, next) => {
  if (!req.session.isLogin) {
    next();
  } else {
    res.redirect("/forbidden");
  }
};
const middlewareMember = (req, res, next) => {
  if (req.session.isLogin) {
    next();
  } else {
    res.redirect("/forbidden");
  }
};

function generatePDF(jsonData) {
  const data = JSON.parse(jsonData);
  
  const doc = new PDFDocument();

  const headers = ["tglTransaksi", "waktuTransaksi", "noMeja", "hargaTiket"];
  const availableWidth = 500;
  const columnWidth = availableWidth / headers.length;
  const rowHeight = 20;
  let tracer = 0;
  const x = 50;
  let y = 50;
  let currentPage = 1;
  
  // console.log(doc.page.height)

  const createNewPage = () => {
    doc.addPage();
    y = 50; 
    drawTableHeaders();
    currentPage++;
  };
  
  // Function to draw table headers with center-aligned text
  const drawTableHeaders = () => {
    doc.font('Helvetica-Bold');
    headers.forEach((header, index) => {
      doc.text(header, x + index * columnWidth, y, { width: columnWidth, align: 'center', valign: 'center' });
    });
    y += rowHeight;
  };

  // Function to draw table rows with center-aligned text
  const drawTableRows = () => {
    data.forEach((row, rowIndex) => {
      tracer++;
      if (tracer > 32) {
        tracer = 0;
        createNewPage();
      }
      
      rowIndex %= 32;
      
      let rowY = y + rowIndex * rowHeight;
      doc.font('Helvetica');
      Object.entries(row).forEach(([key, value], columnIndex) => {
        if (key === 'tglTransaksi') {
          value = value.split('T')[0];
        }

        doc.text(value.toString(), x + columnIndex * columnWidth, rowY, {
          width: columnWidth,
          align: 'center',
          valign: 'center'
        });
      });
    });
    y += rowHeight;
  };

  // Generate the PDF
  drawTableHeaders();
  drawTableRows();

  doc.pipe(fs.createWriteStream('public/output.pdf'));
  doc.end();

  console.log(`PDF generated with ${currentPage} page(s).`);
}
function generatePDFDistrict(jsonData, districtName) {
  const data = JSON.parse(jsonData);
  
  const doc = new PDFDocument();

  const headers = ["Kode "+ districtName, districtName, "Sub-total"];
  const availableWidth = 500;
  const columnWidth = availableWidth / headers.length;
  const rowHeight = 20;
  let tracer = 0;
  const x = 50;
  let y = 50;
  let currentPage = 1;
  
  // console.log(doc.page.height)

  const createNewPage = () => {
    doc.addPage();
    y = 50; 
    drawTableHeaders();
    currentPage++;
  };
  
  // Function to draw table headers with center-aligned text
  const drawTableHeaders = () => {
    doc.font('Helvetica-Bold');
    headers.forEach((header, index) => {
      doc.text(header, x + index * columnWidth, y, { width: columnWidth, align: 'center', valign: 'center' });
    });
    y += rowHeight;
  };

  // Function to draw table rows with center-aligned text
  const drawTableRows = () => {
    data.forEach((row, rowIndex) => {
      tracer++;
      if (tracer > 32) {
        tracer = 0;
        createNewPage();
      }
      
      rowIndex %= 32;
      
      let rowY = y + rowIndex * rowHeight;
      doc.font('Helvetica');
      Object.entries(row).forEach(([key, value], columnIndex) => {

        doc.text(value.toString(), x + columnIndex * columnWidth, rowY, {
          width: columnWidth,
          align: 'center',
          valign: 'center'
        });
      });
    });
    y += rowHeight;
  };

  // Generate the PDF
  drawTableHeaders();
  drawTableRows();

  doc.pipe(fs.createWriteStream('public/output.pdf'));
  doc.end();

  console.log(`PDF generated with ${currentPage} page(s).`);
}


app.get("/", middlewarePublic, (req, res) => {
  // console.log(doc)
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

app.get("/signup", middlewareNonMember, (req, res) => {
  res.render("signup");
});
app.get("/resetPass", (req, res) => {
  res.render("resetPass");
});

app.get("/reservation", middlewarePublic, (req, res) => {
  res.render("reservation", {
    isLogin: req.session.isLogin,
  });
});

app.get("/forgotpass", middlewareNonMember, (req, res) => {
  res.render("forgot_pass", {
    valid: true,
  });
});
app.post("/forgotPass", (req, res) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    res.render("forgot_pass", {
      valid: false,
    });
  } else {
    res.redirect("/resetPass");
  }
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
  }
  res.render("successOrder", {
    isLogin: req.session.isLogin,
  });
  console.log(req.body);
});
app.get("/ticket", (req, res) => {
  res.render("ticket");
});
app.get("/history", middlewareMember, async (req, res) => {
  redeemTable();
  let history = await gethistory(conn, req.session.ids);
  let limit = req.query.page;
  if (limit === undefined) {
    const lims = await limitHis(conn, req.session.ids, 0 * 4);
    res.render("trans_history", {
      results: history,
      historys: lims,
    });
  } else {
    const lims = await limitHis(conn, req.session.ids, limit * 4);
    res.render("trans_history", {
      results: history,
      historys: lims,
    });
  }
  console.log(history);
});

app.get("/addtable", async (req, res) => {
  const added = await addTable(conn, req.query.no);
});
app.get("/deltable", async (req, res) => {
  const tikets = await checkMejaTiket(conn, req.query.no);
  if (tikets.length == 0) {
    const deleted = await delTable(conn, req.query.no);
    res.send({ msg: "refresh" });
  } else {
    res.send({
      msg: "Cannot delete because there is an underway booking on this table!",
    });
  }
});

app.get("/admin", async (req, res) => {
  redeemTable();
  const tables = await getTables(conn);
  res.render("home_admin", {
    tables: tables,
    currHarga: harga
  });
});
app.get("/listMem", async (req, res) => {
  let history = await getUser(conn);
  let limit = req.query.page;
  if (limit === undefined) {
    const lims = await limitUser(conn, 0 * 4);
    res.render("list_member", {
      results: history,
      historys: lims,
    });
  } else {
    const lims = await limitUser(conn, limit * 4);
    res.render("list_member", {
      results: history,
      historys: lims,
    });
  }
});
app.get("/update", async(req, res) => {
  let userId = await getUserById(conn,req.query.ids);
  console.log(userId);
  res.render("updateMember",{
    user:userId
  });
});
app.post("/authUpdate", async(req, res) => {
  let nameMember = req.body.firstName;
  let urbanVillage = req.body.urbanVillage;
  let username = req.body.username;
  let alamat = req.body.alamat;
  let idM = req.body.idM;
  console.log(req.body);
  let inserted = await updateMember(
    conn,
    username,
    nameMember,
    alamat,
    urbanVillage,idM
  );

  res.redirect("/listMem");
});
app.get("/report", async (req, res) => {
  let msg = "Transaction Chart ";
  let repMsg = "Transaction Report ";
  let start = req.query.start;
  let end = req.query.end;
  let report;
  let mejab = await getTables(conn);
  let query = `SELECT Transaksi.tglTransaksi,Transaksi.waktuTransaksi,Tiket.noMeja,Tiket.hargaTiket FROM Transaksi join Tiket on Transaksi.idTiket=Tiket.idTiket `;
  if (start == undefined || start == "") {
    if (end == undefined || end == "") {
      //start end no
      msg += "From All Time";
      repMsg += "From All Time";
      report = await getRepsMember(conn, query);
    } else {
      //end yes
      msg += `Before ${end}`;
      repMsg += `Before ${end}`;

      report = await getRepsMember(
        conn,
        query + ` where Transaksi.tglTransaksi <= '${end}'`
      );
    }
  } else if (end == undefined || end == "") {
    //end no
    msg += `From ${start}`;
    repMsg += `From ${start}`;
    report = await getRepsMember(
      conn,
      query + ` where Transaksi.tglTransaksi >= '${start}'`
    );
  } else {
    //yes yes
    msg += `From ${start} to ${end}`;
    repMsg += `From ${start} to ${end}`;

    report = await getRepsMember(
      conn,
      query +
        ` where Transaksi.tglTransaksi <= '${end}' and Transaksi.tglTransaksi >= '${start}'`
    );
  }

  generatePDF(JSON.stringify(report))
  res.render("transaction_report_admin", {
    repo: report,
    mejaB: JSON.stringify(mejab),
    dt: JSON.stringify(report),
    member: false,
    message: msg,
    repMsg: repMsg,
    subclass: false,
    district: "District",
  });
});

app.get("/filterByMember", async (req, res) => {
  let msg = "Member Transaction Chart ";
  let repMsg = "Member Transaction ";
  let start = req.query.start;
  let end = req.query.end;
  let mejab = await getTables(conn);
  let report;
  let query = `SELECT t.tglTransaksi, t.waktuTransaksi, ti.noMeja, ti.hargaTiket FROM Transaksi as t join user as u on t.idU = u.idU join Tiket as ti ON t.idTiket = ti.idTiket  where u.username is not null `;
  if (start == undefined || start == "") {
    if (end == undefined || end == "") {
      //start end no
      msg += "From All Time";
      repMsg += "From All Time";
      report = await getRepsMember(conn, query);
    } else {
      //end yes
      msg += `Until ${end}`;
      repMsg += `Until ${end}`;
      report = await getRepsMember(
        conn,
        query + ` and t.tglTransaksi <= '${end}'`
      );
    }
  } else if (end == undefined || end == "") {
    //end no
    msg += `From ${start}`;
    repMsg += `From ${start}`;
    report = await getRepsMember(
      conn,
      query + ` and t.tglTransaksi >= '${start}'`
    );
  } else {
    //yes yes
    msg += `From ${start} to ${end}`;
    repMsg += `From ${start} to ${end}`;
    report = await getRepsMember(
      conn,
      query + ` and t.tglTransaksi <= '${end}' and t.tglTransaksi >= '${start}'`
    );
  }
  generatePDF(JSON.stringify(report))
  res.render("transaction_report_admin", {
    repo: report,
    mejaB: JSON.stringify(mejab),
    dt: JSON.stringify(report),
    member: true,
    message: msg,
    repMsg: repMsg,
    subclass: false,
    district: "All",
  });
});

app.get("/filterByDistric", async (req, res) => {
  let msg = "Distric Transaction Chart ";
  let repMsg = "Distric Transaction ";
  let start = req.query.start;
  let end = req.query.end;
  let mejab = await getDis(conn);
  let report;
  let by = "GROUP BY Kota.namaKota";
  let query = `SELECT Kota.idKota as id,Kota.namaKota as class,SUM(Tiket.hargaTiket) as total FROM Tiket JOIN Transaksi ON Tiket.idTiket = Transaksi.idTiket JOIN User ON User.idU = Transaksi.idU JOIN Kelurahan ON User.idKelurahan = Kelurahan.idKelurahan JOIN Kecamatan ON Kelurahan.idKecamatan = Kecamatan.idKecamatan JOIN Kota ON Kota.idKota = Kecamatan.idKota `;
  if (start == undefined || start == "") {
    if (end == undefined || end == "") {
      //start end no
      msg += "From All Time";
      repMsg += "From All Time";
      report = await getRepsMember(conn, query + by);
    } else {
      //end yes
      msg += `Until ${end}`;
      repMsg += `Until ${end}`;
      report = await getRepsMember(
        conn,
        query + `  where Transaksi.tglTransaksi <= '${end}' ` + by
      );
    }
  } else if (end == undefined || end == "") {
    //end no
    msg += `From ${start}`;
    repMsg += `From ${start}`;
    report = await getRepsMember(
      conn,
      query + `  where Transaksi.tglTransaksi >= '${start}' ` + by
    );
  } else {
    //yes yes
    msg += `From ${start} to ${end}`;
    repMsg += `From ${start} to ${end}`;
    report = await getRepsMember(
      conn,
      query +
        ` where Transaksi.tglTransaksi <= '${end}' and Transaksi.tglTransaksi >= '${start} '` +
        by
    );
  }

  generatePDFDistrict(JSON.stringify(report), "District")
  res.render("transaction_report_admin", {
    repo: report,
    mejaB: JSON.stringify(mejab),
    dt: JSON.stringify(report),
    member: true,
    message: msg,
    repMsg: repMsg,
    subclass: true,
    district: "District",
  });
});
app.get("/filterBySubDistric", async (req, res) => {
  let msg = "Sub-District Transaction Chart ";
  let repMsg = "Sub-District Transaction ";
  let start = req.query.start;
  let end = req.query.end;
  let mejab = await getSubDis(conn);
  let report;
  let by = "GROUP BY Kecamatan.namaKecamatan";
  let query = `SELECT Kecamatan.idKecamatan as id,Kecamatan.namaKecamatan as class,SUM(Tiket.hargaTiket) as total FROM Tiket JOIN Transaksi ON Tiket.idTiket = Transaksi.idTiket JOIN User ON User.idU = Transaksi.idU JOIN Kelurahan ON User.idKelurahan = Kelurahan.idKelurahan JOIN Kecamatan ON Kelurahan.idKecamatan = Kecamatan.idKecamatan  `;
  if (start == undefined || start == "") {
    if (end == undefined || end == "") {
      //start end no
      msg += "From All Time";
      repMsg += "From All Time";
      report = await getRepsMember(conn, query + by);
    } else {
      //end yes
      msg += `Until ${end}`;
      repMsg += `Until ${end}`;
      report = await getRepsMember(
        conn,
        query + `  where Transaksi.tglTransaksi <= '${end}' ` + by
      );
    }
  } else if (end == undefined || end == "") {
    //end no
    msg += `From ${start}`;
    repMsg += `From ${start}`;
    report = await getRepsMember(
      conn,
      query + `  where Transaksi.tglTransaksi >= '${start}' ` + by
    );
  } else {
    //yes yes
    msg += `From ${start} to ${end}`;
    repMsg += `From ${start} to ${end}`;
    report = await getRepsMember(
      conn,
      query +
        ` where Transaksi.tglTransaksi <= '${end}' and Transaksi.tglTransaksi >= '${start} '` +
        by
    );
  }
  generatePDFDistrict(JSON.stringify(report), "Sub-District")
  res.render("transaction_report_admin", {
    repo: report,
    mejaB: JSON.stringify(mejab),
    dt: JSON.stringify(report),
    member: true,
    message: msg,
    repMsg: repMsg,
    subclass: true,
    district: "Sub-District",
  });
});
app.get("/filterByUrban", async (req, res) => {
  let msg = "Urban Village Transaction Chart ";
  let repMsg = "Urban Village Transaction ";
  let start = req.query.start;
  let end = req.query.end;
  let mejab = await getUrban(conn);
  let report;
  let by = "GROUP BY Kelurahan.namaKelurahan ";
  let query = `SELECT Kelurahan.idKelurahan as id, Kelurahan.namaKelurahan as class,SUM(Tiket.hargaTiket) as total FROM Tiket JOIN Transaksi ON Tiket.idTiket = Transaksi.idTiket JOIN User ON User.idU = Transaksi.idU JOIN Kelurahan ON User.idKelurahan = Kelurahan.idKelurahan  `;
  if (start == undefined || start == "") {
    if (end == undefined || end == "") {
      //start end no
      msg += "From All Time";
      repMsg += "From All Time";
      report = await getRepsMember(conn, query + by);
    } else {
      //end yes
      msg += `Until ${end}`;
      repMsg += `Until ${end}`;
      report = await getRepsMember(
        conn,
        query + `  where Transaksi.tglTransaksi <= '${end}' ` + by
      );
    }
  } else if (end == undefined || end == "") {
    //end no
    msg += `From ${start}`;
    repMsg += `From ${start}`;
    report = await getRepsMember(
      conn,
      query + `  where Transaksi.tglTransaksi >= '${start}' ` + by
    );
  } else {
    //yes yes
    msg += `From ${start} to ${end}`;
    repMsg += `From ${start} to ${end}`;
    report = await getRepsMember(
      conn,
      query +
        ` where Transaksi.tglTransaksi <= '${end}' and Transaksi.tglTransaksi >= '${start} '` +
        by
    );
  }

  generatePDFDistrict(JSON.stringify(report), "Urban-Village");
  res.render("transaction_report_admin", {
    repo: report,
    mejaB: JSON.stringify(mejab),
    dt: JSON.stringify(report),
    member: true,
    message: msg,
    repMsg: repMsg,
    subclass: true,
    district: "Urban Village",
  });
});

app.get("/reportRange", (req, res) => {
  res.render("transaction_report");
});
app.listen(PORT, () => {
  console.log("server ready");
});
app.get("/shift", middlewareAdmin, (req, res) => {
  res.render("shift");
});

app.post("/updatePrice", (req, res) => {
  harga = req.body.harga;
  res.redirect("/admin")
})
app.get("/profilePic", (req, res) => {
  res.render("profile");
});
app.post("/profilePic",upload.single("image"), (req, res) => {
  res.redirect("/profilePic");
});
const updateStatusPastDay = (conn, tanggal) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Tiket SET Status = 'Redeemed' Where Status = 'Booked' AND tanggal < ?`;
    conn.query(sql, [tanggal], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};

const updateStatusToday = (conn, tanggal, jam) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Tiket SET Status = 'Redeemed' Where Status = 'Booked' AND tanggal = ? AND jam <= ?`;
    conn.query(sql, [tanggal, jam], (err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};

function redeemTable() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  updateStatusPastDay(conn, formattedDate);
  updateStatusToday(conn, formattedDate, formattedTime);
}
