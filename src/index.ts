import cors from "cors";
import express from "express";

import { CONFIG } from "./config/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import {
    routeMethodNotAllowedMiddleware,
    routeNotFoundMiddleware,
} from "./middlewares/routesError.middleware.js";
import routes from "./routes/index.route.js";

export const app = express();

const corsOptions = {
    origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (req, res) => {
    res.json({ message: "API is running!" });
});

app.use(routeMethodNotAllowedMiddleware);
app.use(routeNotFoundMiddleware);
app.use(errorHandler);

app.listen(CONFIG.PORT, () => {
    console.log(`Example app listening on port ${CONFIG.PORT}`);
});
