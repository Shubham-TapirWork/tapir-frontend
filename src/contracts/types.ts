export interface ContractConfig {
  address: string;
  abi: any[];
}

export interface Contracts {
  stakingContract: ContractConfig;
  tokenContract: ContractConfig;
  liquidityPoolContract: ContractConfig;
  tethContract: ContractConfig;
}

export interface ContractAddresses {
  stakingContract: string;
  tokenContract: string;
  liquidityPoolContract: string;
  tethContract: string;
}

export interface IERC20 {
  balanceOf(address: string): Promise<bigint>;
  approve(spender: string, amount: bigint): Promise<any>;
  transfer(recipient: string, amount: bigint): Promise<any>;
  allowance(owner: string, spender: string): Promise<bigint>;
}