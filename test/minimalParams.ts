import {
  IAliasParams,
  IBurnParams,
  ICancelLeaseParams, IDataParams, IAnchorParams, IIssueParams,
  ILeaseParams,
  IMassTransferParams, IOrderParams, IReissueParams, ISetScriptParams, ITransferParams,
  TRANSACTION_TYPE,
  ICancelOrderParams
} from '../src/transactions'

export const aliasMinimalParams: IAliasParams = {
  alias: 'MyTestAlias',
}

export const burnMinimalParams: IBurnParams = {
  assetId: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
  quantity: 10000,
}

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

export const orderMinimalParams: IOrderParams = {
  matcherPublicKey: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
  amountAsset: null,
  priceAsset: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
  price: 10000,
  amount: 1233,
  orderType: 'buy',
}

export const cancelOrderMinimalParams: ICancelOrderParams = {
  orderId: '3B3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
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
    '5f9bd255f41be56d3be21493a4ade9d11aa41c4f40de980c1b9d746af5d8f4fc', // someparam
    '1728f26f69f209d1315520b93497b4b87a5f73aab951e82e0dbc6d04ea90c91f', // someparam2
    '195a4b3e727d491294d50ba01d66fabb53ef53f6ec5e0d154714da5b3b348895'  // someparam3
  ],
}

export const reissueMinimalParams: IReissueParams = {
  assetId: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
  quantity: 10000,
  reissuable: false,
}

export const issueMinimalParams: IIssueParams = {
  quantity: 10000,
  name: 'test',
  description: 'tratata',
}

export const transferMinimalParams: ITransferParams = {
  recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  amount: 10000,
}

export const setScriptMinimalParams: ISetScriptParams = {
  script: 'AQa3b8tH',
}

export const minimalParams = {
  [TRANSACTION_TYPE.ISSUE]: issueMinimalParams,
  [TRANSACTION_TYPE.TRANSFER]: transferMinimalParams,
  [TRANSACTION_TYPE.REISSUE]: reissueMinimalParams,
  [TRANSACTION_TYPE.BURN]: burnMinimalParams,
  [TRANSACTION_TYPE.LEASE]: leaseMinimalParams,
  [TRANSACTION_TYPE.CANCEL_LEASE]: cancelLeaseMinimalParams,
  [TRANSACTION_TYPE.ALIAS]: aliasMinimalParams,
  [TRANSACTION_TYPE.MASS_TRANSFER]: massTransferMinimalParams,
  [TRANSACTION_TYPE.DATA]: dataMinimalParams,
  [TRANSACTION_TYPE.ANCHOR]: anchorMinimalParams,
  [TRANSACTION_TYPE.SET_SCRIPT]: setScriptMinimalParams,
}