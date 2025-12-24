require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const solc = require("solc");

// 1. 환경 설정
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 2. ABI 가져오기 (컴파일을 다시 하거나, 컴파일된 JSON에서 가져옴)
function getABI() {
  const source = fs.readFileSync("Voting.sol", "utf8");
  const input = {
    language: "Solidity",
    sources: { "Voting.sol": { content: source } },
    settings: {
      outputSelection: { "*": { "*": ["abi"] } },
      evmVersion: "paris"
    },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  return output.contracts["Voting.sol"]["Voting"].abi;
}

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS; 
  const abi = getABI();

  // 3. 컨트랙트 객체 생성
  const votingContract = new ethers.Contract(contractAddress, abi, wallet);

  console.log("--- 컨트랙트 상호작용 시작 ---");

  // A. 데이터 읽기 (Call): Rama의 득표수 확인
  const votesForRama = await votingContract.totalVotesFor("Rama");
  console.log(`현재 Rama의 득표수: ${votesForRama.toString()}`);

  // B. 데이터 쓰기 (Transaction): Nick에게 투표하기
  console.log("Nick에게 투표 중...");
  const tx = await votingContract.voteForCandidate("Nick");
  await tx.wait();
  console.log("투표 완료!");

  // C. 다시 확인
  const votesForNick = await votingContract.totalVotesFor("Nick");
  console.log(`현재 Nick의 득표수: ${votesForNick.toString()}`);
}

main().catch(console.error);