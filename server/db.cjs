const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://127.0.0.1:27017";
const DATABASE_NAME = "projectnova";

const client = new MongoClient(MONGO_URI);

let database;

async function connectDB() {
try {
await client.connect();

database = client.db(DATABASE_NAME);

await database.command({ ping: 1 });

console.log("MongoDB connected successfully!");
console.log(`Database: ${DATABASE_NAME}`);

return database;

} catch (error) {
console.error("MongoDB connection failed:", error.message);
throw error;
}
}

function getDB() {
if (!database) {
throw new Error("Database is not connected.");
}

return database;
}

async function closeDB() {
await client.close();
}

module.exports = {
connectDB,
getDB,
closeDB
};