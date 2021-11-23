import axios from 'axios'
import { verifySignature } from './crypto'
import { binary, serializePrimitives } from './parseSerialize'
import {
  ICancelLeaseTransaction,
  IDataTransaction,
  IAnchorTransaction,
  IAssociationTransaction,
  ILeaseTransaction,
  IMassTransferTransaction,
  ISetScriptTransaction,
  ITransferTransaction,
  TRANSACTION_TYPE,
  TTx,
  TTxParams, WithId,
} from './transactions'
import { TSeedTypes } from './types'
import { transfer } from './transactions/transfer'
import { lease } from './transactions/lease'
import { cancelLease } from './transactions/cancel-lease'
import { data } from './transactions/data'
import { anchor } from './transactions/anchor'
import { massTransfer } from './transactions/mass-transfer'
import { setScript } from './transactions/set-script'
import { invokeAssociation, revokeAssociation } from './transactions/association'

export interface WithTxType {
  type: TRANSACTION_TYPE
}

export const txTypeMap: { [type: number]: { sign: (tx: TTx | TTxParams & WithTxType, seed: TSeedTypes) => TTx } } = {
  [TRANSACTION_TYPE.TRANSFER]: { sign: (x, seed) => transfer(x as ITransferTransaction, seed) },
  [TRANSACTION_TYPE.LEASE]: { sign: (x, seed) => lease(x as ILeaseTransaction, seed) },
  [TRANSACTION_TYPE.CANCEL_LEASE]: { sign: (x, seed) => cancelLease(x as ICancelLeaseTransaction, seed) },
  [TRANSACTION_TYPE.MASS_TRANSFER]: { sign: (x, seed) => massTransfer(x as IMassTransferTransaction, seed) },
  [TRANSACTION_TYPE.DATA]: { sign: (x, seed) => data(x as IDataTransaction, seed) },
  [TRANSACTION_TYPE.ANCHOR]: { sign: (x, seed) => anchor(x as IAnchorTransaction, seed) },
  [TRANSACTION_TYPE.INVOKE_ASSOCIATION]: { sign: (x, seed) => invokeAssociation(x as IAssociationTransaction, seed) },
  [TRANSACTION_TYPE.REVOKE_ASSOCIATION]: { sign: (x, seed) => revokeAssociation(x as IAssociationTransaction, seed) },
  [TRANSACTION_TYPE.SET_SCRIPT]: { sign: (x, seed) => setScript(x as ISetScriptTransaction, seed) },
}

/**
 * Signs arbitrary transaction. Can also create signed transaction if provided params have type field
 * @param tx
 * @param seed
 */
export function signTx(tx: TTx | TTxParams & WithTxType, seed: TSeedTypes): TTx {
  if (!txTypeMap[tx.type]) throw new Error(`Unknown tx type: ${tx.type}`)

  return txTypeMap[tx.type].sign(tx, seed)
}

/**
 * Converts transaction to Uint8Array
 * @param obj transaction or order
 */
export function serialize(obj: TTx): Uint8Array {
  return binary.serializeTx(obj)
}

/**
 * Verifies signature of transaction
 * @param obj
 * @param proofN - proof index. Takes first proof by default
 * @param publicKey - takes senderPublicKey by default
 */
export function verify(obj: TTx, proofN = 0, publicKey?: string): boolean {
  publicKey = publicKey || obj.senderPublicKey
  const bytes = serialize(obj)
  const signature = obj.version == null ? (obj as any).signature : obj.proofs[proofN]
  return verifySignature(publicKey, bytes, signature)
}

/**
 * Sends transaction to lto node
 * @param tx - transaction to send
 * @param nodeUrl - node address to send tx to. E.g. https://nodes.lto.network/
 */
export function broadcast(tx: TTx, nodeUrl: string) {
  return axios.post('transactions/broadcast', tx, {
    baseURL: nodeUrl,
    headers: { 'content-type': 'application/json' },
  })
    .then(x => x.data)
    .catch(e => Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
}

/**
 * Retrieve information about lto account balance
 * @param address - lto address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.lto.network/
 */
export function addressBalance(address: string, nodeUrl: string): Promise<number> {
  return axios.get(`addresses/balance/${address}`, { baseURL: nodeUrl })
    .then(x => x.data && x.data.balance)
    .catch(e => Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
}

/**
 * Retrieve all the active leases of an address
 * @param address - lto address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.lto.network/
 */
export function activeLeases(address: string, nodeUrl: string): Promise<(ILeaseTransaction & WithId)[]> {
  return axios.get(`leasing/active/${address}`, { baseURL: nodeUrl })
    .then(x => x.data)
    .catch(e => Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
}

/**
 * Get data from account dictionary by key
 * @param address - lto address as base58 string
 * @param key - dictionary key
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.lto.network/
 */
export function addressDataByKey(address: string, key: string, nodeUrl: string): Promise<number | Uint8Array | string | null> {
  return axios.get(`addresses/data/${address}/${key}`, { baseURL: nodeUrl })
    .then(x => {
      switch (x.data.type) {
        case 'integer':
        case 'string':
          return x.data.value
        case 'binary':
          return serializePrimitives.BASE64_STRING(x.data.value)
        case 'boolean':
          return x.data.value === 'true'
      }
      return null
    })
    .catch(e => e.response && e.response.status === 404 ?
      Promise.resolve(null) :
      Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
}

/**
 * Compile a script
 * @param script the uncompiled script
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.lto.network/
 */
export function compile(script: string, nodeUrl: string) {
  return axios.post('utils/script/compile', script, {
    baseURL: nodeUrl,
    headers: {'content-type': 'application/json'},
  })
    .then(x => x.data && x.data)
    .catch(e => Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
}
