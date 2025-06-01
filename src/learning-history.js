import React, { useState, useEffect, useCallback } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, School as SchoolIcon, Timeline as TimelineIcon } from '@mui/icons-material';
import { useUser } from './contexts/UserContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API_URL = 'http://localhost:5000/api';

function LearningHistory() {
  const navigate = useNavigate();
  const [learningHistory, setLearningHistory] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null); // null, 'learning', 'test'
  const { user } = useUser();

  const fetchLearningHistory = useCallback(async (profileId) => {
    if (!user?.userId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/learning-history?userId=${user.userId}&profileId=${profileId}`);
      if (!response.ok) {
        throw new Error('학습 기록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setLearningHistory(data);
    } catch (error) {
      console.error(error);
      setError("학습 기록 조회 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchTestHistory = useCallback(async () => {
    if (!user?.userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/test-history?userId=${user.userId}`);
      if (!response.ok) {
        throw new Error('테스트 기록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      console.log('Fetched test history:', data);
      setTestHistory(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchTestHistory();
  }, [fetchTestHistory]);


  const fetchProfiles = useCallback(async () => {
    if (!user?.userId) return;

    try {
      const response = await fetch(`${API_URL}/profiles?userId=${user.userId}`);
      if (!response.ok) {
        throw new Error('프로필 목록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setProfiles(data);
      if (data.length > 0) {
        setSelectedProfile(data[0]._id);
      }
    } catch (error) {
      console.error('프로필 목록 조회 중 오류:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user?.userId) {
      fetchProfiles();
    } else {
      setError("로그인된 사용자가 없습니다.");
    }
  }, [user, fetchProfiles]);

  const handleProfileChange = useCallback((profileId) => {
    setSelectedProfile(profileId);
    if (selectedMode === 'learning') {
      fetchLearningHistory(profileId);
    } else if (selectedMode === 'test') {
      fetchTestHistory();
    }
  }, [selectedMode, fetchLearningHistory, fetchTestHistory]);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    if (selectedProfile) {
      if (mode === 'learning') {
        fetchLearningHistory(selectedProfile);
      } else if (mode === 'test') {
        fetchTestHistory();
      }
    } else if (mode === 'test') {
      fetchTestHistory();
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

  const renderModeSelection = () => (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{
          color: '#fff',
          textAlign: 'center',
          mb: 4,
        }}
      >
        어떤 기록을 확인하시겠습니까?
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={() => handleModeSelect('learning')}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
                background: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <TimelineIcon sx={{ fontSize: 60, color: '#00b4d8', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
                학습 기록
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                학습한 내용과 피드백을 확인하세요
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={() => handleModeSelect('test')}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
                background: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <SchoolIcon sx={{ fontSize: 60, color: '#00b4d8', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
                테스트 기록
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                테스트 결과와 피드백을 확인하세요
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

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

      {!user || !user.userId ? (
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
              mb: 3,
              textAlign: 'center',
            }}
          >
            로그인하지 않으면 이용하실 수 없습니다
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '20px',
              '&:hover': {
                background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
              }
            }}
          >
            로그인하기
          </Button>
        </Box>
      ) : !selectedMode ? (
        renderModeSelection()
      ) : (
        <>
          {!isLoading && !error && profiles.length > 0 && selectedMode === 'learning' && (
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <FormControl sx={{ minWidth: 200, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
                <InputLabel sx={{ color: '#fff' }}>프로필 선택</InputLabel>
                <Select
                  value={selectedProfile}
                  onChange={(e) => handleProfileChange(e.target.value)}
                  label="프로필 선택"
                  sx={{ color: '#fff' }}
                >
                  {profiles.map((profile) => (
                    <MenuItem key={profile._id} value={profile._id}>
                      {profile.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                onClick={() => setSelectedMode(null)}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                기록 종류 변경
              </Button>
            </Box>
          )}

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
          ) : selectedMode === 'learning' ? (
            !learningHistory || learningHistory.length === 0 ? (
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
                  선택한 프로필의 학습 기록이 없습니다
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {learningHistory.map((record) => {
                  const profile = profiles.find(p => p._id === record.profileId);
                  return (
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
                                label={profile ? profile.name : '기본 프로필'}
                                sx={{
                                  backgroundColor: profile ? profile.color || '#4CAF50' : '#4CAF50',
                                  color: '#fff',
                                  fontWeight: 'bold',
                                }}
                              />
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
                  );
                })}
              </Grid>
            )
          ) : (
            !testHistory || testHistory.length === 0 ? (
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
                  테스트 기록이 없습니다
                </Typography>
              </Box>
            ) : (
              (() => {
                const grouped = testHistory.reduce((acc, record) => {
                  const groupKey = `${record.keyword || '기타'} ${record.title || ''}`.trim();
                  acc[groupKey] = acc[groupKey] || [];
                  acc[groupKey].push(record);
                  return acc;
                }, {});
                return (
                  <Box>
                    {Object.entries(grouped).map(([group, records]) => (
                      <Accordion key={group} sx={{ mb: 2, background: 'rgba(255,255,255,0.05)' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ color: '#fff', fontWeight: 'bold' }}>
                          {group} ({records.length}회)
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            {records.map((record) => (
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
                                        sx={{ color: '#fff', fontWeight: 'bold' }}
                                      >
                                        {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '날짜 없음'}
                                      </Typography>
                                      <Chip
                                        label={`점수: ${record.score}점`}
                                        sx={{
                                          backgroundColor: record.score >= 60 ? '#4CAF50' : '#F44336',
                                          color: '#fff',
                                          fontWeight: 'bold',
                                        }}
                                      />
                                    </Box>
                                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                                      {record.title || '테스트 제목 없음'}
                                    </Typography>
                                    {record.answers && record.answers.length > 0 ? (
                                      record.answers.map((item, idx) => (
                                        <Box key={idx} sx={{ mb: 1 }}>
                                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>
                                            문제: {item.question || '문제 없음'}
                                          </Typography>
                                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                            내 답변: {item.answer || '답변 없음'}
                                          </Typography>
                                        </Box>
                                      ))
                                    ) : (
                                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        답변 정보가 없습니다.
                                      </Typography>
                                    )}
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                );
              })()
            )
          )}
        </>
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