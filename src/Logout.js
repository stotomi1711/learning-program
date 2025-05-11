import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useUser } from './contexts/UserContext';

function Logout({ open, onClose }) {
  const navigate = useNavigate();
  const { logout } = useUser();
  const [openLogoutSuccessDialog, setOpenLogoutSuccessDialog] = useState(false);

  const handleLogout = () => {
    logout();
    onClose();
    // 약간의 지연 후 성공 다이얼로그 표시
    setTimeout(() => {
      setOpenLogoutSuccessDialog(true);
    }, 100);
  };

  const handleLogoutSuccessClose = () => {
    setOpenLogoutSuccessDialog(false);
    navigate('/');
  };

  return (
    <>
      {/* 로그아웃 확인 다이얼로그 */}
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#00b4d8' }}>
          로그아웃
        </DialogTitle>
        <DialogContent>
          <Typography>
            정말 로그아웃 하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #00b4d8 30%, #0096c7 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0096c7 30%, #00b4d8 90%)',
              }
            }}
          >
            로그아웃
          </Button>
          <Button
            onClick={onClose}
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
            취소
          </Button>
        </DialogActions>
      </Dialog>

      {/* 로그아웃 성공 다이얼로그 */}
      <Dialog
        open={openLogoutSuccessDialog}
        onClose={handleLogoutSuccessClose}
        PaperProps={{
          sx: {
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: '#00b4d8' }}>
          로그아웃 완료
        </DialogTitle>
        <DialogContent>
          <Typography>
            로그아웃이 성공적으로 완료되었습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleLogoutSuccessClose}
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
    </>
  );
}

export default Logout;
