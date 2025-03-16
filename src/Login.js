import React, { useState } from 'react';
import axios from 'axios';
import AxiosCtr from './AxiosCtr';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { Home } from '@mui/icons-material';

function Login() {
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { getCancelToken } = AxiosCtr();

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const cancelToken = getCancelToken();

    console.log('로그인 정보', formData); 

    try {
      console.log('서버에 로그인 요청 전송 중...');
      const response = await axios.post('http://localhost:5000/login', {
        userId: formData.userId,
        password: formData.password,
      }, {
        cancelToken: cancelToken,
      });

      if (response.data.success) {
        setSuccessMessage('로그인 성공.');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError(response.data.message || '로그인 실패');
      }
    } catch (error) {
      setError('서버 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 네비게이션 바 */}
      <AppBar position="static" sx={{ 
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="primary"
            onClick={() => window.location.href = '/'}
            sx={{ mr: 2 }}
          >
            <Home />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
            AI 학습 플랫폼
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 별 배경 효과 */}
      <div className="space-background">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 3;
          return (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          );
        })}
      </div>

      <Container maxWidth="sm" sx={{ pt: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              color: 'primary.main',
              mb: 4,
              fontWeight: 'bold',
            }}
          >
            로그인
          </Typography>
          <form onSubmit={handleSubmit}>
            {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
            {successMessage && <Typography color="green" sx={{ mt: 2, textAlign: 'center' }}>{successMessage}</Typography>}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="아이디"
                type="text"
                name="userId"
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <TextField
                label="비밀번호"
                type="password"
                name="password"
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: '50px',
                  background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
                  },
                }}
              >
                로그인
              </Button>
            </Box>
          </form>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              계정이 없으신가요?{' '}
              <Button
                color="primary"
                sx={{ textTransform: 'none' }}
                onClick={() => window.location.href = '/register'}
              >
                회원가입
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login; 