import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { UserContext } from './contexts/UserContext';

function Login() {
  const navigate = useNavigate();
  const { login } = React.useContext(UserContext);
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.userId,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        setOpenSuccessDialog(true);
      } else {
        setError(data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      setError('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  const handleSuccessDialogClose = () => {
    setOpenSuccessDialog(false);
    navigate('/');
  };

  return (
    <Box>
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(10px)',
            p: 4,
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              color: '#00b4d8',
              fontWeight: 'bold',
              mb: 4,
            }}
          >
            로그인
          </Typography>

          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            fullWidth
            label="아이디"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: '#00b4d8',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />

          <TextField
            fullWidth
            label="비밀번호"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: '#00b4d8',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
              }
            }}
          >
            로그인
          </Button>

          <Box sx={{ 
            mt: 3, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              계정이 없으신가요?
            </Typography>
            <Button
              variant="text"
              onClick={() => navigate('/register')}
              sx={{
                color: '#00b4d8',
                '&:hover': {
                  backgroundColor: 'rgba(0, 180, 216, 0.1)',
                }
              }}
            >
              회원가입하기
            </Button>
          </Box>
        </Box>
      </Container>

      {/* 로그인 성공 다이얼로그 */}
      <Dialog
        open={openSuccessDialog}
        onClose={handleSuccessDialogClose}
        PaperProps={{
          sx: {
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#00b4d8' }}>
          로그인 성공
        </DialogTitle>
        <DialogContent>
          <Typography>
            로그인이 성공적으로 완료되었습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleSuccessDialogClose}
            sx={{
              color: '#00b4d8',
              '&:hover': {
                backgroundColor: 'rgba(0, 180, 216, 0.1)',
              }
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Login; 