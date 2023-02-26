import { BlockVisionProvider, BvNetwork } from 'blockvision.js';

import constants from '../config/constants';

const bv = new BlockVisionProvider(BvNetwork.ETH_MAINNET);

const getBlockVisionStats = async () => {
  // Access the BlockVision NFT API
  const data = (await bv.getNFTCollectionMarketInfo({
    contractAddress: constants.AQ_CONTRACT,
  })) as any;

  return data;
};

export default getBlockVisionStats;
