//import library
import express from "express";
import mysql from "mysql";
import bodyPafrser from "body-parser";
import session from "express-session";
import path from "path";
import crypto from "crypto";
import multer from "multer";

const app = express();
const staticPath = path.resolve("public");
app.use(express.static(staticPath));
app.use(
  session({
    secret: "tubesmanpro",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//connect to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tubesmanpro",
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to the database");
});

//route login
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    db.query(
      "SELECT * FROM user WHERE username = ? AND password = ?",
      [username, password],
      (err, result) => {
        if (result.length > 0) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect("/dashboard");
        } else {
          //kembali ke login dan tampilkan pesan error username/password salah
          res.redirect("/login", {
            error: "Username atau password salah",
          });
        }
        res.end();
      }
    );
  }
});

//route dashboard
app.get("/dashboard", (req, res) => {
  if (req.session.loggedin) {
    //lanjutin querynya
    const query1 = todo(); //query banyaknya customer
    const query2 = todo(); //query banyaknya complains
    const query3 = todo(); //query banyaknya purchases
    const query4 = todo(); //query banyaknya web visit per month
    
    res.render("dashboard", {
      username: req.session.username,
    });
  }
});

//upload file csv using multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./data_csv");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

//route upload
app.get("/dashboard/upload", (req, res) => {
  res.render("upload");
});

//route grafik
app.get("/dashboard/grafik", (req, res) => {
  res.render("grafik");
});

//logout
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});
// Menambahkan route untuk logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/login");
  });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});