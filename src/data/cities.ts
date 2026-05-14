export const CITIES = [
  { id: '1', name: '北京', englishName: 'Beijing', continent: '亚洲', x: 75, y: 35, image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '2', name: '东京', englishName: 'Tokyo', continent: '亚洲', x: 85, y: 38, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '3', name: '巴黎', englishName: 'Paris', continent: '欧洲', x: 48, y: 30, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '4', name: '伦敦', englishName: 'London', continent: '欧洲', x: 45, y: 25, image: 'https://images.unsplash.com/photo-1513635269975-5969336ac1cb?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '5', name: '纽约', englishName: 'New York', continent: '美洲', x: 25, y: 35, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '6', name: '洛杉矶', englishName: 'Los Angeles', continent: '美洲', x: 12, y: 40, image: 'https://images.unsplash.com/photo-1580659324482-15f1064d7c07?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '7', name: '悉尼', englishName: 'Sydney', continent: '大洋洲', x: 88, y: 75, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '8', name: '里约热内卢', englishName: 'Rio de Janeiro', continent: '美洲', x: 32, y: 70, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '9', name: '开普敦', englishName: 'Cape Town', continent: '非洲', x: 52, y: 75, image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '10', name: '开罗', englishName: 'Cairo', continent: '非洲', x: 55, y: 40, image: 'https://images.unsplash.com/photo-1539667468225-eebb663053e6?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '11', name: '莫斯科', englishName: 'Moscow', continent: '欧洲', x: 60, y: 22, image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '12', name: '迪拜', englishName: 'Dubai', continent: '亚洲', x: 62, y: 45, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '13', name: '新加坡', englishName: 'Singapore', continent: '亚洲', x: 75, y: 58, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '14', name: '罗马', englishName: 'Rome', continent: '欧洲', x: 50, y: 35, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=400&h=300' },
  { id: '15', name: '多伦多', englishName: 'Toronto', continent: '美洲', x: 22, y: 30, image: 'https://images.unsplash.com/photo-1507992781348-310259076fe0?auto=format&fit=crop&q=80&w=400&h=300' },
];

// Group cities by continent
export const CITIES_BY_CONTINENT = CITIES.reduce((acc, city) => {
  if (!acc[city.continent]) {
    acc[city.continent] = [];
  }
  acc[city.continent].push(city);
  return acc;
}, {} as Record<string, typeof CITIES>);
