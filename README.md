<p align="center">
  <h3 align="center"><code>wⒶR</code></h3>
  <p align="center">Wrapped AR on Ethereum.</p>
</p>

## Overview

$wAR is an ERC-20 token that maps one-to-one to $AR.

This is enabled by a _custodian_, a (trusted) entity responsible for running a bridge between the networks. It holds $AR and is responsible for minting and burning the equivalent amount of $wAR. Users interact with the bridge when depositing and withdrawing $AR.


## How It Works

### $AR to $wAR

A user first deposits $AR to the bridge Arweave wallet.
Once the deposit has mined, the bridge will pick it up and mint the appropriate amount of $wAR to the provided Ethereum address.
This is made possible via an [ownable ERC20 contract](contracts/contracts/wAR.sol).

![AR -  wAR](https://user-images.githubusercontent.com/62398724/118025206-77e5af00-b357-11eb-91f8-bb490fca0bdb.png)

### $wAR to $AR

A user first burns their $wAR by interacting with the ERC20 contract.
Once the burn has mined, the bridge will pick it up and transfer the appropriate amount of $AR to the provided Arweave address.

![wAR -  AR](https://user-images.githubusercontent.com/62398724/118025289-92b82380-b357-11eb-860e-a8cdf3b6de27.png)

## Interacting with the bridge

To interact with the bridge, you can either use the UI (WIP) or manually
send a transaction to the wallet provided by the bridge. When sending an
$AR transaction make sure to use the following tags:

```
Application: wAR - DEV
Wallet: [YOUR_ETH_ADDRESS]
```

## Keeping the bridge accountable

To keep the bridge accountable, the custodian can buy tokens
from a PSC/DAO and needs to stake them. For every swap, the custodian
recieves fees. When the custodian misbehaves, the staked tokens can be slashed
by the DAO. When the amount of fees and $AR in the wallet exceeds the staked token values,
the custodian needs to buy more tokens.

_Note: This process needs to be implemented_

## Roadmap

- [x] Test on [Ganache](https://www.trufflesuite.com/ganache).
- [ ] Test on [Rinkeby](https://www.rinkeby.io), etc.
- [ ] Deploy on Ethereum mainnet.
- [ ] Build a UI for easy usage.
- [ ] Implement staking

_Disclaimer: KYVE will not run the bridge. We are only providing the technical solution
for $wAR._
