import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Chip,
} from '@mui/material';
import { Home, Lightbulb, AccessTime } from '@mui/icons-material';

function LearningHistory() {
  const [learningHistory] = useState([]);

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
            학습 기록
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 학습 기록 컨텐츠 */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card sx={{ 
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
              학습 기록
            </Typography>

            {learningHistory.length === 0 ? (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                아직 학습 기록이 없습니다.
              </Typography>
            ) : (
              <List>
                {learningHistory.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 2,
                        py: 3,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <ListItemIcon>
                          <Lightbulb sx={{ color: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                                {item.keyword}
                              </Typography>
                              <Chip
                                label={item.status === 'completed' ? '완료' : '진행 중'}
                                color={item.status === 'completed' ? 'success' : 'primary'}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {item.date} {item.time}
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>

                      <Paper sx={{ p: 2, width: '100%', background: 'rgba(15, 23, 42, 0.5)' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                          문제
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {item.question}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                          답변
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {item.userAnswer}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                          피드백
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {item.feedback}
                        </Typography>
                      </Paper>
                    </ListItem>
                    {index < learningHistory.length - 1 && <Divider sx={{ my: 2 }} />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

export default LearningHistory; 