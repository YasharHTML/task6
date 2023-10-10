import "reflect-metadata";

import * as dotenv from "dotenv";
dotenv.config();

const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = +(process.env.PORT ?? "3000");

import express from "express";
import { router as newsRouter } from "./router/news";
import { router as authRouter } from "./router/auth";
import { AppDataSource } from "./datasource";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./utils/passport";

AppDataSource.initialize();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use((req, res, next) => {
    console.log(
        `${req.method} ${req.url} query:`,
        req.query,
        "body:",
        req.body
    );
    next();
});



app.use(
    "/api/newsposts",
    passport.authenticate("jwt", { session: false }),
    newsRouter
);
app.use("/api/auth", authRouter);

app.listen(PORT, HOST, () => {
    console.log("Listening: " + HOST + ":" + PORT);
});
