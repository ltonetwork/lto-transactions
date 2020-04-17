import {
  ICancelLeaseParams,
  IDataParams,
  IAnchorParams,
  IAssociationParams,
  ILeaseParams,
  IMassTransferParams,
  ISetScriptParams,
  ITransferParams,
  TRANSACTION_TYPE, ISponsorParams, ICancelSponsorParams
} from '../src/transactions'

export const leaseMinimalParams: ILeaseParams = {
  recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  amount: 10000,
}

export const cancelLeaseMinimalParams: ICancelLeaseParams = {
  leaseId: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
}

export const massTransferMinimalParams: IMassTransferParams = {
  transfers: [
    {
      recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
      amount: 10000,
    },
    {
      recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
      amount: 10000,
    },
  ],
}

export const dataMinimalParams: IDataParams = {
  data: [
    {
      key: 'someparam',
      value: Uint8Array.from([1, 2, 3, 4]),
    }, {
      key: 'someparam2',
      type: 'binary',
      value: 'base64:YXNkYQ==',
    }, {
      key: 'someparam3',
      value: true,
    },
  ],
}

export const anchorMinimalParams: IAnchorParams = {
  anchors: [
    '7SDYMzGCZVFSwAGs7cFxj2rUBgUB8BVtPnPUuu4itKcX', // someparam
    '2ZQbGRzfGJEihHoDCdS6DTnvrQV9gkj7KdyapmJ1UbXt', // someparam2
    '2hy3qKT5PuhWUxe9ACP4HnxRvxzcRqUommTZX4FQp8BE',  // someparam3
  ],
}

export const associationMinimalParams: IAssociationParams = {
  party: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  associationType: 0,
}

export const transferMinimalParams: ITransferParams = {
  recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  amount: 10000,
}

export const setScriptMinimalParams: ISetScriptParams = {
  script: 'AQa3b8tH',
}

export const sponsorMinimalParams: ISponsorParams = {
  recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
}

export const cancelSponsorMinimalParams: ICancelSponsorParams = {
  recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
}

export const minimalParams = {
  [TRANSACTION_TYPE.TRANSFER]: transferMinimalParams,
  [TRANSACTION_TYPE.LEASE]: leaseMinimalParams,
  [TRANSACTION_TYPE.CANCEL_LEASE]: cancelLeaseMinimalParams,
  [TRANSACTION_TYPE.MASS_TRANSFER]: massTransferMinimalParams,
  [TRANSACTION_TYPE.DATA]: dataMinimalParams,
  [TRANSACTION_TYPE.ANCHOR]: anchorMinimalParams,
  [TRANSACTION_TYPE.SET_SCRIPT]: setScriptMinimalParams,
}
