import { BaseContract, BigNumberish, ContractTransactionResponse } from "ethers";

export interface ContractConfig {
  address: string;
  abi: any[];
}

export interface Contracts {
  stakingContract: ContractConfig;
  tokenContract: ContractConfig;
  liquidityPoolContract: ContractConfig;
  tethContract: ContractConfig;
  depegPoolContract: ContractConfig;
  stableSwapContract: ContractConfig;
  ybContract: ContractConfig;
  dpContract: ContractConfig;
}

export interface ContractAddresses {
  stakingContract: string;
  tokenContract: string;
  liquidityPoolContract: string;
  tethContract: string;
}

export interface IERC20 extends BaseContract {
  balanceOf(address: string): Promise<bigint>;
  approve(spender: string, amount: BigNumberish): Promise<ContractTransactionResponse>;
  transfer(recipient: string, amount: BigNumberish): Promise<ContractTransactionResponse>;
  allowance(owner: string, spender: string): Promise<bigint>;
}

export interface ILiquidityPool extends BaseContract {
  deposit(overrides?: { value: BigNumberish }): Promise<ContractTransactionResponse>;
  withdraw(recipient: string, amount: BigNumberish): Promise<ContractTransactionResponse>;
  sharesForAmount(amount: BigNumberish): Promise<bigint>;
  amountForShare(share: BigNumberish): Promise<bigint>;
  getTotalEtherClaimOf(user: string): Promise<bigint>;
  getTotalPooledEther(): Promise<bigint>;
}

export interface ILPPool extends BaseContract {
  balanceOf(address: string): Promise<bigint>;
  tokens(index: number): Promise<string>;
  totalSupply(): Promise<bigint>;
  getVirtualPrice(): Promise<bigint>;
  balances(index: number): Promise<bigint>;
  addLiquidity(amounts: [BigNumberish, BigNumberish], minShares: BigNumberish): Promise<ContractTransactionResponse>;
  removeLiquidity(shares: BigNumberish, minAmountsOut: [BigNumberish, BigNumberish]): Promise<ContractTransactionResponse>;
  connect(signer: any): ILPPool;
}
