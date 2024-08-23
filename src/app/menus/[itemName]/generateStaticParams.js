import menuData from '../../Menu/menu.json';

export async function generateStaticParams() {
  return Object.values(menuData).flat().map(item => ({
    itemName: encodeURIComponent(item.Name),
  }));
}