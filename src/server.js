require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");

console.log("MONGO_URI:", process.env.MONGO_URI); 

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas 연결 성공!"))
.catch(err => console.error("❌ MongoDB Atlas 연결 실패:", err));

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    nickname: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// 회원가입 API
app.post('/signup', async (req, res) => {
  const { userId, nickname ,password } = req.body;
  try {
    // 아이디 중복 체크
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
        return res.json({ success: false, message: "이미 존재하는 아이디입니다." });
    }

    // 새 유저 추가 (MongoDB에 저장)
    const newUser = new User({ userId, nickname, password });
    await newUser.save(); // MongoDB에 저장

    res.json({ success: true, message: "회원가입 성공!" });
} catch (err) {
    res.status(500).json({ success: false, message: "서버 오류", error: err.message });
}
});

app.post('/login', async (req, res) => {
    const { userId, password } = req.body;

    try {
        // userId와 password가 모두 일치하는 사용자 찾기
        const user = await User.findOne({ userId, password });
    
        if (user) {
          return res.json({ success: true });
        } else {
          return res.json({ success: false, message: '아이디 또는 패스워드가 잘못되었습니다.' });
        }
      } catch (err) {
        res.status(500).json({ success: false, message: '서버 오류', error: err.message });
      }
  });


// 서버 실행
app.listen(5000, () => console.log('🚀 서버 실행 중 (포트 5000)'));