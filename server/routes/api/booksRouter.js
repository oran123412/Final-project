import express from "express";
import db from "../../db.js";
import axios from "axios";

const router = express.Router();
// ./api/books

router.get("/author's-books", async (req, res) => {
  try {
    const { q, orderBy } = req.query;
    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: `inauthor:${q}`,
          orderBy,
          key: process.env.REACT_APP_GOOGLE_BOOKS_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching books:", error);
    res
      .status(500)
      .send({ message: "Failed to fetch books", error: error.toString() });
  }
});

router.get("/youtube", async (req, res) => {
  try {
    const { q } = req.query;

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          q,
          part: "snippet",
          maxResults: 5,
          type: "video",
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res
      .status(500)
      .send({ message: "Failed to fetch videos", error: error.toString() });
  }
});

router.get("/wikipedia", async (req, res) => {
  try {
    const { titles } = req.query;
    const response = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "query",
        format: "json",
        prop: "pageimages|info|extracts",
        titles,
        pithumbsize: 500,
        inprop: "url",
        exintro: true,
        explaintext: true,
        origin: "*",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error);
    res.status(500).send({
      message: "Failed to fetch Wikipedia data",
      error: error.toString(),
    });
  }
});
router.get("/google-books", async (req, res) => {
  try {
    const { q, orderBy } = req.query;

    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q,
          orderBy,
          key: process.env.REACT_APP_GOOGLE_BOOKS_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Google Books API:", error);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/search-bar", async (req, res) => {
  const { q, orderBy = "newest" } = req.query;
  try {
    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: q,
          orderBy: orderBy,
          key: process.env.GOOGLE_BOOKS_API_KEY,
        },
      }
    );

    const savedBooks = await Promise.all(
      response.data.items.map(async (item) => {
        const bookData = await db.saveBookId(
          item.id,
          item.volumeInfo.imageLinks?.thumbnail
        );
        return {
          ...item.volumeInfo,
          savedData: bookData,
        };
      })
    );

    res.json(savedBooks);
  } catch (error) {
    console.error("Failed to fetch or save data from Google Books API:", error);
    res.status(500).json({
      error: "Failed to fetch or save data",
      details: error.message,
    });
  }
});

router.get("/google-book/:bookId", async (req, res) => {
  const { bookId } = req.params;
  const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

  try {
    const response = await axios.get(googleBooksUrl);
    res.send(response.data);
  } catch (error) {
    console.error("Failed to fetch data from Google Books API:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
router.get("/favorites/status-user", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }

  try {
    const books = await db
      .getCollection("books")
      .find({
        likes: { $in: [userId] },
      })
      .toArray();

    const favoriteBooks = books.map((book) => ({ bookId: book.id }));
    res.json(favoriteBooks);
  } catch (error) {
    console.error("Error fetching favorite books:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/favorites/status", async (req, res) => {
  const { userId, bookId } = req.query;
  try {
    const user = await db.getCollection("users").findOne({ _id: userId });
    const isFavorite = user && user.favorites.includes(bookId);
    res.json({ isFavorite: !!isFavorite });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/:bookId/like", async (req, res) => {
  const bookId = req.params.bookId;
  const userId = req.body.userId;
  try {
    const result = await db.likeBook(bookId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during like operation:", error);
    res
      .status(500)
      .json({ message: "Failed to like the book", error: error.toString() });
  }
});

router.post("/:bookId/unlike", async (req, res) => {
  const { bookId } = req.params;
  const userId = req.body.userId;

  try {
    const result = await db.unlikeBook(bookId, userId);
    if (result.modifiedCount === 0) {
      return res.status(404).send("No such book found or user not in likes.");
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to unlike book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/purchase", async (req, res) => {
  const { items } = req.body;
  try {
    const results = await Promise.all(
      items.map((item) => db.decrementBookQuantity(item.id))
    );

    res.json({
      message: "Purchase was successful and quantities updated.",
      items: results,
    });
  } catch (error) {
    console.error("Failed to process purchase:", error);
    if (
      error.message === "Sorry, one of your books is currently out of stock"
    ) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Error processing purchase.");
    }
  }
});

async function getBookDetails(bookId) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}`
  );
  const bookData = await response.json();
  return bookData;
}

router.get("/detail/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const bookDetails = await getBookDetails(bookId);

    const bookData = await db.saveBookId(
      bookId,
      bookDetails.volumeInfo.imageLinks
    );

    if (bookData) {
      res.status(200).json(bookData);
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    console.error("Error in book-detail route:", error);
    res.status(500).send(`Error occurred: ${error.message}`);
  }
});

router.get("/google-swiper-detail", async (req, res) => {
  const { q } = req.query;
  const maxResults = 20;
  const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes`,
      {
        params: {
          q: q,
          maxResults: maxResults,
          key: apiKey,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Google Books API:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch data from Google Books API" });
  }
});
router.get("/all", async (req, res) => {
  try {
    const books = await db.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error("Failed to fetch books:", error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

router.get("/", async (req, res) => {
  const { q, maxResults, orderBy } = req.query;
  try {
    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: `subject:${q}`,
          maxResults,
          orderBy,
          key: process.env.REACT_APP_GOOGLE_BOOKS_API_KEY,
        },
      }
    );

    const validBooks = response.data.items.filter(
      (book) =>
        book.volumeInfo.authors &&
        (book.volumeInfo.imageLinks?.thumbnail || true)
    );

    res.json({ items: validBooks });
  } catch (error) {
    console.error("Error fetching data from Google Books API:", error.message);
    res.status(500).json({
      error: "Failed to fetch data",
      details: error.message,
    });
  }
});

export default router;
