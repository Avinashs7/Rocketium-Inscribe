require("dotenv").config()

const environment=process.env.ENVIRONMENT;
const logDirectory=process.env.LOG_DIRECTORY;
const cors_origin=process.env.CORS_ORIGIN;
const DB_NAME=process.env.DB_NAME;
const DB_URI=process.env.DB_URI;

module.exports={
    environment, 
    logDirectory,
    cors_origin,
    DB_NAME,
    DB_URI
}