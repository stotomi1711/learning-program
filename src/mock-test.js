import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MockTest() {
  const navigate = useNavigate();
  const [openStartDialog, setOpenStartDialog] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);

  const mockTests = [
    {
      id: 1,
      title: '기본 모의고사',
      description: '기본적인 개념과 문제 해결 능력을 평가하는 테스트입니다.',
      duration: '60분',
      questions: 30,
      difficulty: '중급',
    },
    {
      id: 2,
      title: '심화 모의고사',
      description: '심화된 개념과 복잡한 문제 해결 능력을 평가하는 테스트입니다.',
      duration: '90분',
      questions: 40,
      difficulty: '고급',
    },
  ];

  const handleStartTest = (test) => {
    setCurrentTest(test);
    setOpenStartDialog(true);
  };

  const handleConfirmStart = () => {
    setOpenStartDialog(false);
    // 여기에 실제 테스트 시작 로직 구현
    navigate(`/mock-test/${currentTest.id}`);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#000000',
      pt: 4,
      pb: 8,
    }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: 'primary.main',
            mb: 4,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          모의 테스트
        </Typography>

        <Grid container spacing={4}>
          {mockTests.map((test) => (
            <Grid item xs={12} md={6} key={test.id}>
              <Card
                sx={{
                  background: 'rgba(17, 24, 39, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0, 180, 216, 0.2)',
                    borderColor: 'rgba(0, 180, 216, 0.3)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="h2" sx={{ mb: 2, color: 'primary.main' }}>
                    {test.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {test.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      소요 시간: {test.duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      문제 수: {test.questions}문제
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      난이도: {test.difficulty}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleStartTest(test)}
                    sx={{
                      background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
                      },
                    }}
                  >
                    시작하기
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={openStartDialog}
          onClose={() => setOpenStartDialog(false)}
          PaperProps={{
            sx: {
              background: 'rgba(17, 24, 39, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <DialogTitle sx={{ color: 'primary.main' }}>
            테스트 시작
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              {currentTest?.title}를 시작하시겠습니까?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 소요 시간: {currentTest?.duration}
              <br />
              • 문제 수: {currentTest?.questions}문제
              <br />
              • 난이도: {currentTest?.difficulty}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
            <Button
              onClick={handleConfirmStart}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
                },
              }}
            >
              시작하기
            </Button>
            <Button
              onClick={() => setOpenStartDialog(false)}
              variant="outlined"
              sx={{
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(0, 180, 216, 0.1)',
                },
              }}
            >
              취소
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default MockTest; 