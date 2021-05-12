# wAR

## Wrapped AR on Ethereum

### How it works

#### AR to wAR

A user can transfer AR to the bridge arweave account. Inside the transaction
he specifies a ETH wallet where he wants to recieve the wAR tokens.
The bridge then mints wAR the ETH address via an [ownable ERC20 contract](contracts/contracts/wAR.sol).

#### wAR to AR

A user burns his wAR on the ERC20 contract. The bridge catches the burn event and sends the amount AR
to the users Arweave address.

### Interacting with the bridge
To interact with the bridge you can either use the UI (WIP) or manually
send a transaction to the wallet provided by the bridge. When sending an
AR transaction make sure to set the following on your transaction:
```
Application: wAR - DEV
Wallet: [YOUR_ETH_ADDRESS]
```

### ToDo's

- [x] test on ganache
- [ ] test on eth testnet
- [ ] deploy to mainnet
- [ ] build a UI for easy usage

_Disclaimer: KYVE will not run the bridge. We are only providing the technical solution
for wAR_
