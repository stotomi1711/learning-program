import React from 'react';
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

function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 로직 구현
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
            회원가입
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="아이디"
                type="text"
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
                label="비밀번호 확인"
                type="password"
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
                회원가입
              </Button>
            </Box>
          </form>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              이미 계정이 있으신가요?{' '}
              <Button
                color="primary"
                sx={{ textTransform: 'none' }}
                onClick={() => window.location.href = '/login'}
              >
                로그인
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register; 