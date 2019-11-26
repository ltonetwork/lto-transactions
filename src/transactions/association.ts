import {
  TRANSACTION_TYPE,
  IAssociationTransaction,
  IAssociationParams,
  WithId,
  WithSender,
} from '../transactions'
import { signBytes, hashBytes } from '@lto-network/lto-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@lto-network/lto-marshall'

/* @echo DOCS */
export function association(params: IAssociationParams, seed: TSeedTypes): IAssociationTransaction & WithId
export function association(paramsOrTx: IAssociationParams & WithSender | IAssociationTransaction, seed?: TSeedTypes): IAssociationTransaction & WithId
export function association(paramsOrTx: any, seed?: TSeedTypes): IAssociationTransaction {
  const type = TRANSACTION_TYPE.ASSOCIATION
  const version = paramsOrTx.version || 1
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: IAssociationTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    fee: fee(paramsOrTx, 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '9NrYcPr6zN7rr9nypvuQHSTToNniyYXKiDFK3UDeQ6F8',
    party: paramsOrTx.party,
    associationType: paramsOrTx.associationType,
    hash: paramsOrTx.hash || null,
    action: paramsOrTx.action,
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)

  return tx
}
