const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const connectDatabase = require("./config/database");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error");

const app = express();
const http = require("http").Server(app);

app.use(helmet());
// Set up helmet with CSP policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:9000"],
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// socket io
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
};

app.use("/peerjs", ExpressPeerServer(http, opinions));

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    setTimeout(() => {
      socket.to(roomId).emit("user-connected", userId);
    }, 1000);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

// import all routes
const user = require("./routes/userRoutes");

app.use("/api/v1", user);

// error middleware
app.use(errorMiddleware);

// config.env file
dotenv.config();

// Connect to database
connectDatabase();

const port = process.env.PORT || 9000;

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
