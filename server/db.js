import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const mongoConnectionUrl = process.env.MONGODB_CON_STR;

class DB {
  constructor(mongoConnectionUrl) {
    this.mongoClient = new MongoClient(mongoConnectionUrl);
    this.dbName = "booksWebsite";
    this.booksCollectionName = "books";
    this.usersCollectionName = "users";
  }

  async connect() {
    try {
      await this.mongoClient.connect();
      this.db = this.mongoClient.db(this.dbName);
      console.log("Connected successfully to DB");
    } catch (error) {
      console.error("Error during DB connection: ", error);
      throw error;
    }
  }

  getCollection(name) {
    return this.db.collection(name);
  }

  async getUserByEmail(email) {
    console.log("Attempting to fetch user by email:", email);
    const usersCollection = this.getCollection(this.usersCollectionName);
    try {
      const user = await usersCollection.findOne({ email });
      console.log("User found:", user);
      return user;
    } catch (error) {
      console.error("Error fetching user from database:", error);
      throw error;
    }
  }

  async createUser(userData) {
    console.log("Attempting to create user:", userData);
    const usersCollection = this.getCollection(this.usersCollectionName);
    const result = await usersCollection.insertOne(userData);
    console.log("User creation result:", result);
    return result;
  }

  async getBookData(id) {
    try {
      const booksCollection = this.getCollection("books");
      const result = await booksCollection.findOne({ id });
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error getting book data: ", error);
    }
  }

  generateRandomPrice(min, max) {
    const price = Math.random() * (max - min) + min;
    const roundPrice = Math.round(price / 5) * 5;
    return roundPrice;
  }

  generateRandomAmount() {
    return Math.floor(Math.random() * 5) + 1;
  }

  async checkFavoriteStatus(userId, bookId) {
    const usersCollection = this.getCollection(this.usersCollectionName);
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      console.log("User data:", user);
      const isFavorite = user ? user.favorites.includes(bookId) : false;
      console.log("Favorites:", user?.favorites);
      return isFavorite;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      throw error;
    }
  }

  async likeBook(bookId, userId) {
    const booksCollection = this.getCollection("books");

    const result = await booksCollection.updateOne(
      { id: bookId },
      { $addToSet: { likes: userId } }
    );
    console.log("User liked the book:", result);
    return result;
  }

  async unlikeBook(bookId, userId) {
    const booksCollection = this.getCollection("books");

    const result = await booksCollection.updateOne(
      { id: bookId },
      { $pull: { likes: userId } }
    );
    console.log("User unliked the book:", result);
    return result;
  }
  async saveBookId(id, imageLinks) {
    const price = this.generateRandomPrice(20, 100);
    const amount = Math.floor(Math.random() * 5) + 1;
    const booksCollection = this.getCollection("books");

    try {
      const existingDocument = await booksCollection.findOne({ id });
      if (!existingDocument) {
        const insertResult = await booksCollection.insertOne({
          id: id,
          price: price,
          amount: amount,
          likes: [],
          imageLinks,
        });

        const newBookData = await booksCollection.findOne({
          _id: insertResult.insertedId,
        });
        console.log("New book added:", newBookData);
        return newBookData;
      } else {
        console.log("Book already exists:", existingDocument);
        return existingDocument;
      }
    } catch (error) {
      console.error("Error saving book ID:", error);
      throw error;
    }
  }

  async decrementBookQuantity(bookId) {
    const booksCollection = this.getCollection(this.booksCollectionName);
    try {
      const result = await booksCollection.updateOne(
        { id: bookId, amount: { $gt: 0 } },
        { $inc: { amount: -1 } }
      );
      if (result.modifiedCount === 0) {
        throw new Error(
          `No book found with ID ${bookId} with sufficient quantity to decrement.`
        );
      }
      console.log(`Decrement quantity for book ID ${bookId}:`, result);
      return result;
    } catch (error) {
      if (error.message.includes("sufficient quantity to decrement")) {
        throw new Error("Sorry, one of your books is currently out of stock");
      } else {
        throw new Error("An error occurred while updating book quantity.");
      }
    }
  }

  async getAllBooks() {
    const booksCollection = this.getCollection(this.booksCollectionName);
    try {
      const books = await booksCollection.find({}).toArray();

      return books;
    } catch (error) {
      console.error("Error fetching all books:", error);
      throw error;
    }
  }
}

const db = new DB(mongoConnectionUrl);

export default db;
