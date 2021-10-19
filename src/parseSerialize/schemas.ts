import {
  BASE58_STRING, BASE64_STRING,
  BOOL,
  BYTE, INT,
  LEN,
  LONG,
  OPTION, SCRIPT,
  SHORT,
  STRING
} from './serializePrimitives'
import {
  byteNewAliasToString, byteToAddressOrAlias, P_BOOLEAN,
  byteToScript,
  P_LONG, P_OPTION, P_BYTE, P_BASE58_FIXED, P_BASE58_VAR, P_SHORT, P_STRING_VAR, P_BASE64, P_INT
} from './parsePrimitives'
import {
  TObject,
  TSchema,
  DATA_FIELD_TYPE,
  TDataTxItem,
  TObjectField,
  anyOf
} from './schemaTypes'

// TODO: import this enums from ts-types package
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
  SPONSOR = 18,
  CANCEL_SPONSOR = 19,
}

const shortConverter = {
  toBytes: SHORT,
  fromBytes: P_SHORT,
}

const intConverter = {
  toBytes: INT,
  fromBytes: P_INT,
}
export namespace txFields {
  //Field constructors
  export const longField = (name: string): TObjectField => ([name, { toBytes: LONG, fromBytes: P_LONG }])

  export const intField = (name: string): TObjectField => ([name, { toBytes: INT, fromBytes: P_INT }])

  export const byteField = (name: string): TObjectField => ([name, { toBytes: BYTE, fromBytes: P_BYTE }])

  export const booleanField = (name: string): TObjectField => ([name, { toBytes: BOOL, fromBytes: P_BOOLEAN }])

  export const stringField = (name: string): TObjectField => ([name, {
    toBytes: LEN(SHORT)(STRING),
    fromBytes: P_STRING_VAR(P_SHORT),
  }])

  export const base58field32 = (name: string): TObjectField => ([name, {
    toBytes: BASE58_STRING,
    fromBytes: P_BASE58_FIXED(32),
  }])

  export const base58Option32 = (name: string): TObjectField => ([name, {
    toBytes: OPTION(BASE58_STRING),
    fromBytes: P_OPTION(P_BASE58_FIXED(32)),
  }])

  export const base64field = (name: string): TObjectField => ([name, {
    toBytes: LEN(SHORT)(BASE64_STRING),
    fromBytes: P_BASE64(P_SHORT),
  }])

  export const byteConstant = (byte: number): TObjectField => (['noname', {
    toBytes: () => Uint8Array.from([byte]),
    fromBytes: () => ({ value: undefined, shift: 1 }),
  }])

  // Primitive fields
  export const alias: TObjectField = ['alias', {
    toBytes: LEN(SHORT)(STRING),
    fromBytes: byteNewAliasToString,
  }]

  export const amount = longField('amount')

  export const attachment: TObjectField = ['attachment', {
    toBytes: LEN(SHORT)(BASE58_STRING),
    fromBytes: P_BASE58_VAR(P_SHORT),
  }]

  export const chainId = byteField('chainId')

  export const decimals = byteField('decimals')

  export const fee = longField('fee')

  export const leaseId = base58field32('leaseId')

  export const quantity = longField('quantity')

  export const reissuable = booleanField('reissuable')

  export const recipient: TObjectField = ['recipient', {
    toBytes: BASE58_STRING, //ToDo: add alias
    fromBytes: byteToAddressOrAlias,
  }]

  export const sponsor: TObjectField = ['sponsor', {
    toBytes: BASE58_STRING,
    fromBytes: byteToAddressOrAlias,
  }]

  export const script: TObjectField = ['script', {
    toBytes: SCRIPT,
    fromBytes: byteToScript,
  }]

  export const senderPublicKey = base58field32('senderPublicKey')

  // Apparently fixed at 1 in the node code and in python, so lets not support it yet
  // export const senderKeyType = byteField('senderKeyType')

  export const signature: TObjectField = ['signature', {
    toBytes: BASE58_STRING,
    fromBytes: P_BASE58_FIXED(64),
  }]

  export const timestamp = longField('timestamp')

  export const expires = longField('expires')

  export const type = byteField('type')

  export const version = byteField('version')

  // Complex fields

  export const proofs: TObjectField = ['proofs', {
    type: 'array',
    items: {
      toBytes: LEN(SHORT)(BASE58_STRING),
      fromBytes: P_BASE58_VAR(P_SHORT),
    },
  }]

  const transfer: TObject = {
    type: 'object',
    schema: [
      recipient,
      amount,
    ],
  }

  export const transfers: TObjectField = ['transfers', {
    type: 'array',
    items: transfer,
  }]

  const dataTxItem: TDataTxItem = {
    type: 'dataTxField',
    items: new Map<DATA_FIELD_TYPE, TSchema>([
      [DATA_FIELD_TYPE.INTEGER, { toBytes: LONG, fromBytes: P_LONG }],
      [DATA_FIELD_TYPE.BOOLEAN, { toBytes: BOOL, fromBytes: P_BOOLEAN }],
      [DATA_FIELD_TYPE.BINARY, { toBytes: LEN(SHORT)(BASE64_STRING), fromBytes: P_BASE64(P_SHORT) }],
      [DATA_FIELD_TYPE.STRING, { toBytes: LEN(SHORT)(STRING), fromBytes: P_STRING_VAR(P_SHORT) }],
    ]),
  }

  export const data: TObjectField = ['data', {
    type: 'array',
    items: dataTxItem,
  }]

  export const anchors: TObjectField = ['anchors', {
    type: 'array',
    items: {
      toBytes: LEN(SHORT)(BASE58_STRING),
      fromBytes: P_BASE58_VAR(P_SHORT),
    },
  }]

  export const party: TObjectField = ['party', {
    toBytes: BASE58_STRING,
    fromBytes: byteToAddressOrAlias,
  }]

  export const optHash: TObjectField = ['hash', {
    toBytes: OPTION(LEN(SHORT)(BASE58_STRING)),
    fromBytes: P_OPTION(P_BASE58_VAR(P_SHORT)),
  }]

  export const hash: TObjectField = ['hash', {
    toBytes: LEN(SHORT)(BASE58_STRING),
    fromBytes: P_BASE58_VAR(P_SHORT),
  }]

  export const associationType = intField('associationType')

  export const action = stringField('action')

  const functionArgument = anyOf([
    [0, { toBytes: LONG, fromBytes: P_LONG }, 'integer'],
    [1, { toBytes: LEN(INT)(BASE64_STRING), fromBytes: P_BASE64(P_INT) }, 'binary'],
    [2, { toBytes: LEN(INT)(STRING), fromBytes: P_STRING_VAR(P_INT) }, 'string'],
    [6, { toBytes: () => Uint8Array.from([]), fromBytes: () => ({ value: true, shift: 0 }) }, 'boolean'],
    [7, { toBytes: () => Uint8Array.from([]), fromBytes: () => ({ value: false, shift: 0 }) }, 'boolean'],
  ], { valueField: 'value' })


  export const functionCall: TObjectField = ['call', {
    type: 'object',
    schema: [
      // special bytes to indicate function call. Used in Serde serializer
      byteConstant(9),
      byteConstant(1),
      ['function', {
        toBytes: LEN(INT)(STRING),
        fromBytes: P_STRING_VAR(P_INT),
      }],
      ['args', {
        type: 'array',
        toBytes: INT,
        fromBytes: P_INT,
        items: functionArgument,
      }],
    ],
  }]
}

export const cancelLeaseSchemaV2: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.chainId,
    txFields.senderPublicKey,
    txFields.fee,
    txFields.timestamp,
    txFields.leaseId,
  ],
}

export const dataSchemaV1: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.senderPublicKey,
    txFields.data,
    txFields.timestamp,
    txFields.fee,
  ],
}

export const anchorSchemaV1: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.senderPublicKey,
    txFields.anchors,
    txFields.timestamp,
    txFields.fee,
  ],
}

export const anchorSchemaV3: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.chainId,
    txFields.timestamp,
    txFields.byteConstant(1),
    // Not supported in the node and python, so replace by byte constant
    // txFields.senderKeyType,
    txFields.senderPublicKey,
    txFields.fee,
    txFields.anchors,
  ],
}

export const associationSchemaV1: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.chainId,
    txFields.senderPublicKey,
    txFields.party,
    txFields.associationType,
    txFields.optHash,
    txFields.timestamp,
    txFields.fee,
  ],
}

export const associationSchemaV3: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.chainId,
    txFields.timestamp,
    // Not supported in the node and python, so replace by byte constant
    // txFields.senderKeyType,
    txFields.byteConstant(1),
    txFields.senderPublicKey,
    txFields.fee,
    txFields.recipient,
    txFields.associationType,
    txFields.expires,
    txFields.hash,
  ],
}
export const proofsSchemaV0: TSchema = {
  type: 'object',
  schema: [
    ['signature', {
      toBytes: BASE58_STRING,
      fromBytes: P_BASE58_FIXED(64),
    }],
  ],
}

export const proofsSchemaV1: TSchema = {
  type: 'object',
  schema: [
    txFields.byteConstant(1), // proofs version
    txFields.proofs,
  ],
}

export const leaseSchemaV2: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.byteConstant(0),
    txFields.senderPublicKey,
    txFields.recipient,
    txFields.amount,
    txFields.fee,
    txFields.timestamp,
  ],
}

export const massTransferSchemaV1: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.senderPublicKey,
    txFields.transfers,
    txFields.timestamp,
    txFields.fee,
    txFields.attachment,
  ],
}

export const setScriptSchemaV1: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.chainId,
    txFields.senderPublicKey,
    txFields.script,
    txFields.fee,
    txFields.timestamp,
  ],
}

export const transferSchemaV2: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.senderPublicKey,
    txFields.timestamp,
    txFields.amount,
    txFields.fee,
    txFields.recipient,
    txFields.attachment,
  ],
}

export const sponsorSchemaV1: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.chainId,
    txFields.senderPublicKey,
    txFields.recipient,
    txFields.fee,
    txFields.timestamp,
  ],
}

export const cancelSponsorSchemaV1: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.chainId,
    txFields.senderPublicKey,
    txFields.recipient,
    txFields.fee,
    txFields.timestamp,
  ],
}

// This schema is not 100% correct for transfer-v1, it's a workaround for an issue with the Ledger app in the wallet ui
// Once ledger app is fixed, this will no longer be needed
// see the issue: https://github.com/iicc1/ledger-app-lto/issues/3
export const transferSchemaV1: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.type, // this field shouldn't be here - Ledger workaround
    txFields.senderPublicKey,
    txFields.timestamp,
    txFields.amount,
    txFields.fee,
    txFields.recipient,
    txFields.attachment,
  ],
}

// This schema is not 100% correct for lease-v1, it's a workaround for an issue with the Ledger app in the wallet ui
// Once ledger app is fixed, this will no longer be needed
// see the issue: https://github.com/iicc1/ledger-app-lto/issues/3
export const leaseSchemaV1: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.type, // this field shouldn't be here - Ledger workaround
    txFields.senderPublicKey,
    txFields.recipient,
    txFields.amount,
    txFields.fee,
    txFields.timestamp,
  ],
}

// This schema is not 100% correct for cancel-lease-v1, it's a workaround for an issue with the Ledger app in the wallet ui
// Once ledger app is fixed, this will no longer be needed
// see the issue: https://github.com/iicc1/ledger-app-lto/issues/3
export const cancelLeaseSchemaV1: TSchema = {
  type: 'object',
  schema: [
    txFields.type,
    txFields.version,
    txFields.type, // this field shouldn't be here - Ledger workaround
    txFields.senderPublicKey,
    txFields.fee,
    txFields.timestamp,
    txFields.leaseId,
  ],
}

/**
 * Maps transaction types to schemas object. Schemas are written by keys. 0 - no version, n - version n
 */
export const schemasByTypeMap = {
  [TRANSACTION_TYPE.GENESIS]: {},
  [TRANSACTION_TYPE.TRANSFER]: {
    1: transferSchemaV1,
    2: transferSchemaV2,
  },
  [TRANSACTION_TYPE.LEASE]: {
    1: leaseSchemaV1,
    2: leaseSchemaV2,
  },
  [TRANSACTION_TYPE.CANCEL_LEASE]: {
    1: cancelLeaseSchemaV1,
    2: cancelLeaseSchemaV2,
  },
  [TRANSACTION_TYPE.MASS_TRANSFER]: {
    1: massTransferSchemaV1,
  },
  [TRANSACTION_TYPE.DATA]: {
    1: dataSchemaV1,
  },
  [TRANSACTION_TYPE.ANCHOR]: {
    1: anchorSchemaV1,
    3: anchorSchemaV3,
  },
  [TRANSACTION_TYPE.INVOKE_ASSOCIATION]: {
    1: associationSchemaV1,
    3: associationSchemaV3,
  },
  [TRANSACTION_TYPE.REVOKE_ASSOCIATION]: {
    1: associationSchemaV1,
  },
  [TRANSACTION_TYPE.SET_SCRIPT]: {
    1: setScriptSchemaV1,
  },
  [TRANSACTION_TYPE.SPONSOR]: {
    1: sponsorSchemaV1,
  },
  [TRANSACTION_TYPE.CANCEL_SPONSOR]: {
    1: cancelSponsorSchemaV1,
  },
}


export function getTransactionSchema(type: TRANSACTION_TYPE, version?: number): TSchema {
  const schemas = (<any>schemasByTypeMap)[type]
  if (typeof schemas !== 'object') {
    throw new Error(`Incorrect tx type: ${type}`)
  }

  const schema = schemas[version || 0]
  if (typeof schema !== 'object') {
    throw new Error(`Incorrect tx version: ${version}`)
  }

  return schema
}


