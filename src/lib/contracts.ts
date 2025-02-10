import { ethers } from 'ethers';
import contracts from '../contracts/contracts.json';
import { getMetaMaskProvider } from './wallet';
import { IERC20, ILiquidityPool } from './types/contracts';

export const getTethContract = () => {
  const provider = getMetaMaskProvider();
  if (!provider) return null;

  const ethersProvider = new ethers.BrowserProvider(provider);
  const contract = new ethers.Contract(
    contracts.tethContract.address,
    contracts.tethContract.abi,
    ethersProvider
  ) as unknown as IERC20;
  
  return contract;
};

export const getLiquidityPoolContract = () => {
  const provider = getMetaMaskProvider();
  if (!provider) return null;

  const ethersProvider = new ethers.BrowserProvider(provider);
  console.log("Creating liquidity pool contract with address:", contracts.liquidityPoolContract.address);
  
  const contract = new ethers.Contract(
    contracts.liquidityPoolContract.address,
    contracts.liquidityPoolContract.abi,
    ethersProvider
  ) as unknown as ILiquidityPool;

  return contract;
};