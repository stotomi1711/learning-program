import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
  Timeline,
  Home,
  KeyboardArrowDown,
  School,
} from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import Login from './Login';
import Register from './Register';
import ProfileSelect from './ProfileSelect';
import Learning from './learning';
import LearningHistory from './learning-history';
import MockTest from './mock-test';
import { UserProvider, useUser } from './contexts/UserContext';
import Logout from './Logout';

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
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    body1: {
      letterSpacing: '0.01em',
      lineHeight: 1.7,
    },
    body2: {
      letterSpacing: '0.01em',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          fontWeight: 500,
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
  const { user } = useUser();
  const [openStartDialog, setOpenStartDialog] = useState(false);
  const [openGuestWarningDialog, setOpenGuestWarningDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            </>
          ) : (
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

      {/* 로그아웃 컴포넌트 */}
      <Logout 
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      />

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
                <Box
                  sx={{
                    position: 'relative',
                    mb: 6,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-20px',
                      left: '-20px',
                      right: '-20px',
                      bottom: '-20px',
                      background: 'radial-gradient(circle at center, rgba(0, 180, 216, 0.1) 0%, transparent 70%)',
                      borderRadius: '30px',
                      zIndex: -1,
                    }
                  }}
                >
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
                      mb: 3,
                      background: 'linear-gradient(45deg, #00b4d8, #0096c7)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100px',
                        height: '4px',
                        background: 'linear-gradient(90deg, transparent, #00b4d8, transparent)',
                        borderRadius: '2px',
                      }
                    }}
                  >
                    AI와 함께하는<br />
                    새로운 학습의 시작 ✨
                  </Typography>
                </Box>
                <Typography 
                  variant="h5" 
                  align="center" 
                  color="text.secondary" 
                  paragraph
                  sx={{ 
                    lineHeight: 1.8,
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
                    letterSpacing: '0.02em',
                    maxWidth: '800px',
                    mx: 'auto',
                    mb: 4,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60px',
                      height: '60px',
                      background: 'radial-gradient(circle at center, rgba(0, 180, 216, 0.2) 0%, transparent 70%)',
                      borderRadius: '50%',
                      zIndex: -1,
                    }
                  }}
                >
                  <Box component="span" sx={{ 
                    color: 'primary.main', 
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(0, 180, 216, 0.3)',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #00b4d8, transparent)',
                    }
                  }}>
                    AI 기술
                  </Box>
                  을 활용한 맞춤형 학습 경험으로
                  <br />
                  <Box component="span" sx={{ 
                    color: 'primary.main', 
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(0, 180, 216, 0.3)',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #00b4d8, transparent)',
                    }
                  }}>
                    개인화된 학습
                  </Box>
                  과
                  <Box component="span" sx={{ 
                    color: 'primary.main', 
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(0, 180, 216, 0.3)',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #00b4d8, transparent)',
                    }
                  }}>
                    실시간 평가
                  </Box>
                  로
                  <br />
                  더 효율적이고 효과적인 학습을 경험하세요 🌟
                </Typography>
                <Box sx={{ 
                  mt: 4, 
                  display: 'flex', 
                  justifyContent: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle at center, rgba(0, 180, 216, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    zIndex: -1,
                  }
                }}>
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
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        transition: '0.5s',
                      },
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(0, 180, 216, 0.4)',
                        transition: 'all 0.3s ease',
                        '&::before': {
                          left: '100%',
                        }
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

            {/* 특징 섹션 */}
            <Container sx={{ py: 8 }} maxWidth="md">
              <Grid container spacing={4}>
                {[
                  {
                    icon: <Timeline sx={{ fontSize: 40, color: 'primary.main' }} />,
                    title: '학습 기록 관리',
                    description: '학습한 내용을 관리하고 해답과 해설을 보실 수 있습니다.'
                  },
                  {
                    icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
                    title: '모의 테스트',
                    description: '실제 시험처럼 실력을 테스트하고 결과를 확인할 수 있습니다.'
                  }
                ].map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card 
                      onClick={() => {
                        if (feature.title === '학습 기록 관리') {
                          navigate('/learning-history');
                        } else if (feature.title === '모의 테스트') {
                          navigate('/mock-test');
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
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'radial-gradient(circle at center, rgba(0, 180, 216, 0.1) 0%, transparent 70%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 30px rgba(0, 180, 216, 0.2)',
                          borderColor: 'rgba(0, 180, 216, 0.3)',
                          '&::before': {
                            opacity: 1,
                          }
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 2,
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-10px',
                            left: 0,
                            width: '100%',
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, rgba(0, 180, 216, 0.3), transparent)',
                          }
                        }}>
                          {feature.icon}
                          <Typography variant="h5" component="div" sx={{ 
                            ml: 2, 
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #00b4d8, #0096c7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}>
                            {feature.title}
                          </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary" sx={{
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '40px',
                            height: '40px',
                            background: 'radial-gradient(circle at center, rgba(0, 180, 216, 0.1) 0%, transparent 70%)',
                            borderRadius: '50%',
                            zIndex: -1,
                          }
                        }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile-select" element={<ProfileSelect />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning-history" element={<LearningHistory />} />
        <Route path="/mock-test" element={<MockTest />} />
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
