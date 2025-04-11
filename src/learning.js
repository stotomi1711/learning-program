import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { useUser } from './contexts/UserContext';

function Learning() {
  const { user } = useUser();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showCustomInputDialog, setShowCustomInputDialog] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [generatedQuestion, setGeneratedQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { name: 'Python', color: '#3776AB' },
    { name: 'C', color: '#A8B9CC' },
    { name: 'C#', color: '#68217A' },
    { name: 'Java', color: '#007396' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'PHP', color: '#777BB4' },
    { name: 'C++', color: '#00599C' },
    { name: '직접입력', color: '#68217A' },
  ];

  const certifications = [
    { name: '컴퓨터활용능력1급', color: '#FF6B6B' },
    { name: '컴퓨터활용능력2급', color: '#4ECDC4' },
    { name: '정보처리기사', color: '#45B7D1' },
    { name: '직접입력', color: '#68217A' },
  ];

  const handleLanguageSelect = (language) => {
    if (language.name === '직접입력') {
      setShowCustomInputDialog(true);
    } else {
      setSelectedItem(language);
      setShowInfoDialog(true);
    }
  };

  const handleCertificationSelect = (certification) => {
    if (certification.name === '직접입력') {
      setShowCustomInputDialog(true);
    } else {
      setSelectedItem(certification);
      setShowInfoDialog(true);
    }
  };

  const handleStartLearning = async () => {
    if (!selectedItem) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: selectedItem.name,
          userId: user?.userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '문제 생성에 실패했습니다.');
      }

      const data = await response.json();
      if (!data.question) {
        throw new Error('생성된 문제가 없습니다.');
      }
      setGeneratedQuestion(data.question);
      setShowInfoDialog(false);
    } catch (error) {
      console.error('Error:', error);
      alert(`문제 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomInput = () => {
    if (customInput.trim()) {
      setSelectedItem({ name: customInput, color: '#68217A' });
      setShowCustomInputDialog(false);
      setShowInfoDialog(true);
      setCustomInput('');
    }
  };

  if (generatedQuestion) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#fff', mb: 3 }}>
              생성된 문제
            </Typography>
            <Typography variant="body1" sx={{ color: '#fff', whiteSpace: 'pre-line', mb: 3 }}>
              {generatedQuestion}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setGeneratedQuestion(null)}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '20px',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                },
              }}
            >
              돌아가기
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      position: 'relative',
      background: '#000000',
      overflow: 'hidden',
    }}>
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary.main" sx={{ flex: 1 }}>
            학습 주제 선택
          </Typography>
        </Box>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          학습하고 싶은 주제를 선택해주세요.
        </Typography>

        {/* 프로그래밍 언어 선택 섹션 */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, color: 'primary.main' }}>
          프로그래밍 언어
        </Typography>
        <Grid container spacing={3}>
          {languages.map((language) => (
            <Grid item xs={12} sm={6} md={4} key={language.name}>
              <Button
                fullWidth
                onClick={() => handleLanguageSelect(language)}
                sx={{
                  height: '120px',
                  borderRadius: '16px',
                  background: `linear-gradient(45deg, ${language.color} 30%, ${language.color}99 90%)`,
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 10px 20px ${language.color}40`,
                  }
                }}
              >
                {language.name}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 6, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* 자격증 선택 섹션 */}
        <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
          자격증
        </Typography>
        <Grid container spacing={3}>
          {certifications.map((certification) => (
            <Grid item xs={12} sm={6} md={4} key={certification.name}>
              <Button
                fullWidth
                onClick={() => handleCertificationSelect(certification)}
                sx={{
                  height: '120px',
                  borderRadius: '16px',
                  background: `linear-gradient(45deg, ${certification.color} 30%, ${certification.color}99 90%)`,
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 10px 20px ${certification.color}40`,
                  }
                }}
              >
                {certification.name}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* 직접 입력 다이얼로그 */}
        <Dialog
          open={showCustomInputDialog}
          onClose={() => setShowCustomInputDialog(false)}
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
            직접 입력
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="학습 주제 입력"
              type="text"
              fullWidth
              variant="outlined"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ flexDirection: 'column', gap: 2, p: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleCustomInput}
              disabled={!customInput.trim()}
              sx={{
                borderRadius: '50px',
                py: 1.5,
                background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              확인
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowCustomInputDialog(false)}
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
              취소
            </Button>
          </DialogActions>
        </Dialog>

        {/* 안내 다이얼로그 */}
        <Dialog
          open={showInfoDialog}
          onClose={() => setShowInfoDialog(false)}
          PaperProps={{
            sx: {
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
            }
          }}
        >
          <DialogTitle color="primary.main">
            {selectedItem?.name} 학습 안내
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="text.secondary" paragraph>
              {selectedItem?.name}에 대한 학습을 시작하시겠습니까?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              선택하신 주제에 대한 맞춤형 학습 콘텐츠가 제공됩니다.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowInfoDialog(false)}>취소</Button>
            <Button 
              onClick={handleStartLearning}
              variant="contained"
              sx={{
                background: `linear-gradient(45deg, ${selectedItem?.color} 30%, ${selectedItem?.color}99 90%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${selectedItem?.color}99 30%, ${selectedItem?.color} 90%)`,
                }
              }}
            >
              학습 시작하기
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={handleStartLearning}
            disabled={!selectedItem || isLoading}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              '학습 시작하기'
            )}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Learning;