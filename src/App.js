import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Toolbar,
  Typography,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  School,
  Psychology,
  LiveHelp,
  Timeline,
} from '@mui/icons-material';
import './App.css';
import Login from './Login';
import Register from './Register';

// 커스텀 테마 생성
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // 밝은 하늘색
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
    },
    background: {
      default: '#0f172a',
      paper: 'rgba(30, 41, 59, 0.8)',
    },
  },
});

function App() {
  const [openStartDialog, setOpenStartDialog] = useState(false);

  const handleStartClick = () => {
    setOpenStartDialog(true);
  };

  const handleStartAsGuest = () => {
    // 비회원으로 시작하는 로직
    setOpenStartDialog(false);
    // TODO: 비회원 페이지로 이동
  };

  const handleLoginRedirect = () => {
    setOpenStartDialog(false);
    window.location.href = '/login';
  };

  // 별 생성 함수
  const createStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      const size = Math.random() * 3;
      stars.push({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${Math.random() * 3}s`,
        }
      });
    }
    return stars;
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <Box sx={{ 
              minHeight: '100vh',
              position: 'relative',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              overflow: 'hidden',
            }}>
              {/* 우주 배경 */}
              <div className="space-background">
                {createStars().map(star => (
                  <div key={star.id} className="star" style={star.style} />
                ))}
              </div>

              {/* 네비게이션 바 */}
              <AppBar position="static" sx={{ 
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
              }}>
                <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
                    AI 학습 플랫폼
                  </Typography>
                  <Button 
                    color="primary" 
                    variant="outlined"
                    onClick={() => window.location.href = '/login'}
                    sx={{
                      borderRadius: '20px',
                      px: 3,
                      borderColor: 'rgba(96, 165, 250, 0.5)',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                      }
                    }}
                  >
                    로그인
                  </Button>
                </Toolbar>
              </AppBar>

              {/* 히어로 섹션 */}
              <Box
                sx={{
                  position: 'relative',
                  pt: 8,
                  pb: 6,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)',
                    zIndex: 0,
                  }
                }}
              >
                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="primary.main"
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    AI와 함께 성장하는 학습
                  </Typography>
                  <Typography 
                    variant="h5" 
                    align="center" 
                    color="text.secondary" 
                    paragraph
                    sx={{ 
                      lineHeight: 1.8,
                      textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                    }}
                  >
                    최신 AI 기술을 활용한 맞춤형 학습 경험을 제공합니다.
                    개인화된 학습 경로와 실시간 피드백으로 효율적인 학습을 도와드립니다.
                  </Typography>
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      variant="contained" 
                      size="large"
                      onClick={handleStartClick}
                      sx={{
                        px: 6,
                        py: 2,
                        borderRadius: '50px',
                        background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s',
                        }
                      }}
                    >
                      시작하기
                    </Button>
                  </Box>
                </Container>
              </Box>

              {/* 시작하기 모달 */}
              <Dialog
                open={openStartDialog}
                onClose={() => setOpenStartDialog(false)}
                PaperProps={{
                  sx: {
                    background: 'rgba(30, 41, 59, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    minWidth: '300px',
                  }
                }}
              >
                <DialogTitle sx={{ textAlign: 'center', color: 'primary.main' }}>
                  시작 방법 선택
                </DialogTitle>
                <DialogContent>
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                    학습을 어떤 방식으로 시작하시겠습니까?
                  </Typography>
                </DialogContent>
                <DialogActions sx={{ flexDirection: 'column', gap: 2, p: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLoginRedirect}
                    sx={{
                      borderRadius: '50px',
                      py: 1.5,
                      background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
                      }
                    }}
                  >
                    로그인하기
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleStartAsGuest}
                    sx={{
                      borderRadius: '50px',
                      py: 1.5,
                      borderColor: 'rgba(96, 165, 250, 0.5)',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                      }
                    }}
                  >
                    비회원으로 시작하기
                  </Button>
                </DialogActions>
              </Dialog>

              {/* 특징 섹션 */}
              <Container sx={{ py: 8 }} maxWidth="md">
                <Grid container spacing={4}>
                  {[
                    {
                      icon: <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />,
                      title: 'AI 기반 학습 분석',
                      description: '개인의 학습 패턴을 분석하여 최적화된 학습 경로를 제시합니다.'
                    },
                    {
                      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
                      title: '분야별 커리큘럼',
                      description: '수준과 목표에 맞는 개인화된 학습 콘텐츠를 제공합니다.'
                    },
                    {
                      icon: <LiveHelp sx={{ fontSize: 40, color: 'primary.main' }} />,
                      title: '실시간 도움',
                      description: 'AI 챗봇을 통한 24/7 학습 지원 및 질문 답변을 제공합니다.'
                    },
                    {
                      icon: <Timeline sx={{ fontSize: 40, color: 'primary.main' }} />,
                      title: '학습 내용 관리',
                      description: '상세한 내용 관리와 성과 분석으로 효율적인 학습을 지원합니다.'
                    }
                  ].map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(30, 41, 59, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            {feature.icon}
                            <Typography variant="h5" component="div" sx={{ ml: 2, fontWeight: 'bold' }}>
                              {feature.title}
                            </Typography>
                          </Box>
                          <Typography variant="body1" color="text.secondary">
                            {feature.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>

              {/* 푸터 */}
              <Box 
                sx={{ 
                  bgcolor: 'rgba(15, 23, 42, 0.9)',
                  p: 6,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  }
                }} 
                component="footer"
              >
                <Typography variant="body2" color="text.secondary" align="center">
                  © 2024 AI 학습 플랫폼. All rights reserved.
                </Typography>
              </Box>
            </Box>
          } />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
