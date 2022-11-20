import { providers } from 'ethers';

const API_KEY = "3bPyCEffkMJx4OC6UTjiBxN3VAtNX6dy";
let cached_provider:  providers.AlchemyWebSocketProvider | null = null;

export const getProvider = () => {
  if (cached_provider) {
    return cached_provider;
  }
  return cached_provider = providers.AlchemyProvider.getWebSocketProvider("homestead", API_KEY);
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
