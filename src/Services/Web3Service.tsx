import {ethers, providers} from 'ethers';

const API_KEY = "3bPyCEffkMJx4OC6UTjiBxN3VAtNX6dy";

const ERC721ABI = [
  'function tokenURI(uint256 _tokenId) external view returns (string)',
  'event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId)',
];

// let cached_provider:  providers.AlchemyWebSocketProvider | null = null;
let cached_provider:  providers.JsonRpcProvider | null = null;

export const getProvider = () => {
  if (cached_provider) {
    return cached_provider;
  }
  // return cached_provider = providers.AlchemyProvider.getWebSocketProvider("homestead", API_KEY);
  return cached_provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
};

export const getBlockNumber = async () => {
  return await getProvider().getBlockNumber();
}

export const sleep = async (milliseconds: number) => {
  return new Promise(resolver => setTimeout(resolver, milliseconds));
}

export const updateBlockNumber = async (setter: Function, milliseconds: number) => {
  let keepGoing = true;

  const fetchBlockNumber = async () => {
    setter(await getBlockNumber());
  }

  const fetchForever = async () => {
    while (keepGoing) {
      await fetchBlockNumber();
      await sleep(milliseconds);
    }
  }
  fetchForever().catch(console.error);

  // Return a function that when called will stop the infinite loop.
  return () => {
    keepGoing = false;
  }
}

export const getContract = (address: string) => {
  return new ethers.Contract(
    address,
    ERC721ABI,
    getProvider()
  );
}

export const normalizeAddress = (address: string) => {
  return ethers.utils.hexZeroPad(ethers.utils.hexStripZeros(address), 20);
}

export interface NFTResult {
  fromAddress: string,
  toAddress: string,
  token: string,
  transactionHash: string,
  blockNumber: number,
  imageURL: string,
  name: string,
}

export const getIPFSGatewayURL = (url = "") => {
  return `https://ipfs.io/ipfs/${url.slice(7)}`;
}

export const getTokenURI = async (contract: ethers.Contract, tokenId: string) => {
  let url = await contract.tokenURI(ethers.BigNumber.from(tokenId))
  if (url.startsWith('ipfs://')) {
    url = getIPFSGatewayURL(url);
  }
  const response = await fetch(url, { mode: 'cors'});
  let {image: imageURL} = await response.json();
  if (imageURL.startsWith('ipfs://')) {
    imageURL = getIPFSGatewayURL(imageURL);
    const result = await fetch(imageURL);
    return URL.createObjectURL(await result.blob());
  }
  return imageURL;
}

export const scanBlockchain = async (address: string, blocksBack: number = 1000): Promise<NFTResult[]> => {
  const ERC721Contract = getContract(address);
  const transferFilter = ERC721Contract.filters.Transfer(null, null);
  // @ts-ignore
  transferFilter.fromBlock = (await getBlockNumber()) - blocksBack;
  const transferLogs = await getProvider().getLogs(transferFilter);

  return await Promise.all(transferLogs.map(async (log) => {
    const { topics, transactionHash, blockNumber } = log;
    const token = ethers.utils.hexStripZeros(topics[3]);
    return {
      fromAddress: normalizeAddress(topics[1]),
      toAddress: normalizeAddress(topics[2]),
      token,
      transactionHash,
      blockNumber,
      imageURL: await getTokenURI(ERC721Contract, token),
      name: `#${parseInt(token)}`,
    }
  }));
}