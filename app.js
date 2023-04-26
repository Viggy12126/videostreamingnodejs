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
const url="http://localhost:3000";

// Using Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api/v1",course);
app.use("/api/v1",user);
app.use("/api/v1",payment);
app.use("/api/v1", other);

export default app;

app.get("/", (req, res) =>
  res.send(
    `<h1>Site is Working. click <a href=${url}>here</a> to visit frontend.</h1>`
  )
);

app.use(ErrorMiddleware);