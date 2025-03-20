import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Home, Add, Edit } from '@mui/icons-material';

function ProfileSelect() {
  const [openNewProfile, setOpenNewProfile] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [newProfile, setNewProfile] = useState({
    name: '',
    role: '',
    description: '',
  });

  const handleCreateProfile = () => {
    setOpenNewProfile(true);
  };

  const handleCloseDialog = () => {
    setOpenNewProfile(false);
    setNewProfile({ name: '', role: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitProfile = () => {
    if (!newProfile.name || !newProfile.role || !newProfile.description) {
      return;
    }

    const profile = {
      id: Date.now(),
      ...newProfile,
      avatar: '👤', // 기본 아바타
    };

    setProfiles(prev => [...prev, profile]);
    handleCloseDialog();
  };

  const handleProfileSelect = (profileId) => {
    // 프로필 선택 시 학습 페이지로 이동
    window.location.href = '/learning';
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

      <Container maxWidth="md" sx={{ pt: 8 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: 'primary.main',
            mb: 6,
            fontWeight: 'bold',
          }}
        >
          프로필 선택
        </Typography>

        <Grid container spacing={3}>
          {profiles.map((profile) => (
            <Grid item xs={12} sm={6} md={4} key={profile.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(30, 41, 59, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', pb: 2 }}>
                  <Typography variant="h1" sx={{ mb: 2 }}>
                    {profile.avatar}
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {profile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {profile.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile.description}
                  </Typography>
                </CardContent>
                <Box sx={{ mt: 'auto', p: 2, display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleProfileSelect(profile.id)}
                    sx={{
                      borderRadius: '50px',
                      background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
                      }
                    }}
                  >
                    선택하기
                  </Button>
                  <IconButton
                    color="primary"
                    sx={{
                      border: '1px solid rgba(96, 165, 250, 0.5)',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                      }
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
          
          {/* 새 프로필 추가 카드 */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(30, 41, 59, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                }
              }}
              onClick={handleCreateProfile}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                minHeight: '300px'
              }}>
                <Add sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" component="div" sx={{ color: 'primary.main' }}>
                  새 프로필 만들기
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* 새 프로필 생성 다이얼로그 */}
      <Dialog
        open={openNewProfile}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'primary.main' }}>
          새 프로필 만들기
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="프로필 이름"
              name="name"
              value={newProfile.name}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
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
              label="역할"
              name="role"
              value={newProfile.role}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              required
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
              label="설명"
              name="description"
              value={newProfile.description}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              required
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              }
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitProfile}
            disabled={!newProfile.name || !newProfile.role || !newProfile.description}
            sx={{
              borderRadius: '50px',
              background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
              }
            }}
          >
            생성하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfileSelect; 