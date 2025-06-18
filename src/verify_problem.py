import sys
import torch
from transformers import RobertaTokenizer, RobertaForSequenceClassification

MODEL_DIR = './trained_problem_verifier'

try:
    tokenizer = RobertaTokenizer.from_pretrained(MODEL_DIR)
    model = RobertaForSequenceClassification.from_pretrained(MODEL_DIR)
except Exception as e:
    print(f"모델 로드 중 오류 발생: {e}")
    sys.exit(1)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def verify_problem(problem_text):
    inputs = tokenizer(problem_text, return_tensors="pt", truncation=True, padding=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()
    return predicted_class

if __name__ == "__main__":
    problem = " ".join(sys.argv[1:])
    result = verify_problem(problem)
    print(result)
