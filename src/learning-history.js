import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useUser } from './contexts/UserContext';

const API_URL = 'http://localhost:5000/api';

function LearningHistory() {
  const navigate = useNavigate();
  const [learningHistory, setLearningHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user && user.userId) {
      fetchLearningHistory(user.userId); // userId가 있을 때만 호출
    } else {
      setError("로그인된 사용자가 없습니다.");
    }
  }, [user]); // user 정보가 변경될 때마다 실행

  const fetchLearningHistory = async (userId) => {
    console.log('Fetching learning history for userId:', userId);
    try {
      const response = await fetch(`${API_URL}/learning-history?userId=${userId}`);
      if (!response.ok) {
        throw new Error('학습 기록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setLearningHistory(data); // 학습 기록 상태 업데이트
    } catch (error) {
      console.error(error);
      setError("학습 기록 조회 중 오류가 발생했습니다.");
    }
  };
  

  const getSubjectColor = (subject) => {
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
    return colors[subject] || '#2196F3';
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
          학습 기록
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            mb: 4,
          }}
        >
          지금까지의 학습 기록을 확인해보세요
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#fff' }} />
        </Box>
      ) : error ? (
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
            {error}
          </Typography>
        </Box>
      ) : !learningHistory || learningHistory.length === 0 ? (
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
            아직 학습 기록이 없습니다
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {learningHistory.map((record) => (
            <Grid item xs={12} key={record._id || record.id || Math.random()}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    >
                      {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '날짜 없음'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={record.keyword || '주제 없음'}
                        sx={{
                          backgroundColor: getSubjectColor(record.keyword),
                          color: '#fff',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#fff',
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  >
                    {record.question || '질문 없음'}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      whiteSpace: 'pre-line',
                      mb: 2,
                    }}
                  >
                    {record.answer || '답변 없음'}
                  </Typography>
                  {record.feedback && (
                    <Box sx={{ mt: 2, p: 2, background: 'rgba(0, 180, 216, 0.1)', borderRadius: '8px' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#fff',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {record.feedback}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
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

export default LearningHistory; 