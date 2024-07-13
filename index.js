import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;
const API_URL = "https://covers.openlibrary.org/b/"

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "Bingenstraat1!",
  port: 5432,
});
db.connect();

let books = [];
let bookId = 2;
let sortOption = "books.id";

//Render the home page
app.get ("/", async (req, res) => {
  try{
    const result = await db.query(`SELECT * FROM books JOIN reviews ON books.id = book_id ORDER BY  ${sortOption} ASC`);
    books = result.rows;
    console.log(books);
    res.render("index.ejs", {
      books: books 
    });
  } catch (err) {
    console.error(err.stack);
  };
});

//Sort the books
app.post("/sort", async(req, res) => {
  sortOption = req.body.sort;
  console.log(sortOption);
  res.redirect("/")
});

//Render the notes page of a book
app.get("/notes/:id", async (req, res) => {
  const bookId = req.params.id;
  console.log(bookId);
  try {
    const result = await db.query("SELECT notes, cover_isbn FROM books WHERE id = $1;", [bookId]);
    if (result.rows.length > 0) {
      const notes = result.rows[0].notes;
      const cover = result.rows[0].cover_isbn;
      console.log(notes);
      res.render("notes.ejs", {notes: notes, coverIsbn: cover})};
  } catch (err) {
    console.error(err.stack);
    res.status(500).send("Error retrieving notes.");
  }
});

//Render the add page to add a new book
app.get("/add", (req, res) => {
  res.render("modify.ejs")
});

//Add a new book
app.post("/add", async(req, res) =>{
  const title = req.body.title;
  const isbn = req.body.isbn;
  const rating = req.body.rating;
  const notes = req.body.notes;
  const reviewText = req.body.review;
  try{
    const result = await db.query("INSERT INTO books (title, cover_isbn, notes) VALUES ($1, $2, $3) RETURNING *;",
    [title, isbn, notes]);
    console.log(result);
    const id = result.rows[0].id

    await db.query("INSERT INTO reviews (book_id, rating, review_text) VALUES ($1, $2, $3);",
    [id, rating, reviewText]);
    res.redirect("/")
  } catch (err) {
    console.error(err.stack);
  }
});


//Render the edit page
app.get("/edit/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const result = await db.query("SELECT * FROM books JOIN reviews ON books.id = reviews.book_id WHERE books.id = $1", [bookId]);
    const book = result.rows[0];
    res.render("modify.ejs", { book: book, heading: "Update your book", submit: "Update"}); // book contains the data retrieved from the database
  } catch (err) {
    console.error(err.stack);
    res.status(500).send("Error fetching book details.");
  }
});

//Partially edit a book
app.post("/edit", async(req, res) => {
  const updatedBookId = req.body.updatedBookId
  const title = req.body.title;
  const isbn = req.body.isbn;
  const rating = req.body.rating;
  const notes = req.body.notes;
  const reviewText = req.body.review;
  try{
    
    await db.query("UPDATE books SET title = $1, cover_isbn = $2, notes = $3 WHERE id = $4; ",
    [title, isbn, notes, updatedBookId]);

    await db.query("UPDATE reviews SET rating = $1, review_text = $2 WHERE book_id = $3;",
    [rating, reviewText, updatedBookId]);
    res.redirect("/");
  } catch (err) {
    console.error(err.stack)
  };
});


//Delete a book
app.post("/delete", async(req,res) => {
  const deleteBookId = req.body.deleteBookId;
  try{
    await db.query("DELETE FROM books WHERE id = $1;",
    [deleteBookId]);

    await db.query("DELETE FROM reviews WHERE id = $1;",
    [deleteBookId]);
    res.redirect("/")
  } catch (err) {
    console.error(err.stack)
  };
});



app.listen(port, () => {
  console.log(`Sever is running in port ${port}`);
});


