const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// MongoDB 연결
mongoose.connect('mongodb://127.0.0.1:27017/learning_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB 연결 성공'))
.catch(err => console.error('MongoDB 연결 실패:', err));

// 사용자 스키마 정의
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 회원가입 API
app.post('/api/register', async (req, res) => {
  try {
    const { userId, email, nickname, password } = req.body;

    // 필수 필드 검증
    if (!userId || !email || !nickname || !password) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 이메일 중복 체크
    const existingUser = await User.findOne({ $or: [{ email }, { userId }] });
    if (existingUser) {
      return res.status(400).json({ message: '이미 사용 중인 이메일 또는 아이디입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const newUser = new User({
      userId,
      email,
      nickname,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 로그인 API
app.post('/api/login', async (req, res) => {
  try {
    const { userId, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }

    // 로그인 성공
    res.json({
      message: '로그인 성공',
      user: {
        id: user._id,
        userId: user.userId,
        email: user.email,
        nickname: user.nickname
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 학습 기록 관련 API들
const learningHistory = [];

app.post('/api/generate-question', (req, res) => {
  const { keyword } = req.body;
  // 임시로 구현된 질문 생성 로직
  const question = `${keyword}에 대한 질문을 생성합니다.`;
  res.json({ question });
});

app.post('/api/submit-answer', (req, res) => {
  const { keyword, question, answer } = req.body;
  // 임시로 구현된 피드백 생성 로직
  const feedback = '답변에 대한 피드백을 제공합니다.';
  learningHistory.push({ keyword, question, answer, feedback });
  res.json({ feedback });
});

app.get('/api/learning-history', (req, res) => {
  res.json(learningHistory);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});