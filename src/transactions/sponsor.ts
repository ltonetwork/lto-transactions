import {TRANSACTION_TYPE, ISponsorParams, WithId, WithSender, ISponsorTransaction} from '../transactions'
import { signBytes, hashBytes } from '@lto-network/lto-crypto'
import {addProof, getSenderPublicKey, convertToPairs, fee, networkByte} from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@lto-network/lto-marshall'

/* @echo DOCS */
export function sponsor(params: ISponsorParams, seed: TSeedTypes): ISponsorTransaction & WithId
export function sponsor(paramsOrTx: ISponsorParams & WithSender | ISponsorTransaction, seed?: TSeedTypes): ISponsorTransaction & WithId
export function sponsor(paramsOrTx: any, seed?: TSeedTypes): ISponsorTransaction {
  const type = TRANSACTION_TYPE.SPONSOR;
  const version = paramsOrTx.version || 1;
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: ISponsorTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    recipient: paramsOrTx.recipient,
    chainId: networkByte(paramsOrTx.chainId, 76),
    fee: fee(paramsOrTx, 500000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)

  return tx
}
