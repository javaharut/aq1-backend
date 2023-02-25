/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import 'dotenv/config';
import express from 'express';
import { ethers } from 'ethers';
import { BlockVisionProvider, BvNetwork } from 'blockvision.js';

import getEthPrice from './utils/getEthPrice';

import aqAbi from './abis/aqAbi';

const app = express();

const AQ_CONTRACT = '0xC163A42088c7c65a23B059537519F6a02bD18075';
const TOTAL_BALANCE = 1000;
const TREASURY_ADDRESS = '0xB48B8776311E710633c0750752DD40E643E19C76';
const ROYALTY_RECIPIENT_ADDRESS = '0x18c1ea679Aad89e495cA0Fae3a7092c239D755d3';

// const wallet_address = '0xF78747c437acc5667a6E994BCDB0926f03995711';

const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(
    process.env.RPC_URL,
    1
);

const bv = new BlockVisionProvider(BvNetwork.ETH_MAINNET);

app.get('/dashboard', async (req, res) => {
    const wallet_address = req.query.wallet_address;
    const aq1_contract = new ethers.Contract(AQ_CONTRACT, aqAbi, provider);

    const tokenCount = await aq1_contract.balanceOf(wallet_address);
    const treasuryStake = (Number(tokenCount) / TOTAL_BALANCE) * 100;

    const treasuryBalance = await provider.getBalance(
        ROYALTY_RECIPIENT_ADDRESS
    );
    const ethPriceInUSD = await getEthPrice(provider);

    const treasuryAssetValue = treasuryBalance * ethPriceInUSD;

    // Access the BlockVision NFT API
    const {
        owners: ownerCount,
        totalVolume,
        lowestPriceIn24H,
        tradedVolumeIn24H
    } = (await bv.getNFTCollectionMarketInfo({
        contractAddress: AQ_CONTRACT
    })) as any;

    const result = {
        tokenCount: Number(tokenCount),
        treasuryStake,
        ethPriceInUSD: Number(ethPriceInUSD),
        treasuryBalance: ethers.formatEther(treasuryBalance),
        treasuryAssetValue: ethers.formatEther(treasuryAssetValue),
        ownerCount,
        totalVolume,
        lowestPriceIn24H,
        tradedVolumeIn24H
    };

    return res.json(result);
});

export default app;
