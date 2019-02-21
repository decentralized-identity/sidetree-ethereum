# Sidetree Ethereum

[![Build Status](https://travis-ci.org/decentralized-identity/sidetree-ethereum.svg?branch=master)](https://travis-ci.org/decentralized-identity/sidetree-ethereum)


Sidetree Ethereum is a REST API that supports anchoring of Sidetree Transactions to the Ethereum Blockchain.

Sidetree Ethereum is meant to be used with `sidetree-core` and `sidetree-ipfs`.

See the mono repo for integration tests... COMING SOON.

A Sidetree Transaction is a JSON Document of the following format:

```json
{
  "transactionTime": 53,
  "transactionTimeHash": "0xa6dd7120730ddccf4788a082b0b5607fd1f39dbb80ebc170678551878b90b835",
  "transactionNumber": 15,
  "anchorFileHash": "QmcModh3cTgSpr8A6m7jNHnwVZRGZsepWv3uaFtD5KhL2U"
}
```

The `anchorFileHash` is a multihash content address for an anchor file of the following format:

```json
{
  "batchFileHash": "QmcModh3cTgSpr8A6m7jNHnwVZRGZsepWv3uaFtD5KhL3U",
  "merkleRoot": "b6dd7120730ddccf4788a082b0b5607fd1f39dbb80ebc170678551878b90b836"
}
```

The `batchFileHash` is a multihash content address for a batch file of the following format:

```json
{
  "operations": [
    "eyJzaWduaW5nS2V5SWQiOiJrZXkxIiwiY3JlYXRlUGF5bG9hZCI6ImV5SkFZMjl1ZEdWNGRDSTZJbWgwZEhCek9pOHZkek5wWkM1dmNtY3ZaR2xrTDNZeElpd2lhV1FpT2lKa2FXUTZjMmxrWlhSeVpXVTZhV2R1YjNKbFpDSXNJbkIxWW14cFkwdGxlU0k2VzNzaWFXUWlPaUpyWlhreElpd2lkSGx3WlNJNklsTmxZM0F5TlRack1WWmxjbWxtYVdOaGRHbHZia3RsZVRJd01UZ2lMQ0p3ZFdKc2FXTkxaWGxJWlhnaU9pSXdNamMyWXpJek5EZ3dNelU0TWpJeE9EZ3dPVFkwTlRWaU4yWXpaakprTlRaaE5HSmhZbVU0WkRka09UZGpZMlF5TmpnMVl6VXdZbVJpTXpVNFpHUmlOekVpZlN4N0ltbGtJam9pWkdsa09uTnBaR1YwY21WbE9tUnBaRkJ2Y25ScGIyNUpaMjV2Y21Wa0kydGxlVElpTENKMGVYQmxJam9pVW5OaFZtVnlhV1pwWTJGMGFXOXVTMlY1TWpBeE9DSXNJbTkzYm1WeUlqb2laR2xrT25OcFpHVjBjbVZsT21sbmJtOXlaV1JWYm14bGMzTlNaWE52YkhaaFlteGxJaXdpY0hWaWJHbGpTMlY1VUdWdElqb2lMUzB0TFMxQ1JVZEpUaUJRVlVKTVNVTWdTMFZaTGpJdVJVNUVJRkJWUWt4SlF5QkxSVmt0TFMwdExTSjlYU3dpYzJWeWRtbGpaU0k2VzNzaWRIbHdaU0k2SWtsa1pXNTBhWFI1U0hWaUlpd2ljSFZpYkdsalMyVjVJam9pWkdsa09uTnBaR1YwY21WbE9tbG5ibTl5WldRamEyVjVMVEVpTENKelpYSjJhV05sUlc1a2NHOXBiblFpT25zaVFHTnZiblJsZUhRaU9pSnpZMmhsYldFdWFXUmxiblJwZEhrdVptOTFibVJoZEdsdmJpOW9kV0lpTENKQWRIbHdaU0k2SWxWelpYSlRaWEoyYVdObFJXNWtjRzlwYm5RaUxDSnBibk4wWVc1alpYTWlPbHNpWkdsa09tSmhjam8wTlRZaUxDSmthV1E2ZW1GNk9qYzRPU0pkZlgxZGZRIiwic2lnbmF0dXJlIjoibnFTNDNLeTNYUjBmanRQTHFVaHpTRWhKLWlUbEJ0ZXdGdDl1dDN3YVhyMWhaRTRQSy1VcXZEYzlzVUtscTZNX0hDdHkxVkM1U1Fpa0FPVlRPN3JnRkEiLCJwcm9vZk9mV29yayI6InByb29mIG9mIHdvcmsifQ"
  ]
}
```

The `merkleRoot` is used prove that a given operation is included in a batch. See [here](https://github.com/decentralized-identity/sidetree-core/blob/master/docs/protocol.md#anchor-file-schema)

## Development Commands

```
. ./env
npm run start-ganache
npm run contracts:test
npm run contracts:migrate:dev
npm run test
```