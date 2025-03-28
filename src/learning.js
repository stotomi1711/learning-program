import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { Home, Refresh } from '@mui/icons-material';

function Learning() {
  const [keyword, setKeyword] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const generateQuestion = async () => {
    if (!keyword.trim()) return;
    
    // 이미 문제가 있고 피드백을 받지 않은 경우
    if (question && !showFeedback) {
      alert('현재 문제에 답변을 제출하고 피드백을 받은 후에 새로운 문제를 생성해주세요.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=AIzaSyC9PsJvz408SDMMNWMSpHUJXYXLT8RWqvc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `다음 키워드에 대한 학습 문제를 생성해주세요. 문제와 정답을 명확하게 구분해서 작성해주세요.\n\n키워드: ${keyword}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || 'API 호출 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }

      const generatedContent = data.candidates[0].content.parts[0].text;
      
      // 문제와 정답 분리 로직 개선
      let questionText = '';
      let answerText = '';

      // 다양한 구분자 시도
      const separators = ['\n\n정답:', '\n정답:', '정답:', '답:', '\n답:'];
      
      for (const separator of separators) {
        if (generatedContent.includes(separator)) {
          const parts = generatedContent.split(separator);
          questionText = parts[0].replace(/^문제:|^Q:|^질문:/, '').trim();
          answerText = parts[1].trim();
          break;
        }
      }

      // 구분자를 찾지 못한 경우
      if (!questionText || !answerText) {
        // 첫 번째 줄을 문제로, 나머지를 정답으로 처리
        const lines = generatedContent.split('\n').filter(line => line.trim());
        if (lines.length >= 2) {
          questionText = lines[0].replace(/^문제:|^Q:|^질문:/, '').trim();
          answerText = lines.slice(1).join('\n').trim();
        } else {
          throw new Error('문제와 정답을 분리할 수 없습니다.');
        }
      }

      setQuestion(questionText);
      setAnswer(answerText);
      setShowFeedback(false);
      setUserAnswer('');
      setFeedback('');
    } catch (error) {
      console.error('Error generating question:', error);
      setQuestion(`문제 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswer = async () => {
    if (!userAnswer.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=AIzaSyC9PsJvz408SDMMNWMSpHUJXYXLT8RWqvc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `문제: ${question}\n정답: ${answer}\n학생 답변: ${userAnswer}\n\n학생의 답변을 평가하고 피드백을 제공해주세요.`
            }]
          }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API 호출 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setFeedback(data.candidates[0].content.parts[0].text);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error checking answer:', error);
      setFeedback('답변 평가 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      position: 'relative',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      overflow: 'hidden',
    }}>
      {/* 우주 배경 */}
      <div className="space-background">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 네비게이션 바 */}
      <AppBar position="static" sx={{ 
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            onClick={() => window.location.href = '/'}
            sx={{ mr: 2 }}
          >
            <Home />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
            AI 학습 센터
          </Typography>
        </Toolbar>
      </AppBar>

      {/* AI 학습 컨텐츠 */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card sx={{ 
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <CardContent>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
              AI 학습
            </Typography>

            {/* 키워드 입력 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <TextField
                fullWidth
                label="학습하고 싶은 키워드를 입력하세요"
                variant="outlined"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={generateQuestion}
                disabled={isLoading || !keyword.trim()}
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
                  }
                }}
              >
                {isLoading ? <CircularProgress size={24} /> : '문제 생성'}
              </Button>
            </Box>

            {/* 문제 표시 */}
            {question && (
              <Paper sx={{ p: 3, mb: 4, background: 'rgba(15, 23, 42, 0.5)' }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  문제
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {question}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="답변을 입력하세요"
                  variant="outlined"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={checkAnswer}
                    disabled={isLoading || !userAnswer.trim()}
                    sx={{
                      borderRadius: '50px',
                      px: 4,
                      background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} /> : '답변 제출'}
                  </Button>
                </Box>
              </Paper>
            )}

            {/* 피드백 표시 */}
            {showFeedback && feedback && (
              <Paper sx={{ p: 3, background: 'rgba(15, 23, 42, 0.5)' }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  피드백
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {feedback}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    startIcon={<Refresh />}
                    onClick={() => {
                      setKeyword('');
                      setQuestion('');
                      setAnswer('');
                      setUserAnswer('');
                      setFeedback('');
                      setShowFeedback(false);
                    }}
                    sx={{
                      borderRadius: '50px',
                      px: 4,
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                      }
                    }}
                  >
                    새로운 문제
                  </Button>
                </Box>
              </Paper>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Learning; 