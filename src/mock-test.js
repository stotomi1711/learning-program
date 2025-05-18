import React, { useState, useEffect, useCallback } from 'react';
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
  CircularProgress,
  Chip,
} from '@mui/material';

function MockTest() {
  const [openStartDialog, setOpenStartDialog] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0); // 남은 시간 (초)
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const handleTestComplete = useCallback(() => {
    setIsLoading(true);
    
    // 결과 계산
    const correctAnswers = userAnswers.filter((answer, index) => {
      const correctAnswer = testQuestions[index].correctAnswer;
      return answer === ['A', 'B', 'C', 'D'].indexOf(correctAnswer);
    }).length;

    const totalQuestions = testQuestions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    const results = {
      score,
      correctAnswers,
      totalQuestions,
      timeUsed: 3600 - timeLeft, // 사용한 시간 (초)
      answers: userAnswers.map((answer, index) => ({
        question: testQuestions[index].question,
        userAnswer: answer !== null ? ['A', 'B', 'C', 'D'][answer] : '미답변',
        correctAnswer: testQuestions[index].correctAnswer,
        isCorrect: answer === ['A', 'B', 'C', 'D'].indexOf(testQuestions[index].correctAnswer)
      }))
    };

    setTestResults(results);
    setShowResults(true);
    setIsLoading(false);
  }, [userAnswers, testQuestions, timeLeft]);

  // 타이머 효과
  useEffect(() => {
    let timer;
    if (isTestStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestStarted, timeLeft, handleTestComplete]);

  // 시간 포맷팅 함수
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const mockTests = [
    {
      id: 1,
      title: '초급 테스트',
      description: '기본적인 개념과 문제 해결 능력을 평가하는 테스트입니다.',
      duration: '60분',
      questions: 10,
      difficulty: '초급',
      color: '#4CAF50',
    },
    {
      id: 2,
      title: '중급 테스트',
      description: '기초 개념을 바탕으로 문제 해결력과 사고력을 심화하여 평가하는 중급 단계의 테스트입니다.',
      duration: '60분',
      questions: 10,
      difficulty: '중급',
      color: '#FF9800',
    },
    {
      id: 3,
      title: '심화 테스트',
      description: '심화된 개념과 복잡한 문제 해결 능력을 평가하는 테스트입니다.',
      duration: '60분',
      questions: 10,
      difficulty: '고급',
      color: '#F44336',
    },
    {
      id: 4,
      title: '종합 테스트',
      description: '기초 개념부터 고급 응용까지 전 범위의 내용을 아우르는 종합 테스트입니다.',
      duration: '60분',
      questions: 10,
      difficulty: '초급,중급,고급',
      color: '#2196F3',
    },
  ];

  const handleStartTest = (test) => {
    setCurrentTest(test);
    setOpenStartDialog(true);
  };

  const handleConfirmStart = async () => {
    setOpenStartDialog(false);
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-test-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty: currentTest.difficulty,
          count: currentTest.questions
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '테스트 문제 생성에 실패했습니다.');
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error('생성된 문제가 없습니다.');
      }

      setTestQuestions(data.questions);
      setIsTestStarted(true);
      setUserAnswers(new Array(data.questions.length).fill(null));
      // 시간 설정 (60분 = 3600초)
      setTimeLeft(3600);
    } catch (error) {
      console.error('Error:', error);
      alert(`테스트 문제 생성 중 오류가 발생했습니다: ${error.message}`);
      setIsTestStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = (answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);

    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleTestComplete();
    }
  };

  if (showResults && testResults) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                color: 'primary.main',
                fontWeight: 'bold',
                mb: 2
              }}>
                테스트 결과
              </Typography>
              
              <Box sx={{
                display: 'inline-block',
                position: 'relative',
                mb: 3
              }}>
                <CircularProgress
                  variant="determinate"
                  value={testResults.score}
                  size={120}
                  thickness={4}
                  sx={{
                    color: testResults.score >= 70 ? '#4CAF50' : 
                           testResults.score >= 40 ? '#FF9800' : '#F44336'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" sx={{ 
                    color: '#fff',
                    fontWeight: 'bold'
                  }}>
                    {testResults.score}%
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Box sx={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    p: 2,
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      정답 수
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      color: 'primary.main',
                      fontWeight: 'bold'
                    }}>
                      {testResults.correctAnswers}/{testResults.totalQuestions}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    p: 2,
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                      소요 시간
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      color: 'primary.main',
                      fontWeight: 'bold'
                    }}>
                      {Math.floor(testResults.timeUsed / 60)}분 {testResults.timeUsed % 60}초
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h5" sx={{ 
                color: '#fff',
                mb: 2,
                textAlign: 'left'
              }}>
                문제별 결과
              </Typography>

              <Box sx={{ 
                maxHeight: '400px',
                overflowY: 'auto',
                mb: 3
              }}>
                {testResults.answers.map((result, index) => (
                  <Box
                    key={index}
                    sx={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      p: 2,
                      borderRadius: '12px',
                      mb: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <Typography variant="body1" sx={{ 
                      color: '#fff',
                      mb: 1
                    }}>
                      {index + 1}. {result.question}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Chip
                        label={`내 답변: ${result.userAnswer}`}
                        color={result.isCorrect ? "success" : "error"}
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Chip
                        label={`정답: ${result.correctAnswer}`}
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>

              <Button
                variant="contained"
                onClick={() => {
                  setShowResults(false);
                  setIsTestStarted(false);
                  setCurrentQuestion(0);
                  setUserAnswers([]);
                  setTestQuestions([]);
                  setTimeLeft(0);
                }}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: '#fff',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                  },
                }}
              >
                테스트 목록으로 돌아가기
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (isTestStarted) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 4 }}>
            {isLoading ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '300px',
                gap: 2
              }}>
                <CircularProgress sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ color: '#fff' }}>
                  {currentQuestion === testQuestions.length - 1 ? '결과 처리 중...' : '문제 생성 중...'}
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  gap: 2
                }}>
                  <Chip
                    label={currentTest?.title}
                    sx={{
                      backgroundColor: currentTest?.color,
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      padding: '20px 10px'
                    }}
                  />
                  <Typography variant="h5" component="h2" sx={{ 
                    color: '#fff',
                    fontWeight: 'bold',
                    flex: 1
                  }}>
                    문제 {currentQuestion + 1}/{testQuestions.length}
                  </Typography>
                  <Box sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Typography variant="h6" sx={{ 
                      color: timeLeft <= 300 ? '#ff4444' : '#fff',
                      fontWeight: 'bold',
                      fontFamily: 'monospace'
                    }}>
                      {formatTime(timeLeft)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  p: 3,
                  mb: 4,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <Typography variant="body1" sx={{ 
                    color: '#fff', 
                    whiteSpace: 'pre-line', 
                    fontSize: '1.1rem',
                    lineHeight: 1.6
                  }}>
                    {testQuestions[currentQuestion].question}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {testQuestions[currentQuestion].options.map((option, index) => (
                    <Grid item xs={12} key={index}>
                      <Button
                        fullWidth
                        variant={userAnswers[currentQuestion] === index ? "contained" : "outlined"}
                        onClick={() => handleAnswerSubmit(index)}
                        sx={{
                          padding: '16px',
                          borderRadius: '12px',
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                          color: '#fff',
                          textAlign: 'left',
                          justifyContent: 'flex-start',
                          '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'rgba(0, 180, 216, 0.1)',
                          },
                          ...(userAnswers[currentQuestion] === index && {
                            backgroundColor: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            }
                          })
                        }}
                      >
                        {option}
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  justifyContent: 'center',
                  mt: 4
                }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsTestStarted(false);
                      setCurrentQuestion(0);
                      setUserAnswers([]);
                      setTestQuestions([]);
                    }}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                      color: '#fff',
                      padding: '12px 30px',
                      borderRadius: '25px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      minWidth: '150px',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(0, 180, 216, 0.1)',
                      },
                    }}
                  >
                    테스트 중단
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    );
  }

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
                      background: `linear-gradient(45deg, ${test.color} 30%, ${test.color}99 90%)`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${test.color}99 30%, ${test.color} 90%)`,
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
            <Typography sx={{ mb: 2, color: '#fff' }}>
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
                background: `linear-gradient(45deg, ${currentTest?.color} 30%, ${currentTest?.color}99 90%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${currentTest?.color}99 30%, ${currentTest?.color} 90%)`,
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