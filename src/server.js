require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const app = express();

console.log('MONGO_URI:', process.env.MONGO_URI);
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
  answer: { type: String, required: true },
  feedback: { type: String, required: true },
  profileId: { type: String, required: true },
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

// 프로필 선택 API
const selectedProfiles = {}; // userId: profileId

app.post('/api/profiles/select', (req, res) => {
  const { userId, profileId } = req.body;

  if (!userId || !profileId) {
    return res.status(400).json({ error: 'userId 또는 profileId가 누락되었습니다.' });
  }

  selectedProfiles[userId] = profileId;
  console.log(`✅ ${userId} 사용자가 ${profileId} 프로필을 선택함`);
  res.json({ message: '프로필이 선택되었습니다.' });
});

// 선택된 프로필 확인용 API (선택 사항)
app.get('/api/profiles/selected', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId가 필요합니다.' });

  const profileId = selectedProfiles[userId];
  if (!profileId) return res.status(404).json({ error: '선택된 프로필이 없습니다.' });

  res.json({ profileId });
});

// 학습 기록 관련 API들
const learningHistory = [];

const GEMINI_API_KEY = "AIzaSyDOr27elrSqDqUEofpsGmvRnkbWR8Xgh_g";

async function callGemini(prompt) {
  try {
    console.log('Gemini API 호출 시작:', prompt);
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

    console.log('Gemini API 응답 상태:', response.status);
    console.log('Gemini API 응답 헤더:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API 호출 실패:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Gemini API 호출 실패: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API 응답 데이터:', data);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "결과 없음";
  } catch (error) {
    console.error('Gemini API 호출 중 예외 발생:', error);
    throw error;
  }
}

app.post('/api/generate-question', async (req, res) => {
  const { userId, keyword } = req.body;
  console.log('문제 생성 요청:', { userId, keyword });
  
  try {
    const prompt = `${keyword}에 대한 하나의 코드문제제만 생성해주세요. 질문은 명확하고 구체적이어야 하며, 학습자가 이해하기 쉬워야 합니다.`;
    console.log('생성할 프롬프트:', prompt);
    
    const question = await callGemini(prompt);
    console.log('생성된 질문:', question);

    if (!userId) {
      // userId가 없을 경우, 문제만 생성하고 저장하지 않음
      return res.json({ question });
    }

    // 사용자의 프로필 조회
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ error: '사용자의 프로필을 찾을 수 없습니다.' });
    }

    const selectedProfileId = selectedProfiles[userId];

    // 생성된 질문을 DB에 저장
    const newQuestion = new Question({
      userId: userId || 'guest_' + Date.now(),
      keyword,
      question,
      answer: "답변을 기다리는 중입니다.",
      feedback: "피드백을 기다리는 중입니다.",
      profileId: selectedProfileId, // 프로필의 _id를 사용
    });

    await newQuestion.save();
    console.log('DB에 저장 완료:', newQuestion);

    res.json({ question });
  } catch (error) {
    console.error('문제 생성 중 오류 발생:', error);
    res.status(500).json({ 
      error: "서버에서 오류가 발생했습니다.",
      details: error.message 
    });
  }
});

app.post('/api/submit-answer', async (req, res) => {
  const { userId, keyword, question, answer } = req.body;
  
  try {
    // Gemini API를 사용하여 답변 평가 및 피드백 생성
    const prompt = `
      다음은 학습자의 답변입니다. 이 답변을 평가하고 피드백을 제공해주세요.
      
      키워드: ${keyword}
      질문: ${question}
      답변: ${answer}
      
      다음 형식으로 피드백을 제공해주세요:
      1. 정답 여부 (맞았습니다/틀렸습니다)
      2. 답변의 정확성 평가
      3. 개선이 필요한 부분
      4. 추가 학습을 위한 제안
    `;
    
    const feedback = await callGemini(prompt);

    if (!userId) {
      return res.json({ feedback });
    }

    const questionToUpdate = await Question.findOne({ userId, keyword, question });
    if (!questionToUpdate) {
      return res.status(404).json({ error: '해당 질문을 찾을 수 없습니다.' });
    }

    questionToUpdate.answer = answer;
    questionToUpdate.feedback = feedback;
    await questionToUpdate.save();

    res.json({ feedback });
  } catch (error) {
    console.error('답변 평가 중 오류 발생:', error);
    res.status(500).json({ 
      error: "답변 평가 중 오류가 발생했습니다.",
      details: error.message 
    });
  }
});

app.get('/api/learning-history', async (req, res) => {
  console.log('API 요청 도달');
  const { userId, profileId } = req.query;

  console.log('Received userId:', userId);
  console.log('Received profileId:', profileId);

  if (!userId || !profileId) {
    return res.status(400).json({ error: 'userId와 profileId가 필요합니다.' });
  }

  try {
    const questions = await Question.find({ userId, profileId })  // profileId 조건 추가
      .select('question answer feedback profileId keyword createdAt');

    console.log(questions);  // 데이터 확인 로그
    res.json(questions);
  } catch (error) {
    console.error('학습 기록 조회 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});