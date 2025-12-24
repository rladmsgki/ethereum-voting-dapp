// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
contract Voting {
  // 후보자를 초기화할 생성자
  // 후보자에게 투표하는 기능
  // 각 후보자에 대한 득표수 확인
  string[] public candidateList;
  mapping (string => uint256) public votesReceived;
  constructor(string[] memory candidateNames) { // 배열 파라미터에 memory 필요
	candidateList = candidateNames; // 각 후보자(candidateList)를 candidateNames에 할당
  } 
  
  // 투표 함수 (후보자가 득표할 때마다 votesReceived를 1씩 올림)
  function voteForCandidate(string memory candidate) public {
	require(validCandidate(candidate), "Invalid candidate");
    votesReceived[candidate] += 1; // votesReceived에 후보가 받은 투표 카운트가 담김. (컨트랙트가 초기화된 시점에는 기본 0이 담김)
  }
  
  // 득표수 확인 함수 (컨트랙트의 상태를 바꾸는 것이 아니므로 view)
  function totalVotesFor(string memory candidate) view public returns(uint256) {
	  require(validCandidate(candidate), "Invalid candidate");
	  return votesReceived[candidate]; // 득표수 반환
  }
  
  // 유효한 후보인지 체크하는 함수 (리스트에 있는지 체크)
  function validCandidate(string memory candidate) view public returns(bool) {
	  for (uint256 i=0; i < candidateList.length; i++) {
			if (
        keccak256(bytes(candidateList[i])) == keccak256(bytes(candidate))
        ) {
				return true;
			}	  
	  }
	  return false;
  }
}