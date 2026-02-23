import dotenv from "dotenv";

dotenv.config();

export const config = {
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL_PASS: process.env.EMAIL_PASS
}