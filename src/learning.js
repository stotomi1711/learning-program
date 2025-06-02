import React, { useState, useEffect } from 'react';
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
  Chip,
} from '@mui/material';
import { useUser } from './contexts/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';

function Learning() {
  const { user } = useUser();
  const location = useLocation();
  const { category, lastQuestion } = location.state || {};
  const [selectedItem, setSelectedItem] = useState(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showCustomInputDialog, setShowCustomInputDialog] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [generatedQuestion, setGeneratedQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('초급');
  const [feedback, setFeedback] = useState(null);
  const [output, setOutput] = useState('');
  const [isLoadingCompile, setIsLoadingCompile] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const navigate = useNavigate();
  

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

  const difficulties = [
    { level: '초급', color: '#4CAF50' },
    { level: '중급', color: '#FF9800' },
    { level: '상급', color: '#F44336' }
  ];

  const languageMap = {
    python: 71,
    javascript: 63,
    java: 62,
    c: 50,
    cpp: 54,
    // 필요한 언어 추가
  };

  const getMonacoLanguage = (name) => {
    switch (name.toLowerCase()) {
      case 'python': return 'python';
      case 'c': return 'c';
      case 'c++': return 'cpp';
      case 'c#': return 'csharp';
      case 'java': return 'java';
      case 'javascript': return 'javascript';
      case 'php': return 'php';
      default: return 'plaintext';
    }
  };

  useEffect(() => {
    // 이전 학습 기록이 있는 경우 해당 문제를 표시
    if (lastQuestion) {
      setGeneratedQuestion(lastQuestion.question);
      setSelectedItem({ name: lastQuestion.keyword, color: '#2196F3' });
      setSelectedDifficulty(lastQuestion.difficulty || '초급');
      
      // 답변과 피드백이 있는 경우에만 설정
      if (lastQuestion.answer && lastQuestion.answer !== "답변을 기다리는 중입니다.") {
        setUserAnswer(lastQuestion.answer);
      } else {
        setUserAnswer(''); // 답변하지 않은 경우 빈 문자열로 설정
      }
      
      if (lastQuestion.feedback && lastQuestion.feedback !== "피드백을 기다리는 중입니다.") {
        setFeedback(lastQuestion.feedback);
      } else {
        setFeedback(null); // 피드백이 없는 경우 null로 설정
      }
    }
  }, [lastQuestion]);

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
    setShowLoadingDialog(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: selectedItem.name,
          userId: user?.userId || null,
          difficulty: selectedDifficulty
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
      setShowLoadingDialog(false);
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

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('답변을 입력해주세요.');
      return;
    }

  setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.userId || null,
          keyword: selectedItem?.name,
          question: generatedQuestion,
          answer: userAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error('답변 제출에 실패했습니다.');
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error:', error);
      alert(`답변 제출 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    setIsLoading(true);
    setShowLoadingDialog(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: selectedItem.name,
          userId: user?.userId || null,
          difficulty: selectedDifficulty
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
      setUserAnswer('');
      setCodeAnswer('');
      setFeedback(null);
      setOutput('');
    } catch (error) {
      console.error('Error:', error);
      alert(`문제 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowLoadingDialog(false);
    }
  };

  const handleCompileCode = async () => {
    if (!codeAnswer.trim()) {
      alert('코드를 입력해주세요.');
      return;
    }
    setIsLoadingCompile(true);
    const languageId = languageMap[selectedItem.name.toLowerCase()];
    if (!languageId) {
      alert('지원하지 않는 언어입니다.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/compile-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeAnswer,
          languageId: languageId,
        }),
      });

      if (!response.ok) throw new Error('코드 실행에 실패했습니다.');

      const data = await response.json();
      setOutput(data.output || ''); 
    } catch (error) {
      alert(`컴파일 중 오류: ${error.message}`);
    } finally {
      setIsLoadingCompile(false);
    }
  };

  const handleBack = () => {
    if (!user) {
      setShowConfirmDialog(true);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmBack = () => {
    setShowConfirmDialog(false);
    setGeneratedQuestion(null);
    navigate('/');
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
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              gap: 2
            }}>
              <Chip
                label={selectedItem?.name}
                sx={{
                  backgroundColor: selectedItem?.color,
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  padding: '20px 10px'
                }}
              />
              <Chip
                label={selectedDifficulty}
                sx={{
                  backgroundColor: difficulties.find(d => d.level === selectedDifficulty)?.color,
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
                학습 문제
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
                components={{
                  code: ({node, inline, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <Box sx={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        p: 2,
                        mb: 2,
                        overflowX: 'auto'
                      }}>
                        <Typography
                          component="pre"
                          sx={{
                            color: '#fff',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            margin: 0,
                            whiteSpace: 'pre-wrap'
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </Typography>
                      </Box>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {generatedQuestion}
              </ReactMarkdown>
            </Box>

            <Box sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                  코드 입력 및 실행 - {selectedItem.name}
                </Typography>

                <Editor
                  height="300px"
                  language={getMonacoLanguage(selectedItem.name)}
                  value={codeAnswer}
                  onChange={(val) => setCodeAnswer(val || '')}
                  theme="vs-dark"
                  options={{ minimap: { enabled: false }, fontSize: 14 }}
                />

                <Button
                  variant="contained"
                  onClick={handleCompileCode}
                  sx={{ mt: 2 }}
                  disabled={isLoadingCompile}
                >
                  {isLoadingCompile ? <CircularProgress size={20} /> : '컴파일 시작'}
                </Button>

                {output && (
                  <Box sx={{ mt: 3, whiteSpace: 'pre-wrap', fontFamily: 'monospace', bgcolor: '#000', color: '#0f0', p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1">실행 결과</Typography>
                    <div>{output}</div>
                  </Box>
                )}
            </Box>

            <Box sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                  답변 작성
                </Typography>
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="여기에 답변을 작성해주세요..."
                  variant="outlined"
                  disabled={!!feedback}
                  sx={{
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
                      '&.Mui-disabled': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'primary.main',
                    },
                    '& .MuiInputLabel-root.Mui-disabled': {
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                />
            </Box>

            {feedback && (
              <Box sx={{ 
                p: 3,
                mb: 4,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.1) 0%, rgba(0, 150, 199, 0.1) 100%)',
                border: '1px solid rgba(0, 180, 216, 0.2)',
                boxShadow: '0 4px 20px rgba(0, 180, 216, 0.1)'
              }}>
                <Typography variant="h6" sx={{ 
                  color: 'primary.main', 
                  mb: 2,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <span role="img" aria-label="feedback">💡</span> 피드백
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#fff', 
                  whiteSpace: 'pre-line',
                  lineHeight: 1.8,
                  fontSize: '1.05rem'
                }}>
                  {feedback}
                </Typography>
              </Box>
            )}

            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              justifyContent: 'center'
            }}>
              {!feedback ? (
                <Button
                  variant="contained"
                  onClick={handleSubmitAnswer}
                  disabled={isLoading}
                  sx={{
                    background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    minWidth: '200px',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 5px 15px rgba(0, 180, 216, 0.3)',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(255, 255, 255, 0.12)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      제출 중...
                    </Box>
                  ) : '답변 제출'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNextQuestion}
                  disabled={isLoading}
                  sx={{
                    background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    minWidth: '200px',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #45a049 30%, #4CAF50 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 5px 15px rgba(76, 175, 80, 0.3)',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(255, 255, 255, 0.12)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      문제 생성 중...
                    </Box>
                  ) : '다음 문제'}
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={handleBack}
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
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                돌아가기
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* 확인 다이얼로그 */}
        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          PaperProps={{
            sx: {
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '90%',
            }
          }}
        >
          <DialogTitle sx={{ 
            color: 'primary.main',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            py: 2
          }}>
            학습 중단 확인
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ 
              color: '#fff', 
              textAlign: 'center',
              py: 2,
              lineHeight: 1.6
            }}>
              {!user ? '비로그인 상태에서는 학습 내용이 저장되지 않습니다. 지금까지의 학습을 중단하시겠습니까?' : '지금까지의 학습 내용은 저장되어 학습기록에서 확인하실수 있습니다. 학습을 중단하시겠습니까?'}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
            <Button 
              onClick={() => setShowConfirmDialog(false)}
              variant="outlined"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.23)',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '20px',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(0, 180, 216, 0.1)',
                },
              }}
            >
              취소
            </Button>
            <Button 
              onClick={handleConfirmBack}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
                }
              }}
            >
              확인
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
              문제 생성 중...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              잠시만 기다려주세요.
            </Typography>
          </DialogContent>
        </Dialog>
      </Container>
    );
  }

  // isLoading일 때 전체 화면 로딩 UI
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
          문제 생성 중...
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
            학습 키워드 선택
          </Typography>
        </Box>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          학습하고 싶은 키워드를 선택해주세요.
        </Typography>

        {/* 카테고리에 따라 분기 */}
        {category === '프로그래밍 언어' && (
          <>
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
          </>
        )}
        {category === '자격증' && (
          <>
            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: 'primary.main' }}>
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
          </>
        )}
        {!category && (
          <>
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
          </>
        )}

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
              minWidth: '400px',
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              선택하신 주제에 대한 맞춤형 학습 콘텐츠가 제공됩니다.
            </Typography>

            <Typography variant="subtitle1" color="primary.main" sx={{ mb: 2 }}>
              난이도를 선택해주세요
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty.level}
                  variant={selectedDifficulty === difficulty.level ? "contained" : "outlined"}
                  onClick={() => setSelectedDifficulty(difficulty.level)}
                  sx={{
                    flex: 1,
                    background: selectedDifficulty === difficulty.level 
                      ? `linear-gradient(45deg, ${difficulty.color} 30%, ${difficulty.color}99 90%)`
                      : 'transparent',
                    color: selectedDifficulty === difficulty.level ? '#fff' : difficulty.color,
                    borderColor: difficulty.color,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    '&:hover': {
                      background: `linear-gradient(45deg, ${difficulty.color}99 30%, ${difficulty.color} 90%)`,
                      borderColor: difficulty.color,
                    }
                  }}
                >
                  {difficulty.level}
                </Button>
              ))}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
            <Button 
              onClick={() => setShowInfoDialog(false)}
              variant="outlined"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.23)',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '20px',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(0, 180, 216, 0.1)',
                },
              }}
            >
              취소
            </Button>
            <Button 
              onClick={handleStartLearning}
              variant="contained"
              sx={{
                background: `linear-gradient(45deg, ${selectedItem?.color} 30%, ${selectedItem?.color}99 90%)`,
                color: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                '&:hover': {
                  background: `linear-gradient(45deg, ${selectedItem?.color}99 30%, ${selectedItem?.color} 90%)`,
                }
              }}
            >
              학습 시작하기
            </Button>
          </DialogActions>
        </Dialog>

        
      </Container>
    </Box>
  );
}

export default Learning;