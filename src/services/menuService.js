import { menuItems } from '../mocks/menuItems';

// Simula um delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUserMenus = async () => {
  // Simula uma chamada à API com 500ms de delay
  await delay(500);
  return menuItems;
}; 