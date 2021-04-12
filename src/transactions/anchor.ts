import { TRANSACTION_TYPE, IAnchorTransaction, IAnchorParams, WithId, WithSender } from '../transactions'
import { signBytes, hashBytes } from '@lto-network/lto-crypto'
import {addProof, getSenderPublicKey, convertToPairs, fee } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@lto-network/lto-marshall'

/* @echo DOCS */
export function anchor(params: IAnchorParams, seed: TSeedTypes): IAnchorTransaction & WithId
export function anchor(paramsOrTx: IAnchorParams & WithSender | IAnchorTransaction, seed?: TSeedTypes): IAnchorTransaction & WithId
export function anchor(paramsOrTx: any, seed?: TSeedTypes): IAnchorTransaction {
  const type = TRANSACTION_TYPE.ANCHOR
  const version = paramsOrTx.version || 1
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: IAnchorTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    fee: fee(paramsOrTx, 35000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
    anchors: paramsOrTx.anchors || [],
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)

  return tx
}
