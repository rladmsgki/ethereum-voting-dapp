# 🗳️ Ethereum Voting System (DApp)

이더리움 스마트 컨트랙트를 활용하여 후보자에게 투표하고, 투표 결과를 실시간으로 블록체인에서 조회하는 탈중앙화 애플리케이션(DApp)

## 🛠 사용 기술
- **Smart Contract:** Solidity (v0.8.17)
- **Frontend:** React (Vite)
- **Library:** Ethers.js (v6)
- **Local Blockchain:** Ganache

## ✨ 주요 기능
- **후보자 조회:** 블록체인에 등록된 후보자 리스트와 득표수를 실시간으로 로드
- **투표 기능:** 가나슈 계정을 이용해 특정 후보자에게 투표 (트랜잭션 발생)
- **데이터 무결성:** 모든 투표 결과는 블록체인 네트워크에 기록됨

## ⚙️ 실행 방법

### 1. 가나슈(Ganache) 실행
- RPC Server: `http://127.0.0.1:7545` 확인

### 2. 컨트랙트 컴파일 및 배포
```bash
node deploy.mjs
