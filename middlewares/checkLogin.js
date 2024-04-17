const jwt = require("jsonwebtoken");

// Middleware để xác thực JWT
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401); // Không tìm thấy token, gửi mã trạng thái 401 (Unauthorized)

  // Xác thực token
  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.sendStatus(403); // Token không hợp lệ, gửi mã trạng thái 403 (Forbidden)
    req.user = user;
    next(); // Chuyển tiếp yêu cầu đến middleware tiếp theo nếu token hợp lệ
  });
}

// Route xử lý đăng nhập
app.post("/api/user/login", (req, res) => {
  // Xác thực thông tin đăng nhập
  const { username, password } = req.body;
  // Code xác thực thông tin đăng nhập ở đây...

  // Nếu thông tin đăng nhập hợp lệ, tạo JWT và gửi lại cho client
  const token = jwt.sign({ username }, "your_secret_key", { expiresIn: "1h" });
  res.json({ token });
});

// Route yêu cầu được bảo vệ bằng JWT
app.get("/api/user/profile", authenticateToken, (req, res) => {
  // Thực hiện các thao tác chỉ dành cho người dùng đã đăng nhập
});
