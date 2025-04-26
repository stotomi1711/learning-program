const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)  // 환경변수 사용 예시
  .then(() => console.log('MongoDB 연결 성공!'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

// 사용자 스키마 정의
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

const questionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  keyword: { type: String, required: true },
  question: { type: String, required: true },
}, { versionKey: false });

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  userId: { type: String, required: true }, // <- 여기 추가
});

const User = mongoose.model('User', userSchema);
const Question = mongoose.model('Question', questionSchema);
const Profile = mongoose.model('Profile', profileSchema);

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 회원가입 API
app.post('/api/register', async (req, res) => {
  try {
    const { userId, email, nickname, password } = req.body;

    // 필수 필드 검증
    if (!userId || !email || !nickname || !password) {
      return res.status(400).json({ 
        success: false,
        message: '모든 필드를 입력해주세요.',
        missingFields: {
          userId: !userId,
          email: !email,
          nickname: !nickname,
          password: !password
        }
      });
    }

    // 이메일과 아이디 중복 체크
    const existingUser = await User.findOne({ $or: [{ email }, { userId }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ 
          success: false,
          message: '이미 사용 중인 이메일입니다.' 
        });
      }
      if (existingUser.userId === userId) {
        return res.status(400).json({ 
          success: false,
          message: '이미 사용 중인 아이디입니다.' 
        });
      }
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
    
    // 성공 응답
    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: {
        userId: newUser.userId,
        nickname: newUser.nickname,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ 
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: error.message 
    });
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

// 프로필 추가 API
app.post('/api/profiles', async (req, res) => {
  try {
    const { name, category, difficulty, userId } = req.body;

    if (!name || !category || !difficulty || !userId) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    const newProfile = new Profile({
      name,
      category,
      difficulty,
      userId, // <- 저장
    });

    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('프로필 저장 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 프로필 정보 전달 API
app.get('/api/profiles', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId가 필요합니다.' });
    }

    const profiles = await Profile.find({ userId });

    res.json(profiles);
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 프로필 삭제 API
app.delete('/api/profiles/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId가 필요합니다.' });
    }

    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: '프로필을 찾을 수 없습니다.' });
    }

    if (profile.userId !== userId) {
      return res.status(403).json({ error: '해당 프로필을 삭제할 권한이 없습니다.' });
    }

    await Profile.findByIdAndDelete(profileId);

    res.json({ message: '프로필이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('프로필 삭제 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 학습 기록 관련 API들
const learningHistory = [];

const GEMINI_API_KEY = "AIzaSyDOr27elrSqDqUEofpsGmvRnkbWR8Xgh_g";

async function callGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  console.log('응답 상태 코드:', response.status);  // 상태 코드 출력

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error('API 호출 실패:', errorMessage);
    throw new Error(`API 호출 실패: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  console.log('API 호출 성공:', data);  // 성공한 호출에 대한 확인 메시지
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "결과 없음";
}



app.post('/api/generate-question', async (req, res) => {
  const { userId, keyword } = req.body;
  // 임시로 구현된 질문 생성 로직
  const prompt = `${keyword}에 대한 질문을 생성합니다.`;
  try {
    const question = await callGemini(prompt);

    // 생성된 질문을 DB에 저장 (userId와 createdAt 포함)
    const newQuestion = new Question({
      userId,  // 사용자 아이디
      keyword,  // 키워드
      question, // 생성된 질문
    });

    await newQuestion.save();  // DB에 저장

    res.json({ question });  // 클라이언트에 질문 응답
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "서버에서 오류가 발생했습니다." });  // 오류 처리
  }
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