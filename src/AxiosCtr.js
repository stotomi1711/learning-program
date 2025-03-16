import { useEffect, useState } from 'react';
import axios from 'axios';

// Axios 요청 취소 처리 모듈
const AxiosCtr = () => {
  const [cancelTokenSource, setCancelTokenSource] = useState(null);

  useEffect(() => {
    // 페이지가 이동하거나 컴포넌트가 언마운트 될 때 요청을 취소
    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel('페이지 이동으로 인한 요청 취소');
      }
    };
  }, [cancelTokenSource]);

  // axios 요청을 취소하기 위한 함수를 반환
  const getCancelToken = () => {
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);
    return source.token;
  };

  return {
    getCancelToken,
  };
};

export default AxiosCtr;
