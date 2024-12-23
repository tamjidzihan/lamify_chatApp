const dotenv = require("dotenv")
dotenv.config()

const ORIGIN = '*'
const PORT = 5000

const FIREBASE_CONFIG = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};


module.exports = {
    ORIGIN,
    PORT,
    FIREBASE_CONFIG
}