var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var jsonwebtoken = require("jsonwebtoken");

const Task = require("../model/bookCollection");

/* GET home page. */
router.get("/", function (req, res, next) {
  //res.render("index", { title: "Express" });
  var token = jsonwebtoken.sign(123, "thisissecret");
  res.status(201).json({
    message: "JSON Web token created",
    token: "JWT " + token,
  });
});

//Router to add book

router.post("/addbook", (req, res, next) => {
  const { name, authorName, publishedYear, price, status } = req.body;
  if (!name) return res.status(402).json({ message: "Please enter name" });
  if (!authorName)
    return res.status(402).json({ message: "Please enter author name" });
  if (!publishedYear)
    return res.status(402).json({ message: "Please enter published year" });
  if (!price) return res.status(402).json({ message: "Please enter price" });

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    name,
    authorName,
    publishedYear,
    price,
    status,
  });
  task
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Book stored Successfully",
        bookDetails: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//Router to search the book

router.get("/search", (req, res, next) => {
  const { nameKey, start, count } = req.body;

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  Task.find({ $text: { $search: nameKey }, status: 1 })
    .skip(start)
    .limit(count)
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//Router to edit book

router.put("/editbook/:id", (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  
  const bookid = req.params.id;
  if (!bookid) return res.status(402).json({ message: "Please enter an id" });

  
  //const query =
  const data = req.body;
  console.log(taskid);
  //return next();

  Task.findOneAndUpdate({ _id: bookid }, data, {
    returnOriginal: false,
    useFindAndModify: false,
  })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//Router to delete a book

router.delete("/deletebook/:id", (req, res, next) => {
  const bookid = req.params.id;
  Task.remove({ _id: bookid })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
