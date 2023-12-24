//import library
import express from "express";
import mysql from "mysql";
import bodyPafrser from "body-parser";
import session from "express-session";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import fs from "fs";
import csv from "fast-csv";
import events from "events";

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
                    if (result2[0].complain === 0) {
                      result2[0].complain = 0
                    }
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
  const __dirname = './data_csv'
  readCSVFile(__dirname + "/" + req.file.filename);
  
  //set timeout before redirect
  setTimeout(function () {
    res.redirect("/upload?success");
  }, 7000);

  
  
});

const progressBar = new events.EventEmitter();
async function readCSVFile(path) {
  try {
    const stream = fs.createReadStream(path);
    const csvData = await new Promise((resolve, reject) => {
      const data = [];
      const filestream = csv
        .parse({ delimiter: ';' })
        .on('data', (row) => data.push(row))
        .on('end', () => resolve(data))
        .on('error', (error) => reject(error));

      stream.pipe(filestream);
    });

    csvData.shift(); // Remove the header

    const query1 =
      "INSERT INTO People (`ID`,`Year_Birth`,`Education`,`Marital_Status`,`Income`,`Kidhome`,`Teenhome`,`Dt_Customer`,`Recency`,`Complain`) VALUES (?,?,?,?,?,?,?,?,?,?);";

    const query2 =
      "INSERT INTO products (`ID`,`MntWines`,`MntFruits`,`MntMeatProducts`,`MntFishProducts`,`MntSweetProducts`,`MntGoldProds`) VALUES (?, ?, ?, ?, ?, ?, ?);";

    const query3 =
      "INSERT INTO promotion (`ID`,`NumDealsPurchases`,`AcceptedCmp3`,`AcceptedCmp4`,`AcceptedCmp5`,`AcceptedCmp1`,`AcceptedCmp2`,`Response`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

    const query4 =
      "INSERT INTO place (`ID`,`NumWebPurchases`,`NumCatalogPurchases`,`NumStorePurchases`,`NumWebVisitsMonth`) VALUES (?, ?, ?, ?, ?);";

    for (let i = 0; i < csvData.length; i++) {
      const data = csvData[i];
      //console.log(data);

      //skip row if there are empty values
      if (data.includes("")) {
        continue;
      }


      await executeQuery(query1, [
        data[0], data[1], data[2], data[3], data[4],
        data[5], data[6], data[7], data[8], data[25]
      ]);

      await executeQuery(query2, [
        data[0], data[9], data[10], data[11],
        data[12], data[13], data[14]
      ]);

      await executeQuery(query3, [
        data[0], data[15], data[20], data[21],
        data[22], data[23], data[24], data[28]
      ]);

      await executeQuery(query4, [
        data[0], data[16], data[17], data[18], data[19]
      ]);

      progressBar.emit("progress", i + 1);
    }

    fs.unlinkSync(path); // Remove the CSV file after processing
    progressBar.emit("done");

  } catch (error) {
    console.error("Error:", error);
    progressBar.emit("error", error);
  }
}

progressBar.on("progress", (progress) => {
  //console.log(`Processing row ${progress}`);
});




progressBar.on("done", () => {
  console.log("Done processing CSV file");
});

progressBar.on("error", (error) => {
  console.error("Error processing CSV file:", error);
});

app.get('/progress', (req, res) => {
  res.json({ progress: progressBar.current, total: progressBar.total });
  
});




// Helper function to execute a database query and return a promise
function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
//route grafik
app.get("/grafik", (req, res) => {
  res.render("Grafik");
});

//route table
app.get("/get-data-tabel/:agregat/:atributtarget/:kelompok", (req, res) => {
  const agregat = req.params.agregat;
  const atributtarget = req.params.atributtarget;
  const kelompok = req.params.kelompok;
  let query = ``;
  if(agregat == "SUM"){
    query = `SELECT ${kelompok}, sum(${atributtarget})
    FROM people 
    inner join products ON people.ID = products.ID
    inner join promotion ON people.ID = promotion.ID
    inner join place ON people.ID = place.ID
    GROUP BY ${kelompok};`;
  }else if(agregat == "COUNT"){
    query = `SELECT ${kelompok}, count(${atributtarget})
    FROM people 
    inner join products ON people.ID = products.ID
    inner join promotion ON people.ID = promotion.ID
    inner join place ON people.ID = place.ID
    GROUP BY ${kelompok};`;
  }else if (agregat == "AVG"){
    query = `SELECT ${kelompok}, avg(${atributtarget})
    FROM people 
    inner join products ON people.ID = products.ID
    inner join promotion ON people.ID = promotion.ID
    inner join place ON people.ID = place.ID
    GROUP BY ${kelompok};`;

  }

  db.query(query, (err, result) => {
    if (err) {
      console.error("Database error:", err);
    } else {
      console.log(result);
      res.json(result);
    }
  });
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

app.post("/education", (req, res) => {
  const query = "select education, count(education) from people group by education;";
  db.query(query, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

app.post("/marriage", (req, res) => {
  const query = "select Marital_Status, count(Marital_Status) from people group by Marital_Status;";
  db.query(query, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

app.post("/amount", (req, res) => {
  const query = "SELECT 'MntWines' AS Product, COUNT(MntWines) AS Count FROM products UNION SELECT 'MntFruits' AS Product, COUNT(MntFruits) AS Count FROM products UNION SELECT 'MntMeatProducts' AS Product, COUNT(MntMeatProducts) AS Count FROM products UNION SELECT 'MntFishProducts' AS Product, COUNT(MntFishProducts) AS Count FROM products UNION SELECT 'MntSweetProducts' AS Product, COUNT(MntSweetProducts) AS Count FROM products UNION SELECT 'MntGoldProds' AS Product, COUNT(MntGoldProds) AS Count FROM products;";
  db.query(query, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

app.post("/campaign", (req, res) => {
  const query = "SELECT 'AcceptedCmp1' AS Campaign, COUNT(AcceptedCmp1) AS Count FROM Promotion UNION SELECT 'AcceptedCmp2' AS Campaign, COUNT(AcceptedCmp2) AS Count FROM Promotion UNION SELECT 'AcceptedCmp3' AS Campaign, COUNT(AcceptedCmp3) AS Count FROM Promotion UNION SELECT 'AcceptedCmp4' AS Campaign, COUNT(AcceptedCmp4) AS Count FROM Promotion UNION SELECT 'AcceptedCmp5' AS Campaign, COUNT(AcceptedCmp5) AS Count FROM Promotion;";
  db.query(query, (err) => {
    if (err) {
      console.log(err);
    }
  });
});
