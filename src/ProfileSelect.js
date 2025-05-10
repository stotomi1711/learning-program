import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import { useUser } from './contexts/UserContext';

function ProfileSelect() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    category: '',
    difficulty: '초급'
  });

  const categories = [
    { value: '프로그래밍 언어', label: '프로그래밍 언어' },
    { value: '자격증', label: '자격증' },
  ];

  const handleAddProfile = async () => {
    const { name, category, difficulty } = newProfile;
    const userId = user?.userId;
  
    if (name.trim() && category && userId) {
      const profileData = {
        name: name.trim(),
        category,
        difficulty,
        userId,
      };
  
      console.log('보낼 데이터:', profileData); // 🔍 디버깅용
  
      try {
        const response = await fetch('http://localhost:5000/api/profiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });
  
        if (response.ok) {
          const savedProfile = await response.json();
          setProfiles(prev => [...prev, savedProfile]);
          setNewProfile({ name: '', category: '', difficulty: '초급' });
          setOpenDialog(false);
        } else {
          const errorText = await response.text();
          console.error('프로필 저장 실패:', errorText); // 🔍 응답 본문 출력
        }
      } catch (error) {
        console.error('서버 요청 중 오류:', error);
      }
    } else {
      console.warn('입력값이 부족하거나 userId가 없습니다.', {
        name,
        category,
        userId,
      });
    }
  };

  useEffect(() => {
    const userId = user?.userId;
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profiles?userId=${userId}`);
        const data = await response.json();
        setProfiles(data); // 기존에 useState로 선언된 setProfiles에 저장
      } catch (err) {
        console.error('프로필 불러오기 실패:', err);
      }
    };
  
    if (userId) {
      fetchProfiles();
    }
  }, [user?.userId]);

  const handleDeleteProfile = async (profileId) => {
    const userId = user?.userId;

  if (!userId) {
    console.warn('사용자 정보가 없습니다. 삭제 요청 중단');
    return;
  }

  console.log('삭제할 profileId:', profileId, 'userId:', userId);

  try {
    const response = await fetch(`http://localhost:5000/api/profiles/${profileId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }), // ✅ userId 포함
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('삭제 실패:', data.error || data);
      alert(data.error || '프로필 삭제에 실패했습니다.');
      return;
    }

    console.log('프로필 삭제 성공');
    alert(data.message || '프로필이 삭제되었습니다.');

    // ✅ 삭제된 프로필을 제외한 나머지만 상태에 반영
    setProfiles((prevProfiles) => prevProfiles.filter(profile => profile._id !== profileId));
  } catch (error) {
    console.error('삭제 요청 중 오류 발생:', error);
    alert('서버 오류로 인해 삭제할 수 없습니다.');
  }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Python': '#3776AB',
      'JavaScript': '#F7DF1E',
      'Java': '#007396',
      'C++': '#00599C',
      'C#': '#68217A',
      '정보처리기사': '#4CAF50',
      '컴퓨터활용능력2급': '#FF9800',
      'SQLD': '#2196F3',
      'ADsP': '#9C27B0',
    };
    return colors[category] || '#2196F3';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case '프로그래밍 언어':
        return <CodeIcon sx={{ fontSize: 40, color: '#fff' }} />;
      case '자격증':
        return <SchoolIcon sx={{ fontSize: 40, color: '#fff' }} />;
      default:
        return <CodeIcon sx={{ fontSize: 40, color: '#fff' }} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            textShadow: '0 0 20px rgba(0,0,0,0.3)',
          }}
        >
          학습 프로필
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            mb: 4,
          }}
        >
          나만의 학습 프로필을 만들어보세요
        </Typography>
      </Box>

      {profiles.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            p: 4,
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 2,
              textAlign: 'center',
            }}
          >
            아직 생성된 프로필이 없습니다
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
              },
            }}
          >
            새 프로필 만들기
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {profiles.map((profile) => (
            <Grid item xs={12} sm={6} md={4} key={profile._id}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  position: 'relative',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
                  },
                }}
              >
                <IconButton
                  onClick={() => handleDeleteProfile(profile._id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      color: '#ff4444',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <CardContent
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { background: 'rgba(255,255,255,0.05)' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                  }}
                  onClick={async () => {
                    try {
                      const response = await fetch('http://localhost:5000/api/profiles/select', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          userId: user?.userId,
                          profileId: profile._id,
                        }),
                      });

                      const data = await response.json();
                      if (response.ok) {
                        if (data.hasLearningHistory) {
                          // 학습 기록이 있는 경우 이어서 학습할지 확인
                          const continueLearning = window.confirm('이전 학습 기록이 있습니다. 이어서 학습하시겠습니까?');
                          if (continueLearning) {
                            // 이전 학습 기록으로 이동
                            navigate('/learning', { 
                              state: { 
                                category: profile.category,
                                lastQuestion: data.lastQuestion 
                              } 
                            });
                            return;
                          }
                        }
                        // 새로운 학습 시작
                        navigate('/learning', { state: { category: profile.category } });
                      } else {
                        alert(data.error || '프로필 선택 중 오류가 발생했습니다.');
                      }
                    } catch (err) {
                      console.error('선택된 프로필 전송 실패:', err);
                      alert('프로필 선택 중 오류가 발생했습니다.');
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(45deg, ${getCategoryColor(profile.category)} 30%, ${getCategoryColor(profile.category)}99 90%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      boxShadow: `0 4px 20px ${getCategoryColor(profile.category)}40`,
                    }}
                  >
                    {getCategoryIcon(profile.category)}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ 
                      color: '#fff',
                      fontWeight: 'bold',
                      textShadow: '0 0 10px rgba(0,0,0,0.3)',
                      mb: 2,
                    }}
                  >
                    {profile.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={profile.category}
                      sx={{
                        backgroundColor: getCategoryColor(profile.category),
                        color: '#fff',
                        fontWeight: 'bold',
                        px: 2,
                        py: 1,
                        fontSize: '1rem',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontStyle: 'italic',
                      mt: 1,
                    }}
                  >
                    {profile.category}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
                  background: 'rgba(255,255,255,0.15)',
                },
              }}
              onClick={() => setOpenDialog(true)}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <AddIcon sx={{ fontSize: 40, color: '#fff', mb: 1 }} />
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    새 프로필 추가
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>새 프로필 만들기</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="프로필 이름"
            fullWidth
            value={newProfile.name}
            onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
              },
            }}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>학습 주제</InputLabel>
            <Select
              value={newProfile.category}
              onChange={(e) => setNewProfile({ ...newProfile, category: e.target.value })}
              label="학습 주제"
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.7)',
                },
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            취소
          </Button>
          <Button
            onClick={handleAddProfile}
            disabled={!newProfile.name.trim() || !newProfile.category}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
              },
              '&.Mui-disabled': {
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            만들기
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.5)',
            '&:hover': {
              borderColor: '#fff',
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          홈으로 돌아가기
        </Button>
      </Box>
    </Container>
  );
}

export default ProfileSelect; 