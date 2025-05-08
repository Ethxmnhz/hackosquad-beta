export type Theme = {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  cardBgColor: string;
  borderColor: string;
};

export const themes: Theme[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    primaryColor: 'rgb(34, 211, 238)', // cyan-400
    accentColor: 'rgb(6, 182, 212)', // cyan-500
    bgColor: 'rgb(3, 7, 18)', // gray-950
    cardBgColor: 'rgb(17, 24, 39)', // gray-900
    borderColor: 'rgb(31, 41, 55)', // gray-800
  },
  {
    id: 'neon-purple',
    name: 'Neon Purple',
    primaryColor: 'rgb(167, 139, 250)', // purple-400
    accentColor: 'rgb(139, 92, 246)', // purple-500
    bgColor: 'rgb(9, 9, 11)', // zinc-950
    cardBgColor: 'rgb(24, 24, 27)', // zinc-900
    borderColor: 'rgb(39, 39, 42)', // zinc-800
  }
];