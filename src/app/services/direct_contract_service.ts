import { ethers } from 'ethers';

import constants from '../config/constants';
import aqAbi from '../abis/aq_abi';
import erc721TokenAbi from '../abis/erc721_token_abi';
import provider from '../config/provider';

import getEthPrice from '../utils/getEthPrice';

const extractContractData = async (wallet_address: string | null) => {
  const aq1Contract = new ethers.Contract(
    constants.AQ_CONTRACT,
    aqAbi,
    provider
  );

  const wethContract = new ethers.Contract(
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    erc721TokenAbi,
    provider
  );

  const blurPoolContract = new ethers.Contract(
    '0x0000000000A39bb272e79075ade125fd351887Ac',
    erc721TokenAbi,
    provider
  );

  const [
    tokenCount,
    { value, decimals },
    treasuryBalance,
    wethBalance,
    blurPoolBalance,
  ] = await Promise.all([
    wallet_address ? aq1Contract.balanceOf(wallet_address) : null,
    getEthPrice(provider),
    provider.getBalance(constants.ROYALTY_RECIPIENT_ADDRESS),
    wethContract.balanceOf(constants.ROYALTY_RECIPIENT_ADDRESS),
    blurPoolContract.balanceOf(constants.ROYALTY_RECIPIENT_ADDRESS),
  ]);

  const treasuryStake =
    (Number(tokenCount || 0) / constants.TOTAL_BALANCE) * 100;

  const treasuryAssetValueTotal = (treasuryBalance +
    wethBalance +
    blurPoolBalance) as bigint;
  const ethPriceInUSD = Number((value * 100n) / 10n ** decimals) / 100;
  const balanceInUSD = (treasuryAssetValueTotal * value) / 10n ** decimals;

  return {
    treasuryStake,
    ethPriceInUSD,
    treasuryBalanceInEth: ethers.formatEther(treasuryBalance),
    treasuryBalanceInWeth: ethers.formatEther(wethBalance),
    treasuryBalanceInBloorPool: ethers.formatEther(blurPoolBalance),
    treasuryAssetValueInUSD: ethers.formatEther(balanceInUSD),
    treasuryAssetValueTotal: ethers.formatEther(treasuryAssetValueTotal),
  };
};

export default extractContractData;
