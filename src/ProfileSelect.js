import React, { useState } from 'react';
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

function ProfileSelect() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    category: '',
    difficulty: '',
  });

  const categories = [
    { value: '프로그래밍 언어', label: '프로그래밍 언어' },
    { value: '자격증', label: '자격증' },
  ];

  const handleAddProfile = () => {
    if (newProfile.name.trim() && newProfile.category && newProfile.difficulty) {
      setProfiles([...profiles, { ...newProfile, id: Date.now() }]);
      setNewProfile({ name: '', category: '', difficulty: '' });
      setOpenDialog(false);
    }
  };

  const handleDeleteProfile = (profileId) => {
    setProfiles(profiles.filter(profile => profile.id !== profileId));
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

  const getDifficultyColor = (difficulty) => {
    const colors = {
      '초급': '#4CAF50',
      '중급': '#FF9800',
      '고급': '#F44336',
    };
    return colors[difficulty] || '#2196F3';
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
            <Grid item xs={12} sm={6} md={4} key={profile.id}>
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
                  onClick={() => handleDeleteProfile(profile.id)}
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
                  }}
                  onClick={() => navigate('/learning')}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ 
                      color: '#fff',
                      fontWeight: 'bold',
                      textShadow: '0 0 10px rgba(0,0,0,0.3)',
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
                      }}
                    />
                    <Chip
                      label={profile.difficulty}
                      sx={{
                        backgroundColor: getDifficultyColor(profile.difficulty),
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontStyle: 'italic',
                    }}
                  >
                    {profile.category} {profile.difficulty} 레벨
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

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>난이도</InputLabel>
            <Select
              value={newProfile.difficulty}
              onChange={(e) => setNewProfile({ ...newProfile, difficulty: e.target.value })}
              label="난이도"
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
              <MenuItem value="초급">초급</MenuItem>
              <MenuItem value="중급">중급</MenuItem>
              <MenuItem value="고급">고급</MenuItem>
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
            disabled={!newProfile.name.trim() || !newProfile.category || !newProfile.difficulty}
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