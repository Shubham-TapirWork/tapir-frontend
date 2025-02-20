import { ethers } from 'ethers';
import contracts from '../contracts/contracts.json';
import { getMetaMaskProvider } from './wallet';
import { IERC20, ILiquidityPool, ILPPool } from './types/contracts';

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

export const getLPPoolContract = () => {
  const provider = getMetaMaskProvider();
  if (!provider) return null;

  const ethersProvider = new ethers.BrowserProvider(provider);
  const contract = new ethers.Contract(
    "0xCA6cede6771Ca07D8D55C1e6040438a9034E37A8",
    [{"inputs":[{"internalType":"address[2]","name":"_tokens","type":"address[2]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256[2]","name":"amounts","type":"uint256[2]"},{"internalType":"uint256","name":"minShares","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"endTrading","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"freezeSwap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getVirtualPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"uint256[2]","name":"minAmountsOut","type":"uint256[2]"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256[2]","name":"amountsOut","type":"uint256[2]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"},{"internalType":"uint256","name":"j","type":"uint256"},{"internalType":"uint256","name":"dx","type":"uint256"},{"internalType":"uint256","name":"minDy","type":"uint256"}],"name":"swap","outputs":[{"internalType":"uint256","name":"dy","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokens","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unfreezeSwap","outputs":[],"stateMutability":"nonpayable","type":"function"}],
    ethersProvider
  ) as unknown as ILPPool;
  
  return contract;
};