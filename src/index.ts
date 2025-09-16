import cors from "cors";
import express from "express";

const app = express();

const corsOptions = {
    origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT ?? "3000";

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
