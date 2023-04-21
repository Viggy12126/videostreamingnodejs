import  express  from "express";
import { config } from "dotenv";
import course from "./routes/courseRoutes.js";
import user from "./routes/userRoutes.js";
import payment from "./routes/paymentRoutes.js";
import  ErrorMiddleware  from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import other from "./routes/otherRoutes.js";

config({
    path:'./config/config.env',
})

const app=express();

// Using Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/v1",course);
app.use("/api/v1",user);
app.use("/api/v1",payment);
app.use("/api/v1", other);

export default app;

app.use(ErrorMiddleware);