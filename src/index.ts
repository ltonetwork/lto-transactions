// Copyright (c) 2018 Yuriy Naydenov
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export { massTransfer } from './transactions/mass-transfer'
export { lease } from './transactions/lease'
export { cancelLease } from './transactions/cancel-lease'
export { data } from './transactions/data'
export { anchor } from './transactions/anchor'
export * from './transactions/association'
export { transfer } from './transactions/transfer'
export { setScript } from './transactions/set-script'
export { sponsor }from './transactions/sponsor'
export { cancelSponsor }from './transactions/cancel-sponsor'
export { signTx, broadcast, verify, serialize, addressBalance, addressDataByKey, activeLeases } from './general'
export { waitForTx } from './generic'

// Export interfaces
export {
  ITransaction,
  TTx,
  TTxParams,
  ILeaseTransaction,
  ILeaseParams,
  ICancelLeaseTransaction,
  ICancelLeaseParams,
  ITransferTransaction,
  ITransferParams,
  IMassTransferTransaction,
  IMassTransferParams,
  ISetScriptParams,
  IDataTransaction,
  IDataParams,
  IAnchorTransaction,
  IAnchorParams,
  IAssociationTransaction,
  IAssociationParams,
  ISetScriptTransaction,
  WithId,
  WithSender,
  WithProofs,
} from './transactions'

export {
  TSeedTypes, TOption
} from './types'

// internal libraries access
import * as crypto from '@lto-network/lto-crypto'
import * as marshall from '@lto-network/lto-marshall'

const libs = {
  crypto,
  marshall,
}

import * as seedUtils from './seedUtils'

export {
  libs,
  seedUtils
}
