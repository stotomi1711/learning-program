require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ReactMarkdown = require('react-markdown');
const { generateQuestionPrompt, generateFeedbackPrompt, generateMultipleQuestionsPrompt, evaluateAnswerPrompt } = require('./prompt');

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
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  userId: { type: String, required: true }, 
});

const testSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  score: { type: Number, required: true },
  answers: [
    {
      question: String,
      choices: [String],
      answer: String,
    }
  ],
  keyword: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Question = mongoose.model('Question', questionSchema);
const Profile = mongoose.model('Profile', profileSchema);
const TestSchema = mongoose.model('testSchema', testSchema);

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

app.post('/api/profiles/select', async (req, res) => {
  const { userId, profileId } = req.body;

  if (!userId || !profileId) {
    return res.status(400).json({ error: 'userId 또는 profileId가 누락되었습니다.' });
  }

  try {
    // 프로필 정보 조회
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: '프로필을 찾을 수 없습니다.' });
    }

    // 해당 프로필의 가장 최근 학습 기록 조회
    const recentQuestions = await Question.find({ 
      userId, 
      profileId
    })
    .sort({ createdAt: -1 })  // 생성 시간 기준 내림차순 정렬
    .limit(1);

    selectedProfiles[userId] = profileId;
    console.log(`✅ ${userId} 사용자가 ${profileId} 프로필을 선택함`);

    res.json({ 
      message: '프로필이 선택되었습니다.',
      hasLearningHistory: recentQuestions.length > 0,
      lastQuestion: recentQuestions[0] ? {
        question: recentQuestions[0].question,
        keyword: recentQuestions[0].keyword,
        difficulty: recentQuestions[0].difficulty,
        answer: recentQuestions[0].answer,
        feedback: recentQuestions[0].feedback,
        createdAt: recentQuestions[0].createdAt
      } : null
    });
  } catch (error) {
    console.error('프로필 선택 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
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

async function callHuggingFaceZeroShot(model, inputText, candidateLabels) {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: inputText,
        parameters: { candidate_labels: candidateLabels }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[HuggingFace ${model}] 에러:`, errorText);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`[HuggingFace ${model}] 호출 실패:`, error);
    return null;
  }
}

app.post('/api/generate-question', async (req, res) => {
  const { userId, keyword, difficulty } = req.body;
  try {
    const prompt = generateQuestionPrompt(keyword, difficulty);
    const response = await callGemini(prompt);

    const questionMatch = response.match(/문제:\s*([\s\S]*?)(?=객관식 보기:|정답:|$)/);
    const answerMatch = response.match(/정답:\s*([\s\S]*?)$/);

    const question = questionMatch ? questionMatch[1].trim() : response.trim();
    const answer = answerMatch ? answerMatch[1].trim() : '';

    console.log('Parsed question:', question);
    console.log('Parsed answer:', answer);

    // ✅ 1단계: 문제와 정답이 적절한지 평가 (예: "적절함", "부적절함")
    const debertaCheck = await callHuggingFaceZeroShot(
      'facebook/bart-large-mnli',
      `문제: ${question}\n정답: ${answer}\n이 문제와 정답은 교육용으로 적절합니까?`,
      ['적절함', '부적절함']
    );
    console.log('DeBERTa(대체) result:', debertaCheck);

    if (!debertaCheck || debertaCheck.labels[0] !== '적절함' || debertaCheck.scores[0] < 0.6) {
      return res.status(400).json({ error: "문제의 품질이 낮습니다. 다시 생성해주세요." });
    }

    // ✅ 2단계: 정답의 논리성 평가 (예: "타당함", "타당하지 않음")
    const electraCheck = await callHuggingFaceZeroShot(
      'facebook/bart-large-mnli',
      `문제: ${question}\n정답: ${answer}\n이 정답은 질문에 대해 논리적으로 타당합니까?`,
      ['타당함', '타당하지 않음']
    );
    console.log('ELECTRA(대체) result:', electraCheck);

    if (!electraCheck || electraCheck.labels[0] !== '타당함' || electraCheck.scores[0] < 0.6) {
      return res.status(400).json({ error: "정답이 논리적으로 타당하지 않습니다." });
    }

    // ✅ 3단계: 최종 신뢰성 평가 (예: "신뢰", "불신")
    const finalCheck = await callHuggingFaceZeroShot(
      'facebook/bart-large-mnli',
      `문제: ${question}\n정답: ${answer}\n이 문제와 정답은 교육용으로 신뢰할 수 있습니까?`,
      ['신뢰', '불신']
    );
    console.log('Final check result:', finalCheck);

    if (!finalCheck || finalCheck.labels[0] !== '신뢰' || finalCheck.scores[0] < 0.6) {
      return res.status(400).json({ error: "최종 검증에서 통과하지 못했습니다." });
    }

    // 검증 통과 시 DB 저장 및 응답
    const profile = await Profile.findOne({ userId });
    const selectedProfileId = selectedProfiles[userId];

    const newQuestion = new Question({
      userId: userId || 'guest_' + Date.now(),
      keyword,
      question,
      answer,
      feedback: "피드백을 기다리는 중입니다.",
      profileId: selectedProfileId,
    });

    await newQuestion.save();
    res.json({ question, answer });
  } catch (error) {
    console.error('문제 생성 중 오류 발생:', error);
    res.status(500).json({
      error: "문제 생성 중 오류가 발생했습니다.",
      details: error.message
    });
  }
});



app.post('/api/submit-answer', async (req, res) => {
  const { userId, keyword, question, answer, correctAnswer } = req.body;
  
  try {
    // 정답 여부 확인
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    
    // Gemini API를 사용하여 해설 생성
    const prompt = generateFeedbackPrompt(keyword, question, correctAnswer, answer, isCorrect);
    
    const feedback = await callGemini(prompt);
    
    console.log('\n=== 생성된 해설 ===');
    console.log(feedback);
    console.log('===================\n');

    if (!userId) {
      return res.json({ 
        isCorrect,
        feedback 
      });
    }

    const questionToUpdate = await Question.findOne({ userId, keyword, question });
    if (!questionToUpdate) {
      return res.status(404).json({ error: '해당 질문을 찾을 수 없습니다.' });
    }

    questionToUpdate.answer = answer;
    questionToUpdate.feedback = feedback;
    await questionToUpdate.save();

    res.json({ 
      isCorrect,
      feedback 
    });
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

app.post('/api/generate-test-questions', async (req, res) => {
  const { difficulty, count, userId, keyword, category } = req.body;
  console.log('\n=== 테스트 문제 생성 시작 ===');
  console.log(`난이도: ${difficulty}`);
  console.log(`문제 수: ${count}`);
  console.log(`키워드: ${keyword}`);
  console.log(`카테고리: ${category}`);
  console.log('===========================\n');

  try {
    const questions = [];
    let objectiveCount = 0;
    let subjectiveCount = 0;
    const targetObjectiveCount = Math.floor(count * 0.7); // 70% 객관식

    for (let i = 0; i < count; i++) {
      // 남은 문제 수에 따라 객관식/주관식 결정
      const isObjective = objectiveCount < targetObjectiveCount;
      
      const prompt = generateMultipleQuestionsPrompt(difficulty, keyword, category, isObjective);

      const question = await callGemini(prompt);
      
      // 문제 파싱
      const questionText = question.split('객관식 보기:')[0].replace('문제:', '').trim();
      let options = [];
      let correctAnswer = '';

      if (isObjective) {
        const optionsText = question.split('객관식 보기:')[1]?.split('정답:')[0]?.trim() || '';
        const correctAnswerText = question.split('정답:')[1]?.trim() || '';
        
        options = optionsText.split('\n')
          .filter(line => line.trim().match(/^\d+\./))
          .map(line => line.replace(/^\d+\./, '').trim());
        
        // 보기가 4개가 아니면 다시 생성
        if (options.length !== 4) {
          i--; // 현재 반복을 다시 시도
          continue;
        }
        
        // 정답 번호 추출 (1-4 사이의 숫자)
        const correctAnswerNumber = parseInt(correctAnswerText.match(/\d+/)?.[0]);
        if (!correctAnswerNumber || correctAnswerNumber < 1 || correctAnswerNumber > 4) {
          i--; // 정답 번호가 유효하지 않으면 다시 생성
          continue;
        }
        
        correctAnswer = options[correctAnswerNumber - 1];
        objectiveCount++;
      } else {
        subjectiveCount++;
      }

      questions.push({
        question: questionText,
        isObjective,
        options: isObjective ? options : [],
        correctAnswer: isObjective ? correctAnswer : ''
      });

      // 각 문제 생성 시 로그 출력
      console.log(`\n=== 문제 ${i + 1} 생성 완료 ===`);
      console.log(`유형: ${isObjective ? '객관식' : '주관식'}`);
      console.log(`문제: ${questionText}`);
      if (isObjective) {
        console.log('보기:');
        options.forEach((option, idx) => {
          console.log(`${idx + 1}. ${option}`);
        });
        console.log(`정답: ${correctAnswer}`);
      }
      console.log('===========================\n');
    }

    // 최종 비율 확인
    console.log('\n=== 테스트 문제 생성 완료 ===');
    console.log(`생성된 문제 비율 - 객관식: ${objectiveCount}, 주관식: ${subjectiveCount}`);
    console.log('===========================\n');

    res.json({ success: true, questions });
  } catch (error) {
    console.error('테스트 문제 생성 중 오류 발생:', error);
    res.status(500).json({ 
      success: false,
      error: "서버에서 오류가 발생했습니다.",
      details: error.message 
    });
  }
});

app.post('/api/evaluate-subjective-answers', async (req, res) => {
  const { answers } = req.body;

  try {
    const evaluationResults = await Promise.all(answers.map(async (answer) => {
      const prompt = evaluateAnswerPrompt(answer.question, answer.answer);

      const evaluation = await callGemini(prompt);
      console.log('평가 결과:', {
        문제: answer.question,
        답변: answer.answer,
        평가: evaluation
      });
      
      const isCorrect = evaluation.trim().toLowerCase().includes('정답');
      
      return {
        index: answer.index,
        isCorrect,
        feedback: isCorrect ? '정답' : '오답'
      };
    }));

    res.json(evaluationResults);
  } catch (error) {
    console.error('주관식 답변 평가 중 오류 발생:', error);
    res.status(500).json({ 
      error: "주관식 답변 평가 중 오류가 발생했습니다.",
      details: error.message 
    });
  }
});

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
const RAPIDAPI_HOST = 'judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = '7cc39386femsh38807c9f3e133c1p115ff3jsnf675f018392e';

app.post('/api/compile-code', async (req, res) => {
  const { code, languageId } = req.body;

  if (!code || !languageId) {
    return res.status(400).json({ message: 'code와 languageId가 필요합니다.' });
  }

  try {
    // 1. 코드 제출
    const submitRes = await fetch(`${JUDGE0_API_URL}?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': RAPIDAPI_HOST,
        'X-RapidAPI-Key': RAPIDAPI_KEY,
      },
      body: JSON.stringify({ source_code: code, language_id: languageId }),
    });

    const result = await submitRes.json();
    console.log('Judge0 API 결과:', result);

    if (result.status && result.status.id !== 3) {
      // 컴파일 혹은 런타임 에러 발생
      return res.json({
        output: result.stderr || result.compile_output || result.message || 'Error occurred',
        status: result.status.description,
      });
    }

    res.json({ output: result.stdout || result.stderr || result.compile_output || 'No output' });
  } catch (error) {
    console.error('Judge0 호출 에러:', error);
    res.status(500).json({ message: '코드 실행 중 오류 발생', error: error.message });
  }
});

// 테스트 기록 조회 API
app.get('/api/test-history', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId 필요' });
  }

  try {
    const history = await TestSchema.find({ userId }).sort({ createdAt: -1 }).lean();
    res.status(200).json(history);
  } catch (error) {
    console.error('테스트 기록 조회 오류:', error);
    res.status(500).json({ success: false, error: '서버 오류' });
  }
});

// 테스트 기록 저장 API
app.post('/api/test-result', async (req, res) => {
  try {
    const { userId, title, answers, score, keyword } = req.body;

    console.log('📥 백엔드에서 받은 answers:', answers);

    const newResult = new TestSchema({
      userId,
      title,
      score,
      answers,
      keyword
    });

    await newResult.save();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ 테스트 결과 저장 오류:', err);
    res.status(500).json({ success: false, error: '저장 실패' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
