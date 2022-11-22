export interface Contract {
  address: string;
  name: string;
}

export const contracts: Contract[] = [
  {
    name: 'Bored Ape Yacht Club',
    address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
  },
  {
    name: 'Mutant Ape Yacht Club',
    address: '0x60e4d786628fea6478f785a6d7e704777c86a7c6'
  },
  {
    name: 'Meebits',
    address: '0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7'
  }
];