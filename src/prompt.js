// 프롬프트 템플릿 정의
const generateQuestionPrompt = (keyword, difficulty) => `
${keyword}에 대한 ${difficulty}난이도의 주관식 or 객관식 문제를 만들어줘.
문제는 주관식과 객관식이 다양하게 번갈아가며 생성되도록 해줘.
문제는 하나만 생성해줘.
문제는 명확하고 구체적이어야 하며, 학습자가 이해하기 쉽도록 작성해줘. 
문제는 지문과 보기를 포함한 깔끔한 형식으로 출력해줘. 
코드는 markdown 형식으로 출력해줘.
문제 형식은 아래와 같이 구성해줘(객관식이면 <보기>, 주관식이면 <보기>없이 문제만 생성해줘):

문제:
(질문 내용)

객관식 보기:
1. ...
2. ...
3. ...
4. ...

정답:
(정답 내용)
`;

const generateFeedbackPrompt = (keyword, question, correctAnswer, answer, isCorrect) => `
다음은 학습자의 답변입니다. 이 답변에 대한 해설을 제공해주세요.

키워드: ${keyword}
질문: ${question}
정답: ${correctAnswer}
학습자 답변: ${answer}
정답 여부: ${isCorrect ? '정답' : '오답'}

깔끔한 형식으로 출력해줘.      
다음 형식으로 피드백을 제공해주세요:
1. 정답 여부 (정답 / 오답)
2. 문제에 대한 정답
3. 문제해설
`;

const generateMultipleQuestionsPrompt = (difficulty, keyword, category, isObjective) => `
다음 조건에 맞는 문제를 생성해주세요:
- 난이도: ${difficulty}
- 키워드: ${keyword}
- 카테고리: ${category}
- 문제 유형: ${isObjective ? '객관식' : '주관식'}

문제 형식은 아래와 같이 구성해줘(객관식이면 <보기>, 주관식이면 <보기>없이 문제만 생성해줘):

문제:
(질문 내용)

${isObjective ? '객관식 보기:\n1. ...\n2. ...\n3. ...\n4. ...\n\n정답: (정답 번호)' : ''}
`;

const evaluateAnswerPrompt = (question, answer) => `
다음 문제와 답변을 평가해주세요.
답변이 문제의 핵심 내용을 포함하고 있다면 정답으로 처리해주세요.
완벽하지 않더라도 핵심 내용이 포함되어 있다면 정답으로 처리해주세요.
정확히 "정답" 또는 "오답"이라고만 답변해주세요.

문제: ${question}
답변: ${answer}
`;

module.exports = {
  generateQuestionPrompt,
  generateFeedbackPrompt,
  generateMultipleQuestionsPrompt,
  evaluateAnswerPrompt
}; 