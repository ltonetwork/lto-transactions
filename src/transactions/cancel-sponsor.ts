import {
  TRANSACTION_TYPE,
  WithId,
  WithSender,
  ICancelSponsorParams, ICancelSponsorTransaction
} from '../transactions'
import { signBytes, hashBytes } from '@lto-network/lto-crypto'
import {addProof, getSenderPublicKey, convertToPairs, fee, networkByte} from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@lto-network/lto-marshall'

/* @echo DOCS */
export function cancelSponsor(params: ICancelSponsorParams, seed: TSeedTypes): ICancelSponsorTransaction & WithId
export function cancelSponsor(paramsOrTx: ICancelSponsorParams & WithSender | ICancelSponsorTransaction, seed?: TSeedTypes): ICancelSponsorTransaction & WithId
export function cancelSponsor(paramsOrTx: any, seed?: TSeedTypes): ICancelSponsorTransaction {
  const type = TRANSACTION_TYPE.CANCEL_SPONSOR;
  const version = paramsOrTx.version || 1;
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: ICancelSponsorTransaction & WithId = {
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
