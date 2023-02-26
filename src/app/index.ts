import 'dotenv/config';
import express, { Request, Response } from 'express';

import getOpenseaStats from './services/os_service';
import getBlockVisionStats from './services/bv_service';
import extractContractData from './services/direct_contract_service';

const app = express();

app.get('/dashboard', async (req: Request, res: Response) => {
  const result = {
    contract_direct_data:
      req.query && req.query.wallet_address
        ? await extractContractData((req.query as any).wallet_address)
        : null,
    os_stats: await getOpenseaStats(),
    bv_stats: await getBlockVisionStats(),
  };

  return res.json(result);
});

export default app;
