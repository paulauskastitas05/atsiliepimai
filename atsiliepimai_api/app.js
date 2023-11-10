//Projektas darytas Tito Paulausko ir Roko Rumeikos.

const express = require("express");
const bodyParser = require("body-parser");
var mysql = require("mysql");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const port = 3000;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "atsiliepimas_api",
});

con.connect(function (err) {
  if (err) throw err;
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Atsiliepimų išvedimas
app.get("/api/atsiliepimai/", (req, res) => {
  let sql = "SELECT * FROM atsiliepimai";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.write(JSON.stringify(result));
    return res.end();
  });
});

// Apskaičiuoja atsiliepimų įvertinimų vidurkį.
app.get("/api/atsiliepimai/vertinimas", (req, res) => {
  let sql = "SELECT AVG(vertinimas) as vidurkis FROM atsiliepimai"; 
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.write(JSON.stringify(result));
    return res.end();
  });
});

// Išveda atsiliepimus nuo naujausio iki seniausio
app.get("/api/atsiliepimai/sort/new", (req, res) => {
  let sql = "SELECT * FROM atsiliepimai ORDER BY laikas";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.write(JSON.stringify(result));
    return res.end();
  });
});

// Išveda atsiliepimus nuo seniausio iki naujausio
app.get("/api/atsiliepimai/sort/old", (req, res) => {
  let sql = "SELECT * FROM atsiliepimai ORDER BY laikas DESC";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.write(JSON.stringify(result));
    return res.end();
  });
});

// Išveda atsiliepimus nuo blogiausio iki geriausio įvertinimo
app.get("/api/atsiliepimai/sort/good", (req, res) => {
  let sql = "SELECT * FROM atsiliepimai ORDER BY vertinimas DESC";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.write(JSON.stringify(result));
    return res.end();
  });
});

// Išveda atsiliepimus nuo geriausio iki blogiausio įvertinimo
app.get("/api/atsiliepimai/sort/bad", (req, res) => {
  let sql = "SELECT * FROM atsiliepimai ORDER BY vertinimas ";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.write(JSON.stringify(result));
    return res.end();
  });
});

// Atsiliepimo išvedimas
app.get("/api/atsiliepimai/:id", (req, res) => {
  let id = req.params.id;
  let sql = "SELECT * FROM atsiliepimai WHERE id = ?";
  con.query(sql, [id], function (err, result, fields) {
    if (err) throw err;

    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.write(JSON.stringify(result));
    return res.end();
  });
});

// Atsiliepimo sukūrimas
app.post("/api/atsiliepimai/", (req, res) => {
  let vardas = req.body.vardas;
  let pastas = req.body.pastas;
  let vertinimas = req.body.vertinimas;
  let tekstas = req.body.tekstas;
  let sql = "INSERT INTO atsiliepimai (vardas, pastas, vertinimas, tekstas) VALUES (?, ?, ?, ?)";
  con.query(sql, [vardas, pastas, vertinimas, tekstas], function (err, result, fields) {
    if (err) throw err;
    return res.json({
      status: "success",
      data: {
        id: result.insertId
      }
    });
  });
});

// Atsiliepimų informacijos keitimas
app.put("/api/atsiliepimai/:id", (req, res) => {
  // gauname Atsiliepimo informaciją pagal id
  let id = req.params.id;
  let sql = "SELECT * FROM atsiliepimai WHERE id = ?";
  con.query(sql, [id], function (err, result, fields) {
    if (err) throw err;
    if (result.length) {
      let atsiliepimas = result[0];

      if (req.body.vardas) {
        atsiliepimas.vardas = req.body.vardas;
      };

      if (req.body.pastas) {
        atsiliepimas.pastas = req.body.pastas;
      }

      if (req.body.vertinimas) {
        atsiliepimas.vertinimas = req.body.vertinimas;
      }

      if (req.body.tekstas) {
        atsiliepimas.tekstas = req.body.tekstas;
      }

      let sql = "UPDATE atsiliepimai SET vardas = ?, pastas = ?, vertinimas = ?, tekstas = ? WHERE id = ?";
      con.query(
        sql,
        [atsiliepimas.vardas, atsiliepimas.pastas, atsiliepimas.vertinimas, atsiliepimas.tekstas, id],
        function (err, result, fields) {
          if (err) throw err;
          return res.json({
            status: "success"
          });
        }
      );
    } else {
      console.log("nerado");
      return res.status(404).send({
        status: 404,
        message: "Error: not found"
      });
    }
  });
});

// Atsiliepimo trynimas
app.delete("/api/atsiliepimai/:id", (req, res) => {
  // Atsiliepimo ID išvedimas
  let id = req.params.id;
  let sql = "SELECT * FROM atsiliepimai WHERE id = ?";
  con.query(sql, [id], function (err, result, fields) {
    if (err) throw err;
    if (result.length) {
      let sql = "DELETE FROM atsiliepimai WHERE id = ?";
      con.query(sql, [id], function (err, result, fields) {
        if (err) throw err;
        return res.json({
          status: "success"
        });
      });
    } else {
      console.log("nerado");
      return res.status(404).send({
        status: 404,
        message: "Error: not found"
      });
    }
  });
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});