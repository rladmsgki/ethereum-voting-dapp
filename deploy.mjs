import "dotenv/config";
import { ethers } from "ethers";
import fs from "fs";
import solc from "solc";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function main() {
  const source = fs.readFileSync("Voting.sol", "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "Voting.sol": { content: source },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
      evmVersion: "paris"
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  // 컴파일 에러 출력
  if (output.errors) {
    output.errors.forEach((e) => console.log(e.formattedMessage));
  }

  const contract = output.contracts["Voting.sol"]["Voting"];

  const bytecode = "0x" + contract.evm.bytecode.object;

  const factory = new ethers.ContractFactory(
    contract.abi,
    bytecode,
    wallet
  );

  const voting = await factory.deploy(
    ["Rama", "Nick", "Jose"],
    {
      gasLimit: 6_000_000,
    }
  );

  await voting.waitForDeployment();

  console.log("배포 성공");
  console.log("컨트랙트 주소:", await voting.getAddress());
}

main().catch(console.error);
