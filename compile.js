const fs = require("fs");
const solc = require("solc");

const source = fs.readFileSync("Voting.sol", "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Voting.sol": { content: source },
  },
  settings: {
    evmVersion: "paris",
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((e) => console.log(e.formattedMessage));
} else {
  console.log("컴파일 성공");
}

const contract = output.contracts["Voting.sol"].Voting;

fs.writeFileSync(
  "Voting.abi.json",
  JSON.stringify(contract.abi, null, 2)
);

fs.writeFileSync(
  "Voting.bytecode.txt",
  contract.evm.bytecode.object
);