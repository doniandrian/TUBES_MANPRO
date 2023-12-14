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
  res.render("Login");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    db.query(
      "SELECT * FROM users WHERE username = ? AND pass = ?;",
      [username, password],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          res.redirect("/login");
        } else {
          console.log(result);
          if (result.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect("/dashboard");
          } else {
            res.redirect("/login?error=Username atau password salah");
          }
        }
      }
    );
  } else {
    res.redirect("/login?error=Username atau password tidak valid");
  }
});

//route dashboard
app.get("/dashboard", (req, res) => {
  if (req.session.loggedin) {
    //lanjutin querynya
    const query1 = "SELECT COUNT(`ID`) AS 'customer' FROM people;"; //query banyaknya customer
    const query2 = "SELECT SUM(`Complain`) AS 'complain' FROM people;"; //query banyaknya complains
    const query3 =
      "SELECT SUM(`NumWebPurchases`) AS 'Web Purchases', SUM(`NumCatalogPurchases`) AS 'Catalog Purchases', SUM(`NumStorePurchases`) AS 'Store Purchases' FROM place;"; //query banyaknya purchases
    const query4 = "SELECT SUM(`NumWebVisitsMonth`) AS 'Jvisit' FROM place;"; //query banyaknya web visit per month

    db.query(query1, (err, result) => {
      if (err) {
        console.error("Database error:", err);
      } else {
        console.log(result);
        db.query(query2, (err, result2) => {
          if (err) {
            console.error("Database error:", err);
          } else {
            console.log(result2);
            db.query(query3, (err, result3) => {
              if (err) {
                console.error("Database error:", err);
              } else {
                console.log(result3);
                db.query(query4, (err, result4) => {
                  if (err) {
                    console.error("Database error:", err);
                  } else {
                    console.log(result4);
                    res.render("Dashboard", {
                      customer: result[0].customer,
                      complain: result2[0].complain,
                      purchase:
                        result3[0]["Web Purchases"] +
                        result3[0]["Catalog Purchases"] +
                        result3[0]["Store Purchases"],
                      visit: result4[0].Jvisit,
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.redirect("/login");
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
app.get("/upload", (req, res) => {
  res.render("UploadData");
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  console.log(req.file.path);
});

//route grafik
app.get("/grafik", (req, res) => {
  res.render("Grafik");
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
