import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// 1. 컨트랙트 설정
const CONTRACT_ADDRESS = "0xe057336aFb19bBFBD6ad1ff79c4781BB20282aEF"; 
const ABI = [
  "function voteForCandidate(string memory candidate) public",
  "function totalVotesFor(string memory candidate) view public returns(uint256)",
  "function candidateList(uint256) view public returns(string)"
];

function App() {
  const [candidates, setCandidates] = useState([
    { name: "Rama", votes: 0 },
    { name: "Nick", votes: 0 },
    { name: "Jose", votes: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  // 2. 가나슈로부터 투표수 실시간 조회
  const fetchVotes = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const updatedList = await Promise.all(
        candidates.map(async (c) => {
          // 블록체인에서 해당 후보자의 투표수를 가져옴
          const voteCount = await contract.totalVotesFor(c.name);
          console.log(`${c.name}의 투표수:`, voteCount.toString());
        
          return {
            ...c,
            votes: Number(voteCount) 
          };
        })
      );

      setCandidates(updatedList); 
    } catch (err) {
      console.error("데이터 로드 상세 에러:", err);
    }
  };

  useEffect(() => {
    fetchVotes();
    // 가나슈 첫번째 계정 표시
    const getAccount = async () => {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
      const signer = await provider.getSigner(0);
      setCurrentAccount(await signer.getAddress());
    };
    getAccount();
  }, []);

  // 3. 투표하기 버튼 로직
  const vote = async (name) => {
    try {
      setLoading(true);
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
      const signer = await provider.getSigner(0); // 가나슈 첫 계정으로 투표
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.voteForCandidate(name);
      await tx.wait(); // 블록에 담길 때까지 대기
      
      await fetchVotes();
      alert(`${name}에게 투표했습니다!`);
    } catch (err) {
      alert("투표 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🗳️ Blockchain Voting System</h1>
        <p style={styles.account}>연결된 지갑: {currentAccount}</p>
      </header>

      <div style={styles.cardContainer}>
        {candidates.map((c) => (
          <div key={c.name} style={styles.card}>
            <div style={styles.emoji}>{c.name === "Rama" ? "👳" : c.name === "Nick" ? "🧑" : "👨"}</div>
            <h2>{c.name}</h2>
            <div style={styles.voteCount}>{c.votes} <span>Votes</span></div>
            <button 
              style={{...styles.button, backgroundColor: loading ? '#ccc' : '#4dabf7'}}
              onClick={() => vote(c.name)}
              disabled={loading}
            >
              {loading ? "기록 중..." : "Vote"}
            </button>
          </div>
        ))}
      </div>
      {loading && <p style={styles.loadingText}>블록체인에 투표를 기록하는 중입니다...</p>}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '40px'
  },
  header: {
    marginBottom: '40px',
    textAlign: 'center'
  },
  account: {
    color: '#666',
    fontSize: '0.9rem'
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '30px',
    width: '200px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  emoji: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  voteCount: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '15px 0',
    color: '#333'
  },
  button: {
    border: 'none',
    borderRadius: '8px', 
    color: '#fff',
    padding: '12px 25px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: '0.3s'
  },
  loadingText: {
    marginTop: '20px',
    color: '#ff6b6b',
    fontWeight: 'bold',
    textAlign: 'center'
  }
};

export default App;