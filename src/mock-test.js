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
  TextField,
} from '@mui/material';
import { useUser } from './contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function MockTest() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [openStartDialog, setOpenStartDialog] = useState(false);
  const [openKeywordDialog, setOpenKeywordDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [customKeyword, setCustomKeyword] = useState('');
  const [currentTest, setCurrentTest] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0); // 남은 시간 (초)
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);

  const categories = [
    { 
      name: '프로그래밍 언어', 
      color: '#2196F3',
      description: '다양한 프로그래밍 언어에 대한 문제로 테스트를 해보세요.',
      keywords: [
        { name: 'Python', color: '#4CAF50' },
        { name: 'Java', color: '#FF5722' },
        { name: 'JavaScript', color: '#FFC107' },
        { name: 'C++', color: '#9C27B0' },
        { name: 'C#', color: '#673AB7' },
        { name: 'C', color: '#E91E63' },
        { name: 'HTML', color: '#FF9800' },
        { name: 'Swift', color: '#F44336' },
        { name: 'Kotlin', color: '#795548' },
        { name: 'TypeScript', color: '#2196F3' }
      ]
    },
    { 
      name: '자격증', 
      color: '#FF9800',
      description: '자격증 시험 준비를 위한 문제로 테스트를 해보세요.',
      keywords: [
        { name: '정보처리기사', color: '#4CAF50' },
        { name: '네트워크관리사', color: '#2196F3' },
        { name: '정보보안기사', color: '#F44336' },
        { name: 'SQLD', color: '#FF9800' },
        { name: '리눅스마스터', color: '#9C27B0' },
        { name: 'CCNA', color: '#00BCD4' },
        { name: 'AWS', color: '#FF5722' },
        { name: 'OCP', color: '#673AB7' }
      ]
    }
  ];

  const handleTestComplete = useCallback(() => {
    setIsLoading(true);
    
    // 주관식 문제 답변 평가를 위한 API 호출
    const evaluateSubjectiveAnswers = async () => {
      try {
        const subjectiveAnswers = userAnswers.map((answer, index) => {
          const question = testQuestions[index];
          if (!question.isObjective && answer !== null && answer.trim() !== '') {
            return {
              question: question.question,
              answer: answer,
              index: index
            };
          }
          return null;
        }).filter(item => item !== null);

        if (subjectiveAnswers.length > 0) {
          const response = await fetch('http://localhost:5000/api/evaluate-subjective-answers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              answers: subjectiveAnswers
            }),
          });

          if (!response.ok) {
            throw new Error('주관식 답변 평가에 실패했습니다.');
          }

          const evaluationResults = await response.json();
          
          // 평가 결과를 기존 답변에 반영
          const updatedAnswers = userAnswers.map((answer, index) => {
            const question = testQuestions[index];
            if (!question.isObjective && answer !== null && answer.trim() !== '') {
              const evaluation = evaluationResults.find(e => e.index === index);
              if (evaluation) {
                return {
                  text: answer,
                  isCorrect: evaluation.isCorrect,
                  feedback: evaluation.feedback
                };
              }
            }
            return answer;
          });

          setUserAnswers(updatedAnswers);

          // 결과 계산
          const correctAnswers = updatedAnswers.filter((answer, index) => {
            const question = testQuestions[index];
            if (question.isObjective) {
              return question.options[answer] === question.correctAnswer;
            } else {
              return answer && answer.isCorrect;
            }
          }).length;

          const totalQuestions = testQuestions.length;
          const score = Math.round((correctAnswers / totalQuestions) * 100);

          const results = {
            score,
            correctAnswers,
            totalQuestions,
            timeUsed: 3600 - timeLeft,
            answers: updatedAnswers.map((answer, index) => {
              const question = testQuestions[index];
              return {
                question: question.question,
                userAnswer: question.isObjective 
                  ? (answer !== null ? ['A', 'B', 'C', 'D'][answer] : '미답변')
                  : (answer && answer.text ? answer.text : '미답변'),
                correctAnswer: question.correctAnswer,
                isCorrect: question.isObjective
                  ? question.options[answer] === question.correctAnswer
                  : (answer && answer.isCorrect)
              };
            })
          };

          setTestResults(results);
          setShowResults(true);
        }
      } catch (error) {
        console.error('주관식 답변 평가 중 오류:', error);
        alert('주관식 답변 평가 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    evaluateSubjectiveAnswers();
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
    setCustomKeyword(''); // 키워드 초기화
    setSelectedCategory(null); // 카테고리 초기화
    setOpenCategoryDialog(true);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setOpenCategoryDialog(false);
    setOpenKeywordDialog(true);
  };

  const handleKeywordSelect = (keyword) => {
    setCustomKeyword(keyword);
    setOpenKeywordDialog(false);
    setOpenStartDialog(true);
  };

  const handleDirectInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      setOpenKeywordDialog(false);
      setOpenStartDialog(true);
    }
  };

  const handleConfirmStart = async () => {
    setOpenStartDialog(false);
    setIsLoading(true);
    setShowLoadingDialog(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-test-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty: currentTest.difficulty,
          count: currentTest.questions,
          userId: user?.userId || null,
          keyword: customKeyword.trim(),
          category: selectedCategory.name
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
      setTimeLeft(3600); // 60분
      // 테스트 시작 상태 App에 알림
      window.dispatchEvent(new CustomEvent('updateLearningState', { detail: { isTesting: true } }));
    } catch (error) {
      console.error('Error:', error);
      alert(`테스트 문제 생성 중 오류가 발생했습니다: ${error.message}`);
      setIsTestStarted(false);
    } finally {
      setIsLoading(false);
      setShowLoadingDialog(false);
    }
  };

  const handleAnswerSubmit = (answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);

    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 마지막 문제인 경우 바로 결과 처리
      handleTestComplete();
    }
  };

  // 주관식 답변 제출 핸들러 추가
  const handleSubjectiveAnswerSubmit = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  // 다음 문제로 넘어가는 핸들러 추가
  const handleNextQuestion = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 마지막 문제인 경우 바로 결과 처리
      handleTestComplete();
    }
  };

  // 테스트 목록으로 돌아가기 버튼 클릭 시 모든 상태 초기화
  const handleBackToList = () => {
    setShowResults(false);
    setIsTestStarted(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setTestQuestions([]);
    setTimeLeft(0);
    setCustomKeyword(''); // 키워드 초기화
    setSelectedCategory(null); // 카테고리 초기화
    setCurrentTest(null); // 현재 테스트 초기화
    navigate('/mock-test');
  };

  // 페이지 이동 시 경고 메시지 표시
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isTestStarted && !showResults) {
        e.preventDefault();
        e.returnValue = '테스트가 진행 중입니다. 정말로 나가시겠습니까?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTestStarted, showResults]);

  if (isLoading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
        }}
      >
        <CircularProgress 
          size={80} 
          sx={{ 
            color: 'primary.main',
            mb: 3
          }} 
        />
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#fff',
            textAlign: 'center',
            mb: 2
          }}
        >
          {currentQuestion === testQuestions.length - 1 ? '결과 처리 중...' : '문제 생성 중...'}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center'
          }}
        >
          잠시만 기다려주세요
        </Typography>
      </Box>
    );
  }

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
                        label={result.isCorrect ? "정답" : "오답"}
                        color={result.isCorrect ? "success" : "error"}
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          padding: '8px 16px'
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>

              <Button
                variant="contained"
                onClick={handleBackToList}
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
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 4
            }}>
              <Typography variant="h5" sx={{ color: '#fff' }}>
                문제 {currentQuestion + 1}/{testQuestions.length}
              </Typography>
              <Typography variant="h5" sx={{ color: '#fff' }}>
                남은 시간: {formatTime(timeLeft)}
              </Typography>
            </Box>

            <Box sx={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              p: 3,
              mb: 4,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <ReactMarkdown
                children={testQuestions[currentQuestion].question}
                components={{
                  code({node, inline, className, children, ...props}) {
                    return !inline ? (
                      <pre style={{ background: '#222', color: '#fff', padding: '10px', borderRadius: '8px', overflowX: 'auto' }}>
                        <code>{children}</code>
                      </pre>
                    ) : (
                      <code style={{ background: '#eee', borderRadius: '4px', padding: '2px 4px' }}>{children}</code>
                    );
                  }
                }}
              />
            </Box>

            {testQuestions[currentQuestion].isObjective ? (
              // 객관식 문제 UI
              <Grid container spacing={2}>
                {['A', 'B', 'C', 'D'].map((option, index) => (
                  <Grid item xs={12} key={option}>
                    <Button
                      fullWidth
                      variant={userAnswers[currentQuestion] === index ? "contained" : "outlined"}
                      onClick={() => handleAnswerSubmit(index)}
                      sx={{
                        justifyContent: 'flex-start',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: '#fff',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        },
                        '&.MuiButton-contained': {
                          backgroundColor: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        },
                      }}
                    >
                      <Typography sx={{ fontWeight: 'bold', mr: 2 }}>{option}.</Typography>
                      <Typography>{testQuestions[currentQuestion].options[index]}</Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            ) : (
              // 주관식 문제 UI
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={userAnswers[currentQuestion] || ''}
                  onChange={(e) => handleSubjectiveAnswerSubmit(e.target.value)}
                  placeholder="답변을 입력해주세요"
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
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
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleNextQuestion}
                  sx={{
                    background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 5px 15px rgba(0, 180, 216, 0.3)',
                    },
                  }}
                >
                  다음 문제
                </Button>
              </Box>
            )}
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
            테스트 선택
          </Typography>
        </Box>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          원하는 테스트를 선택해주세요.
        </Typography>

        <Grid container spacing={3}>
          {mockTests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
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
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 3
                }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={test.difficulty}
                      sx={{
                        backgroundColor: test.color,
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        padding: '8px 16px'
                      }}
                    />
                  </Box>
                  <Typography variant="h5" component="h2" sx={{ 
                    color: '#fff',
                    fontWeight: 'bold',
                    mb: 2
                  }}>
                    {test.title}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 3,
                    flexGrow: 1
                  }}>
                    {test.description}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      소요 시간: {test.duration}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      문제 수: {test.questions}문제
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleStartTest(test)}
                    sx={{
                      background: `linear-gradient(45deg, ${test.color} 30%, ${test.color}99 90%)`,
                      color: 'white',
                      padding: '12px 30px',
                      borderRadius: '25px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${test.color}99 30%, ${test.color} 90%)`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 5px 15px ${test.color}40`,
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
          open={openCategoryDialog}
          onClose={() => setOpenCategoryDialog(false)}
          PaperProps={{
            sx: {
              background: 'rgba(17, 24, 39, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
            },
          }}
        >
          <DialogTitle sx={{ 
            color: 'primary.main',
            textAlign: 'center',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            pt: 3
          }}>
            카테고리 선택
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography sx={{ 
              mb: 4, 
              color: '#fff',
              textAlign: 'center',
              fontSize: '1.1rem',
              opacity: 0.8
            }}>
              테스트할 카테고리를 선택해주세요
            </Typography>
            <Grid container spacing={2}>
              {categories.map((category) => (
                <Grid item xs={12} key={category.name}>
                  <Button
                    fullWidth
                    onClick={() => handleCategorySelect(category)}
                    sx={{
                      height: '100px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}99 100%)`,
                      color: 'white',
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      padding: '0 24px',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 8px 16px ${category.color}40`,
                        background: `linear-gradient(135deg, ${category.color} 0%, ${category.color} 100%)`,
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover::after': {
                        opacity: 1,
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      width: '100%',
                      gap: 0.5
                    }}>
                      <Typography sx={{ 
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px'
                      }}>
                        {category.name}
                      </Typography>
                      <Typography sx={{ 
                        fontSize: '0.9rem',
                        opacity: 0.9,
                        textAlign: 'left'
                      }}>
                        {category.description}
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center', 
            gap: 2, 
            pb: 3,
            pt: 1
          }}>
            <Button
              onClick={() => setOpenCategoryDialog(false)}
              variant="outlined"
              sx={{
                color: 'primary.main',
                borderColor: 'primary.main',
                borderRadius: '25px',
                px: 4,
                py: 1,
                fontSize: '1rem',
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

        <Dialog
          open={openKeywordDialog}
          onClose={() => setOpenKeywordDialog(false)}
          PaperProps={{
            sx: {
              background: 'rgba(17, 24, 39, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
            },
          }}
        >
          <DialogTitle sx={{ 
            color: 'primary.main',
            textAlign: 'center',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            pt: 3
          }}>
            키워드 선택
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography sx={{ 
              mb: 4, 
              color: '#fff',
              textAlign: 'center',
              fontSize: '1.1rem',
              opacity: 0.8
            }}>
              {selectedCategory?.name} 카테고리에서 학습할 키워드를 선택해주세요
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ 
                color: '#fff',
                fontSize: '1rem',
                mb: 2,
                opacity: 0.8
              }}>
                직접 입력하기
              </Typography>
              <TextField
                fullWidth
                placeholder="원하는 키워드를 입력하세요"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                onKeyPress={handleDirectInputKeyPress}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: selectedCategory?.color,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiInputBase-input': {
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            <Typography sx={{ 
              color: '#fff',
              fontSize: '1rem',
              mb: 2,
              opacity: 0.8
            }}>
              추천 키워드
            </Typography>
            <Grid container spacing={2}>
              {selectedCategory?.keywords.map((keyword) => (
                <Grid item xs={6} key={keyword.name}>
                  <Button
                    fullWidth
                    onClick={() => handleKeywordSelect(keyword.name)}
                    sx={{
                      height: '60px',
                      borderRadius: '16px',
                      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)`,
                      color: 'rgba(255, 255, 255, 0.8)',
                      textTransform: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: `0 8px 20px ${keyword.color}40`,
                        background: `linear-gradient(135deg, ${keyword.color} 0%, ${keyword.color}99 100%)`,
                        borderColor: 'transparent',
                        color: 'white',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(45deg, ${keyword.color}20 0%, transparent 100%)`,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover::before': {
                        opacity: 1,
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover::after': {
                        opacity: 1,
                      }
                    }}
                  >
                    <Typography sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.5px',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {keyword.name}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center', 
            gap: 2, 
            pb: 3,
            pt: 1
          }}>
            <Button
              onClick={() => setOpenKeywordDialog(false)}
              variant="outlined"
              sx={{
                color: 'primary.main',
                borderColor: 'primary.main',
                borderRadius: '25px',
                px: 4,
                py: 1,
                fontSize: '1rem',
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
              <br />
              • 카테고리: {selectedCategory?.name}
              <br />
              • 키워드: {customKeyword}
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

        {/* Loading Dialog */}
        <Dialog
          open={showLoadingDialog}
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
          <DialogContent sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
              테스트 문제 생성 중...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              잠시만 기다려주세요.
            </Typography>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}

export default MockTest; 