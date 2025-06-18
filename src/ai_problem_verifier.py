import torch
from transformers import RobertaTokenizer, RobertaForSequenceClassification
import json
import random
from pathlib import Path
from torch.utils.data import Dataset, DataLoader
from transformers import Trainer, TrainingArguments
from sklearn.metrics import accuracy_score, f1_score
import glob

# 토크나이저와 모델 로드
tokenizer = RobertaTokenizer.from_pretrained("microsoft/codebert-base")
model = RobertaForSequenceClassification.from_pretrained("microsoft/codebert-base")

# GPU 사용 가능 시 GPU로 이동
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# 문제 검증 함수
def verify_problem(problem_text):
    inputs = tokenizer(problem_text, return_tensors="pt", truncation=True, padding=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()
    return predicted_class

class MBPPDataset(Dataset):
    def __init__(self, jsonl_path, tokenizer, max_length=256):
        self.samples = []
        with open(jsonl_path, 'r', encoding='utf-8') as f:
            for line in f:
                item = json.loads(line)
                # code와 test_list가 모두 있으면 정상(1), 아니면 비정상(0)
                label = 1 if item.get('code') and item.get('test_list') else 0
                self.samples.append((item['text'], label))
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        text, label = self.samples[idx]
        inputs = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors="pt"
        )
        item = {k: v.squeeze(0) for k, v in inputs.items()}
        item['labels'] = label
        return item

class EvalDataset(Dataset):
    def __init__(self, data_folder, tokenizer, max_length=256):
        self.samples = []
        for file in glob.glob(f"{data_folder}/*.json"):
            with open(file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # method와 tests가 모두 있으면 정상(1), 아니면 비정상(0)
                if 'problem' in data:
                    text = data['problem']
                elif 'text' in data:
                    text = data['text']
                else:
                    continue
                label = 1 if data.get('method') and data.get('tests') else 0
                self.samples.append((text, label))
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        text, label = self.samples[idx]
        inputs = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors="pt"
        )
        item = {k: v.squeeze(0) for k, v in inputs.items()}
        item['labels'] = label
        return item

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = logits.argmax(axis=-1)
    acc = accuracy_score(labels, predictions)
    f1 = f1_score(labels, predictions, average='macro')
    return {"accuracy": acc, "f1": f1}

if __name__ == "__main__":
    # 예시 문제 텍스트
    problem = "다음 중 파이썬의 기본 자료형이 아닌 것은 무엇인가? 1) int 2) float 3) list 4) tree"
    result = verify_problem(problem)
    print(f"예측된 클래스: {result}")

    # 데이터셋 및 DataLoader 준비
    train_dataset = MBPPDataset("src/dataset/mbpp.jsonl", tokenizer)
    val_dataset = EvalDataset("src/dataset/data", tokenizer)

    # Trainer를 이용한 파인튜닝
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=2,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
    )

      # 평가
    eval_result = trainer.evaluate()
    print('검증 결과:', eval_result)

    # 모델 저장
    model.save_pretrained('./trained_problem_verifier')

    # 토크나이저 저장 (중요!)
    tokenizer.save_pretrained('./trained_problem_verifier')

    print('모델 및 토크나이저 학습 및 저장 완료!')
