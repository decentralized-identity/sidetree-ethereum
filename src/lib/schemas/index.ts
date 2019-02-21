import fs from 'fs';
import path from 'path';

import { Validator } from 'jsonschema';

const v = new Validator();

const isValid = (instance: any, schema: any) => {
  return v.validate(instance, schema).errors.length === 0;
};

// TODO: use some magic typescript json schema thing here...
export default {
  isValid,
  BlockchainTime: JSON.parse(
    fs
      .readFileSync(
        path.resolve(__dirname, '../../schemas/BlockchainTime.json')
      )
      .toString()
  ),
  BlockchainTransaction: JSON.parse(
    fs
      .readFileSync(
        path.resolve(__dirname, '../../schemas/BlockchainTransaction.json')
      )
      .toString()
  ),

  CreateTransaction: JSON.parse(
    fs
      .readFileSync(
        path.resolve(__dirname, '../../schemas/CreateTransaction.json')
      )
      .toString()
  )
};
