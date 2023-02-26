
import { ethers } from 'ethers';

const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(
  process.env.RPC_URL,
  1
);

export default provider;