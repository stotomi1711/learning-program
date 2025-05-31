import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import { useUser } from './contexts/UserContext';

function Profile() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    navigate('/login');
    return null;
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
            회원정보
          </Typography>
        </Box>

        <Card sx={{ 
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
        }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary.main" gutterBottom>
                  기본 정보
                </Typography>
                <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  아이디
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {user.userId}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  닉네임
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {user.nickname}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  이메일
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {user.email}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    sx={{
                      borderRadius: '50px',
                      py: 1.5,
                      px: 4,
                      borderColor: 'rgba(96, 165, 250, 0.5)',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                      }
                    }}
                  >
                    홈으로
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Profile; 