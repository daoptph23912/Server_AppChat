const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const Chat = require("./models/chat.models");
const User = require("./models/user.model");
const logger = require("morgan");
const app = express();
const server = http.createServer(app);
var cors = require("cors");
app.use(cors()); // Use this after the variable declaration
const apiChat = require("./routes/api_chat_route");
const apiUser = require("./routes/api_user_route");
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001", // Chỉ định origin của client React
    methods: ["GET", "POST"], // Chỉ định các phương thức được phép
  },
});
mongoose
  .connect("mongodb://127.0.0.1/ChatAppBkav", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.post("http://localhost:3000/api/user", async (req, res) => {
  try {
    // Lấy thông tin người dùng từ yêu cầu
    const { username, password, email } = req.body;

    // Log dữ liệu gửi từ client
    console.log("Data received from client:", req.body);

    // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await User.findOne({ username });
    // const passWord = await User.findOne({ password });
    // const emailll = await User.findOne({ email });

    // Log dữ liệu của người dùng đã tồn tại (nếu có)
    console.log("Existing user:", existingUser);
    // console.log("Existing user:", passWord);
    // console.log("Existing user:", emailll);

    // Nếu người dùng đã tồn tại, trả về lỗi
    if (existingUser) {
      console.log("Username already exists");
      return res.status(400).json({ message: "Username already exists" });
    }

    // // Tạo một đối tượng người dùng mới
    // const newUser = new User({
    //   username,
    //   password,
    //   email,
    // });

    // // Lưu thông tin người dùng vào cơ sở dữ liệu
    // await newUser.save();

    // Log thông báo khi tạo người dùng thành công
    console.log("User created successfully");

    // Trả về phản hồi thành công
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Log lỗi khi đăng nhập
    console.error("Error creating user:", error);

    // Trả về phản hồi lỗi
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Xử lý kết nối từ client
socketIo.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  // Lắng nghe sự kiện khi nhận tin nhắn từ client
  socket.on("sendDataClient", async (data) => {
    console.log(data);

    // Lưu tin nhắn vào cơ sở dữ liệu MongoDB
    try {
      const newMessage = new Chat({
        content: data.content,
        username: data.username,
      });
      await newMessage.save();
      console.log("Message saved to database");
    } catch (error) {
      console.error("Error saving message to database:", error);
    }

    // Gửi tin nhắn đến tất cả client (bao gồm cả client gửi tin nhắn này)
    socketIo.emit("sendDataServer", { data });
  });

  socketIo.on("sendUserData", async (data) => {
    console.log("User data received:", data);

    // Thực hiện các hành động liên quan đến dữ liệu người dùng ở đây
  });
  // Xử lý khi client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});
// app.use(express.logger("dev "));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Sử dụng router API
app.use("/api", apiChat);
app.use("/api", apiUser);
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// Xử lý đường dẫn mặc định
app.get("/", (req, res) => {
  res.send("Welcome to the Chat App"); // Gửi chuỗi "Welcome to the Chat App" khi truy cập đường dẫn gốc
});
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // API
  res.status(err.status || 500);

  if (req.originalUrl.indexOf("/api") == 0) {
    res.json({
      status: 0,
      msg: err.message,
    });
  } else {
    res.render("error");
  }
});
// Khởi động server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
