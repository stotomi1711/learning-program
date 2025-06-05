async function selectProfile(profileId) {
  try {
    const response = await fetch('/api/profiles/select', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUserId,
        profileId: profileId
      }),
    });

    const data = await response.json();
    if (response.ok) {
      if (data.hasLearningHistory) {
        // 학습 기록이 있는 경우 이어서 학습할지 확인
        const continueLearning = confirm('이전 학습 기록이 있습니다. 이어서 학습하시겠습니까?');
        if (continueLearning) {
          // 이전 학습 기록으로 이동
          const lastQuestion = data.lastQuestion;
          showQuestion(lastQuestion);
          return;
        }
      }
      // 새로운 학습 시작
      showKeywordSelection();
    } else {
      alert(data.error || '프로필 선택 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('프로필 선택 중 오류 발생:', error);
    alert('프로필 선택 중 오류가 발생했습니다.');
  }
} 