import {
  TRANSACTION_TYPE,
  IAssociationTransaction,
  IAssociationParams,
  WithId,
  WithSender, WithProofs, IAssociationParamsV3, IAssociationTransactionV3,
} from '../transactions'
import { signBytes, hashBytes, chainIdOf } from '@lto-network/lto-crypto'
import {addProof, getSenderPublicKey, convertToPairs, fee, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '../parseSerialize'

/* @echo DOCS */
export function invokeAssociation(params: IAssociationParamsV3 | IAssociationParams, seed: TSeedTypes): (IAssociationTransaction & WithId) | (IAssociationTransactionV3 & WithId)
export function invokeAssociation(paramsOrTx: (IAssociationParamsV3 & WithSender) | (IAssociationParams & WithSender) | IAssociationTransaction, seed?: TSeedTypes): (IAssociationTransaction & WithId) | (IAssociationTransactionV3 & WithId)
export function invokeAssociation(paramsOrTx: any, seed?: TSeedTypes): IAssociationTransaction | IAssociationTransactionV3 {
  const type = TRANSACTION_TYPE.INVOKE_ASSOCIATION
  const version = paramsOrTx.version || (paramsOrTx.recipient || paramsOrTx.sponsorPublicKey ? 3 : 1)
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)
  // Not used as the backend and python code seems to be fixated on keytype id 1
  // const senderKeyType = paramsOrTx.senderKeyType || 'ed25519'
  const sender = paramsOrTx.sender
  const chainId = chainIdOf(paramsOrTx.party ? paramsOrTx.party : paramsOrTx.recipient).charCodeAt(0)
  const sponsorPublicKey = paramsOrTx.sponsorPublicKey

  const v1Tx: IAssociationTransaction & WithId & WithProofs = {
    id: '',
    type,
    version,
    senderPublicKey,
    sender,
    chainId,
    fee: fee(paramsOrTx, 100000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    party: paramsOrTx.party,
    associationType: paramsOrTx.associationType,
    hash: paramsOrTx.hash ? paramsOrTx.hash : '',
  }

  const v3Tx: IAssociationTransactionV3 & WithId & WithProofs = {
    id: '',
    type,
    version,
    chainId,
    sender,
    senderPublicKey,
    // Not used as the backend and python code seems to be fixated on keytype id 1
    // senderKeyType,
    fee: fee(paramsOrTx, 100000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    associationType: paramsOrTx.associationType,
    hash: paramsOrTx.hash ? paramsOrTx.hash : '',
    recipient: paramsOrTx.recipient,
    expires: paramsOrTx.expires || 0,
    sponsorPublicKey,
  }

  const tx = version == 3 ? v3Tx : v1Tx
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
