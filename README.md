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

## Example Transactions

1. The user deposits 0.01 $AR to the bridge Arweave wallet, specifying the target Ethereum wallet:
<img width="800" alt="deposit-ar" src="https://user-images.githubusercontent.com/11312/118031554-4acfd700-b32c-11eb-96b1-b2cd9e7fbb5b.png">

2. The bridge picks up the deposited $AR, and mints $wAR into the target Ethereum wallet:
<img width="400" alt="mint-war" src="https://user-images.githubusercontent.com/11312/118031728-7a7edf00-b32c-11eb-8c2d-c7458e6f6ab5.png">

3. The user makes some $wAR transaction on Ethereum; the reamining balance is now 0.005:
<img width="400" alt="eth-transact" src="https://user-images.githubusercontent.com/11312/118032376-3c35ef80-b32d-11eb-98d9-83672a791699.png">

4. The user calls the burn function on the wAR contract:
<img width="800" alt="burn" src="https://user-images.githubusercontent.com/11312/118032752-a2227700-b32d-11eb-9c76-d3c0e287a32c.png">

5. The bridge picks up the burn and releases $AR to the user:
<img width="800" alt="receive-ar" src="https://user-images.githubusercontent.com/11312/118032650-87500280-b32d-11eb-825b-bb14f16cbd43.png">


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
