const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());

app.use(bodyParser.json());

const users = [];

// 회원가입 API
app.post('/signup', (req, res) => {
  const { userId, password } = req.body;

  // 아이디 중복 체크
  if (users.find(user => user.userId === userId)) {
    return res.json({ success: false, message: '이미 존재하는 아이디입니다.' });
  }

  // 새 유저 추가
  users.push({ userId, password });
  res.json({ success: true, message: '회원가입 성공!' });
});

app.post('/login', (req, res) => {
    const { userId, password } = req.body;

    const user = (users.find(user => user.userId === userId) && users.find(user => user.password === password));

    if (user) {
        return res.json({ success: true});
    }
    else{
        return res.json({ success: false, message: '아이디 패스워드가 잘못되었습니다.' });
    }
  });


// 서버 실행
app.listen(5000, () => console.log('🚀 서버 실행 중 (포트 5000)'));