import { TypelessDataEntry } from './transactions/data'

export enum TRANSACTION_TYPE {
  GENESIS = 1,
  TRANSFER = 4,
  LEASE = 8,
  CANCEL_LEASE = 9,
  MASS_TRANSFER = 11,
  DATA = 12,
  SET_SCRIPT = 13,
  ANCHOR = 15,
  INVOKE_ASSOCIATION = 16,
  REVOKE_ASSOCIATION = 17,
}

export enum DATA_FIELD_TYPE {
  INTEGER = 'integer',
  BOOLEAN = 'boolean',
  BINARY = 'binary',
  STRING = 'string',
}

export interface WithSender {
  /**
   * Account public key. This account will pay fee and this account's script will be executed if exists
   */
  senderPublicKey: string
}

export interface WithProofs {
  /**
   * ITransaction signatures
   * @minItems 0
   * @maxItems 8
   */
  proofs: string[]
}

export interface WithChainId {
  /**
   * Network byte.
   * E.g.,
   * 87 is used for LTO mainnet, 84 for LTO testnet
   */
  chainId: number
}


export interface WithId {
  /**
   * Transaction ID. 32 bytes hash encoded as base58 string
   */
  id: string
}

/**
 * This interface has common fields for all transactions
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ITransaction<LONG = string | number> extends WithProofs, WithSender {
  type: number
  timestamp: number
  fee: LONG
  version: number
}

/**
 *
 */
export type TTx<LONG = string | number> =
  | ITransferTransaction<LONG>
  | ILeaseTransaction<LONG>
  | ICancelLeaseTransaction<LONG>
  | IMassTransferTransaction<LONG>
  | ISetScriptTransaction<LONG>
  | IDataTransaction<LONG>
  | IAnchorTransaction<LONG>
  | IInvokeAssociationTransaction<LONG>
  | IRevokeAssociationTransaction<LONG>

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ISetScriptTransaction<LONG = string | number> extends ITransaction<LONG>, WithChainId {
  type: TRANSACTION_TYPE.SET_SCRIPT
  /**
   * Compiled script encoded as base64 string
   */
  script: string | null //base64
}

/**
 * Used to transfer assets from one account to another.
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ITransferTransaction<LONG = string | number> extends ITransaction<LONG> {
  type: TRANSACTION_TYPE.TRANSFER
  recipient: string
  amount: LONG
  attachment: string
  feeAssetId?: string | null
  assetId?: string | null
}

/**
 * Used for anchor transactions.
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IAnchorTransaction<LONG = string | number> extends ITransaction<LONG> {
  type: TRANSACTION_TYPE.ANCHOR
  anchors: string[]
}

export interface IAssociationTransaction<LONG = string | number> extends ITransaction<LONG>, WithChainId {
  sender: string,
  party: string,
  associationType: LONG,
  hash?: string | null,
}

/**
 * Used for invoking association transactions.
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IInvokeAssociationTransaction<LONG = string | number> extends IAssociationTransaction<LONG> {
  type: TRANSACTION_TYPE.INVOKE_ASSOCIATION,
}

/**
 * Used for revoking association transactions.
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IRevokeAssociationTransaction<LONG = string | number> extends IAssociationTransaction<LONG> {
  type: TRANSACTION_TYPE.REVOKE_ASSOCIATION,
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IMassTransferItem<LONG = string | number> {
  recipient: string
  amount: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ILeaseTransaction<LONG = string | number> extends ITransaction<LONG> {
  type: TRANSACTION_TYPE.LEASE
  amount: LONG
  recipient: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ICancelLeaseTransaction<LONG = string | number> extends ITransaction<LONG>, WithChainId {
  type: TRANSACTION_TYPE.CANCEL_LEASE
  leaseId: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IMassTransferTransaction<LONG = string | number> extends ITransaction<LONG> {
  type: TRANSACTION_TYPE.MASS_TRANSFER
  transfers: IMassTransferItem<LONG>[]
  attachment: string
  assetId?: string | null
}

export interface DataEntry {
  key: string
  type: DATA_FIELD_TYPE
  value: string | number | boolean
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IDataTransaction<LONG = string | number> extends ITransaction<LONG> {
  type: TRANSACTION_TYPE.DATA
  data: DataEntry[]
}

//////////////params
export type TTxParams<LONG = string | number> =
  | ICancelLeaseParams<LONG>
  | IDataParams<LONG>
  | IAnchorParams<LONG>
  | ILeaseParams<LONG>
  | IMassTransferParams<LONG>
  | ISetScriptParams<LONG>
  | ITransferParams<LONG>

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IBasicParams<LONG = string | number> {
  /**
   * Transaction fee. If not set, fee will be calculated automatically
   */
  fee?: LONG
  /**
   * If fee is not set, this value will be added to automatically calculated fee. E.x.:
   * Account is scripted and 400000 fee more is required.
   */
  additionalFee?: number
  /**
   * If not set, public key will be derived from seed phrase. You should provide senderPublicKey in two cases:
   * 1. Account, from which this tx should be sent, differs from tx signer. E.g., we have smart account that requires 2 signatures.
   * 2. You to create tx without proof. Therefore no seed is provided.
   */
  senderPublicKey?: string
  /**
   * Transaction timestamp. If not set current timestamp will be used. Date.now()
   */
  timestamp?: number
}

export interface WithChainIdParam {
  /**
   * Network byte. Could be set as number or as char.
   * If set as char(string), charCodeAt(0) will be used. E.g.,
   * 'W' will be converted to '87'
   * If not set, 87 will be used as default
   */
  chainId?: string | number
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ICancelLeaseParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam {
  leaseId: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IDataParams<LONG = string | number> extends IBasicParams<LONG> {
  data: Array<DataEntry | TypelessDataEntry>
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ILeaseParams<LONG = string | number> extends IBasicParams<LONG> {
  recipient: string
  amount: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IMassTransferParams<LONG = string | number> extends IBasicParams<LONG> {
  transfers: IMassTransferItem[]
  /**
   * Bytearray encoded as base string
   */
  attachment?: string
  assetId?: string | null
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ISetScriptParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam {
  /**
   * Compiled script encoded as base64 string
   */
  script: string | null
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ITransferParams<LONG = string | number> extends IBasicParams<LONG> {
  recipient: string
  amount: LONG
  assetId?: string | null
  /**
   * Fee can be paid in custom token if sponsorship has been set for this token
   */
  feeAssetId?: string | null
  /**
   * Bytearray encoded as base58 string
   */
  attachment?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IAnchorParams<LONG = string | number> extends IBasicParams<LONG> {
  anchors: string[]
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IAssociationParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam {
  party: string,
  associationType: LONG,
  hash?: string | null,
  sender?: string,
}
