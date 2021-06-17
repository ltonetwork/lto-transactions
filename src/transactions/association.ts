import {
  TRANSACTION_TYPE,
  IAssociationTransaction,
  IAssociationParams,
  WithId,
  WithSender,
} from '../transactions'
import { signBytes, hashBytes } from '@lto-network/lto-crypto'
import {addProof, getSenderPublicKey, convertToPairs, fee, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '../parseSerialize'

/* @echo DOCS */
export function invokeAssociation(params: IAssociationParams, seed: TSeedTypes): IAssociationTransaction & WithId
export function invokeAssociation(paramsOrTx: IAssociationParams & WithSender | IAssociationTransaction, seed?: TSeedTypes): IAssociationTransaction & WithId
export function invokeAssociation(paramsOrTx: any, seed?: TSeedTypes): IAssociationTransaction {
  const type = TRANSACTION_TYPE.INVOKE_ASSOCIATION
  const version = paramsOrTx.version || 1
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)
  const sender = paramsOrTx.sender

  const tx: IAssociationTransaction & WithId = {
    id: '',
    type,
    version,
    senderPublicKey,
    sender,
    chainId: networkByte(paramsOrTx.chainId, 76),
    fee: fee(paramsOrTx, 100000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    party: paramsOrTx.party,
    associationType: paramsOrTx.associationType,
    hash: paramsOrTx.hash ? paramsOrTx.hash : '',
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)

  return tx
}

export function revokeAssociation(params: IAssociationParams, seed: TSeedTypes): IAssociationTransaction & WithId
export function revokeAssociation(paramsOrTx: IAssociationParams & WithSender | IAssociationTransaction, seed?: TSeedTypes): IAssociationTransaction & WithId
export function revokeAssociation(paramsOrTx: any, seed?: TSeedTypes): IAssociationTransaction {
  const type = TRANSACTION_TYPE.REVOKE_ASSOCIATION
  const version = paramsOrTx.version || 1
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)
  const sender = paramsOrTx.sender

  const tx: IAssociationTransaction & WithId = {
    id: '',
    type,
    version,
    senderPublicKey,
    sender,
    chainId: networkByte(paramsOrTx.chainId, 76),
    fee: fee(paramsOrTx, 100000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    party: paramsOrTx.party,
    associationType: paramsOrTx.associationType,
    hash: paramsOrTx.hash ? paramsOrTx.hash : '',
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)

  return tx
}
