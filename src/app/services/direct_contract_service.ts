import { ethers } from 'ethers';

import constants from '../config/constants';
import aqAbi from '../abis/aqAbi';
import provider from '../config/provider';

import getEthPrice from '../utils/getEthPrice';

const extractContractData = async (wallet_address: string) => {
  const aq1_contract = new ethers.Contract(constants.AQ_CONTRACT, aqAbi, provider);

  const tokenCount = await aq1_contract.balanceOf(wallet_address);
  const treasuryStake = (Number(tokenCount) / constants.TOTAL_BALANCE) * 100;

  const treasuryBalance = await provider.getBalance(constants.ROYALTY_RECIPIENT_ADDRESS);
  const ethPriceInUSD = await getEthPrice(provider);

  const treasuryAssetValue = treasuryBalance * ethPriceInUSD;

  return {
    treasuryStake,
    ethPriceInUSD: Number(ethPriceInUSD),
    treasuryBalance: ethers.formatEther(treasuryBalance),
    treasuryAssetValue: ethers.formatEther(treasuryAssetValue),
  }
};

export default extractContractData;
