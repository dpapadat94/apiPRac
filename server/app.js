const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//mySQL
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "password",
  database: "students_db",
});

//GET
app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    connection.query("SELECT * from students", (err, rows) => {
      connection.release();
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    });
  });
});
//DELETE
app.delete("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) console.log(err);
    console.log(`connected as id ${connection.threadId}`);

    connection.query(
      "DELETE from students WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release();

        if (!err) {
          res.send(`Student with id of ${[req.params.id]} has been removed`);
        } else {
          console.log(err);
        }
      }
    );
  });
});
//POST
app.post("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) console.log(err);
    console.log(`connected as id ${connection.threadId}`);

    const params = req.body;

    connection.query("INSERT INTO students SET ?", params, (err, rows) => {
      connection.release();

      if (!err) {
        res.send(`Student with id of ${[params.id]} has been added`);
      } else {
        console.log(err);
      }
    });
    console.log(req.body);
  });
});
//PUT **update name of student**
app.put("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) console.log(err);
    console.log(`connected as id ${connection.threadId}`);

    const { id, name, grade } = req.body;

    connection.query(
      "UPDATE students SET name = ? WHERE id = ?",
      [name, id, grade],
      (err, rows) => {
        connection.release();

        if (!err) {
          res.send(`Student with id of ${id} has been updated`);
        } else {
          console.log(err);
        }
      }
    );
    console.log(req.body);
  });
});

//Listen on port
app.listen(port, () => console.log(`listening on port ${port}`));
