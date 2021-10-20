import {
  TRANSACTION_TYPE,
  IAnchorTransaction,
  IAnchorParams,
  WithId,
  WithSender,
  WithOptSponsor,
  WithChainId
} from '../transactions'
import {signBytes, hashBytes, chainIdOf} from '@lto-network/lto-crypto'
import {addProof, getSenderPublicKey, convertToPairs, fee, networkByte} from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '../parseSerialize'

/* @echo DOCS */
export function anchor(params: IAnchorParams, seed: TSeedTypes): IAnchorTransaction & WithId
export function anchor(paramsOrTx: IAnchorParams & ( WithSender | WithChainId ) & WithOptSponsor | IAnchorParams & WithSender | IAnchorTransaction, seed?: TSeedTypes): IAnchorTransaction & WithId
export function anchor(paramsOrTx: any, seed?: TSeedTypes): IAnchorTransaction {
  const type = TRANSACTION_TYPE.ANCHOR
  const version = paramsOrTx.version || (paramsOrTx.sponsorPublicKey || paramsOrTx.chainId ? 3 : 1)
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)
  const sponsorPublicKey = paramsOrTx.sponsorPublicKey
  const chainId = paramsOrTx.chainId ? paramsOrTx.chainId : paramsOrTx.sender ? chainIdOf(paramsOrTx.sender).charCodeAt(0) : 76

  const txToSign: IAnchorTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    fee: fee(paramsOrTx, 35000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
    anchors: paramsOrTx.anchors || [],
  }
  const v3tx : IAnchorTransaction & WithId & WithChainId = {
    ...txToSign,
    chainId: networkByte(chainId, 76),
    sponsorPublicKey,
  }
  const tx = version == 3 ? v3tx : txToSign

  const bytes = binary.serializeTx(tx)
  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)

  return tx
}
