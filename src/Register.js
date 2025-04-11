import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { UserContext } from './contexts/UserContext';

function Register() {
  const navigate = useNavigate();
  const { register } = React.useContext(UserContext);
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  // 에러 상태
  const [errors, setErrors] = useState({
    userId: '',
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    submit: '',
  });

  // UI 상태
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 스타일 정의
  const textFieldStyles = {
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
    '& .MuiFormHelperText-root': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 에러 초기화
    setErrors(prev => ({
      ...prev,
      [name]: '',
      submit: ''
    }));
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // 아이디 검사
    if (!formData.userId) {
      newErrors.userId = '아이디를 입력해주세요.';
      isValid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.userId)) {
      newErrors.userId = '아이디는 영문과 숫자만 사용 가능합니다.';
      isValid = false;
    }

    // 이메일 검사
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
      isValid = false;
    }

    // 닉네임 검사
    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
      isValid = false;
    }

    // 비밀번호 검사
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자리 이상이어야 합니다.';
      isValid = false;
    }

    // 비밀번호 확인 검사
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, submit: '' }));

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.userId,
          password: formData.password,
          nickname: formData.nickname,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }

      // 회원가입 성공 시 사용자 정보 저장
      register({
        userId: formData.userId,
        nickname: data.nickname,
        email: data.email
      });
      
      // 성공 다이얼로그 표시
      setOpenSuccessDialog(true);
      
    } catch (err) {
      console.error('회원가입 오류:', err);
      setErrors(prev => ({
        ...prev,
        submit: err.message || '서버와의 통신 중 오류가 발생했습니다.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container maxWidth="sm">
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
            회원가입
          </Typography>

          {errors.submit && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {errors.submit}
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
            error={!!errors.userId}
            helperText={errors.userId || "영문과 숫자만 사용 가능합니다."}
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="이메일"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.email}
            helperText={errors.email || "이메일 형식으로 입력해주세요."}
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="닉네임"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.nickname}
            helperText={errors.nickname || "원하시는 닉네임을을 입력해주세요."}
            sx={textFieldStyles}
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
            error={!!errors.password}
            helperText={errors.password || "8자리 이상 입력해주세요."}
            sx={textFieldStyles}
          />

          <TextField
            fullWidth
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            sx={textFieldStyles}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
              },
              '&:disabled': {
                background: 'rgba(0, 180, 216, 0.5)',
              }
            }}
          >
            {isLoading ? '처리 중...' : '회원가입'}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            sx={{
              mt: 2,
              color: '#00b4d8',
              '&:hover': {
                backgroundColor: 'rgba(0, 180, 216, 0.1)',
              }
            }}
          >
            로그인
          </Button>
        </Box>
      </Container>

      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
        PaperProps={{
          sx: {
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#00b4d8' }}>
          회원가입 성공
        </DialogTitle>
        <DialogContent>
          <Typography>
            회원가입이 성공적으로 완료되었습니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button 
            onClick={() => navigate('/')}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
              }
            }}
          >
            홈페이지로 돌아가기
          </Button>
          <Button 
            onClick={() => navigate('/login')}
            variant="outlined"
            sx={{
              color: '#00b4d8',
              borderColor: '#00b4d8',
              '&:hover': {
                borderColor: '#00b4d8',
                backgroundColor: 'rgba(0, 180, 216, 0.1)',
              }
            }}
          >
            로그인하러 가기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Register; 