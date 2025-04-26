import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  School,
  Psychology,
  LiveHelp,
  Timeline,
  Home,
  KeyboardArrowDown,
} from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import Login from './Login';
import Register from './Register';
import ProfileSelect from './ProfileSelect';
import Learning from './learning';
import LearningHistory from './learning-history';
import { UserProvider, useUser } from './contexts/UserContext';

// 커스텀 테마 생성
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b4d8', // 밝은 청록색
    },
    secondary: {
      main: '#ff6b6b', // 산호색
    },
    text: {
      primary: '#ffffff',
      secondary: '#a8b2c1',
    },
    background: {
      default: '#000000',
      paper: 'rgba(17, 24, 39, 0.8)',
    },
  },
  typography: {
    fontFamily: '"Pretendard", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

function AppContent() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openLogoutSuccessDialog, setOpenLogoutSuccessDialog] = useState(false);
  const [openStartDialog, setOpenStartDialog] = useState(false);
  const [openGuestWarningDialog, setOpenGuestWarningDialog] = useState(false);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setOpenLogoutDialog(false);
    setOpenLogoutSuccessDialog(true);
    handleClose();
  };

  const handleLogoutSuccessClose = () => {
    setOpenLogoutSuccessDialog(false);
    navigate('/');
  };

  const handleStartClick = () => {
    if (user) {
      navigate('/profile-select');
    } else {
      setOpenStartDialog(true);
    }
  };

  const handleStartAsGuest = () => {
    setOpenStartDialog(false);
    setOpenGuestWarningDialog(true);
  };

  const handleConfirmGuestStart = () => {
    setOpenGuestWarningDialog(false);
    navigate('/learning');
  };

  const handleLoginRedirect = () => {
    setOpenStartDialog(false);
    navigate('/login');
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
    <Box sx={{ 
      minHeight: '100vh',
      position: 'relative',
      background: '#000000',
      overflow: 'hidden',
    }}>
      {/* 네비게이션 바 */}
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <Home />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI 학습 플랫폼
          </Typography>
          {user ? (
            <>
              <Button
                color="inherit"
                onClick={handleClick}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  color: '#00b4d8',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 180, 216, 0.1)',
                  }
                }}
              >
                {user.nickname}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    background: 'rgba(17, 24, 39, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <MenuItem 
                  onClick={() => {
                    handleClose();
                    navigate('/profile');
                  }}
                  sx={{
                    color: '#00b4d8',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 180, 216, 0.1)',
                    }
                  }}
                >
                  회원정보
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleClose();
                    setOpenLogoutDialog(true);
                  }}
                  sx={{
                    color: '#ff6b6b',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    }
                  }}
                >
                  로그아웃
                </MenuItem>
              </Menu>
              <Dialog
                open={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
                PaperProps={{
                  sx: {
                    background: 'rgba(17, 24, 39, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <DialogTitle sx={{ color: '#00b4d8' }}>
                  로그아웃
                </DialogTitle>
                <DialogContent>
                  <Typography>
                    정말 로그아웃 하시겠습니까?
                  </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
                      }
                    }}
                  >
                    로그아웃
                  </Button>
                  <Button
                    onClick={() => setOpenLogoutDialog(false)}
                    variant="outlined"
                    sx={{
                      color: '#00b4d8',
                      borderColor: '#00b4d8',
                      '&:hover': {
                        borderColor: '#00b4d8',
                        backgroundColor: 'rgba(0, 180, 216, 0.1)',
                      }
                    }}
                  >
                    취소
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          ) : location.pathname !== '/login' && (
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{
                color: '#00b4d8',
                '&:hover': {
                  backgroundColor: 'rgba(0, 180, 216, 0.1)',
                }
              }}
            >
              로그인
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* 우주 배경 */}
      <div className="space-background">
        {createStars().map(star => (
          <div key={star.id} className="star" style={star.style} />
        ))}
      </div>

      <Routes>
        <Route path="/" element={
          <Box>
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
                    textShadow: '0 0 20px rgba(0, 180, 216, 0.5)',
                    letterSpacing: '-0.02em',
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
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
                    letterSpacing: '0.02em',
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
                      borderRadius: '12px',
                      background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
                      boxShadow: '0 4px 20px rgba(0, 180, 216, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(0, 180, 216, 0.4)',
                        transition: 'all 0.3s ease',
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

            {/* 비회원 경고 모달 */}
            <Dialog
              open={openGuestWarningDialog}
              onClose={() => setOpenGuestWarningDialog(false)}
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
                비회원 모드 안내
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  비회원으로 시작할 경우 학습 내용이 저장되지 않습니다.
                  <br />
                  학습 기록을 저장하시려면 로그인 후 이용해주세요.
                </Typography>
              </DialogContent>
              <DialogActions sx={{ flexDirection: 'column', gap: 2, p: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleConfirmGuestStart}
                  sx={{
                    borderRadius: '50px',
                    py: 1.5,
                    background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
                    }
                  }}
                >
                  확인했습니다. 시작하기
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setOpenGuestWarningDialog(false);
                    navigate('/login');
                  }}
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
                  로그인하러 가기
                </Button>
              </DialogActions>
            </Dialog>

            {/* 로그아웃 성공 다이얼로그 */}
            <Dialog
              open={openLogoutSuccessDialog}
              onClose={handleLogoutSuccessClose}
              PaperProps={{
                sx: {
                  background: 'rgba(17, 24, 39, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <DialogTitle sx={{ color: '#00b4d8' }}>
                로그아웃 완료
              </DialogTitle>
              <DialogContent>
                <Typography>
                  로그아웃이 성공적으로 완료되었습니다.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={handleLogoutSuccessClose}
                  sx={{
                    color: '#00b4d8',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 180, 216, 0.1)',
                    }
                  }}
                >
                  확인
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
                    title: '분야별 문제 제공',
                    description: '수준과 난이도를 선택하여 개인화된 학습 문제를 제공합니다.'
                  },
                  {
                    icon: <LiveHelp sx={{ fontSize: 40, color: 'primary.main' }} />,
                    title: '실시간 도움',
                    description: 'AI 챗봇을 통한 학습 문제에 대한 힌트를 제공합니다.'
                  },
                  {
                    icon: <Timeline sx={{ fontSize: 40, color: 'primary.main' }} />,
                    title: '학습 기록 관리',
                    description: '학습한 내용 관리와 피드백 및 해설로 효율적인 학습을 지원합니다.'
                  }
                ].map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card 
                      onClick={() => {
                        if (feature.title === '학습 기록 관리') {
                          navigate('/learning-history');
                        }
                      }}
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(17, 24, 39, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: feature.title === '학습 기록 관리' ? 'pointer' : 'default',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 30px rgba(0, 180, 216, 0.2)',
                          borderColor: 'rgba(0, 180, 216, 0.3)',
                        }
                      }}
                    >
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile-select" element={<ProfileSelect />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning-history" element={<LearningHistory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

function AppWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default AppWrapper;
