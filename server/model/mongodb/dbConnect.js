import mongoose from "mongoose";
import chalk from "chalk";

const connectToMongo = () => {
  const environment = process.env.ENVIRONMENT || "development";
  const databaseName = "booksWebsite";
  const connectionString = `${process.env.REMOTE_URL}${databaseName}`;

  return new Promise((resolve, reject) => {
    mongoose
      .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(
          chalk.magentaBright.bold(
            `(mongoose) Connected to MongoDB at ${databaseName} [${environment}]`
          )
        );
        resolve();
      })
      .catch((err) => {
        console.log(
          chalk.redBright.bold(
            `Error connecting to MongoDB at ${databaseName}: `,
            err
          )
        );
        reject(err);
        process.exit(1);
      });
  });
};

export default connectToMongo;
