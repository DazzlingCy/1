export const CITIES = [
  { id: '1', name: '杭州', englishName: 'Hangzhou', continent: '中国', x: 75, y: 36, image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&q=80&w=400&h=300', routes: 14, spots: 92, completed: 0 },
  { id: '2', name: '北京', englishName: 'Beijing', continent: '中国', x: 75, y: 35, image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=400&h=300', routes: 26, spots: 252, completed: 0 },
  { id: '3', name: '上海', englishName: 'Shanghai', continent: '中国', x: 76, y: 34, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=400&h=300', routes: 14, spots: 83, completed: 0 },
  { id: '4', name: '南京', englishName: 'Nanjing', continent: '中国', x: 75, y: 34.5, image: 'https://images.unsplash.com/photo-1582650073289-53b52a1fe182?auto=format&fit=crop&q=80&w=400&h=300', routes: 12, spots: 71, completed: 0 },
  { id: '5', name: '西安', englishName: 'Xi\'an', continent: '中国', x: 73, y: 35, image: 'https://images.unsplash.com/photo-1508804185872-d7bad800f13e?auto=format&fit=crop&q=80&w=400&h=300', routes: 11, spots: 66, completed: 0 },
  { id: '6', name: '东京', englishName: 'Tokyo', continent: '亚洲其他', x: 85, y: 38, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400&h=300', routes: 18, spots: 120, completed: 0 },
  { id: '7', name: '巴黎', englishName: 'Paris', continent: '欧洲', x: 48, y: 30, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400&h=300', routes: 15, spots: 90, completed: 0 },
  { id: '8', name: '伦敦', englishName: 'London', continent: '欧洲', x: 45, y: 25, image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&q=80&w=400&h=300', routes: 22, spots: 140, completed: 0 },
  { id: '9', name: '纽约', englishName: 'New York', continent: '北美洲', x: 25, y: 35, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=400&h=300', routes: 20, spots: 110, completed: 0 },
  { id: '10', name: '悉尼', englishName: 'Sydney', continent: '大洋洲', x: 88, y: 75, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=400&h=300', routes: 10, spots: 85, completed: 0 },
  { id: '11', name: '里约热内卢', englishName: 'Rio', continent: '南美洲', x: 32, y: 70, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=400&h=300', routes: 8, spots: 50, completed: 0 },
  { id: '12', name: '开罗', englishName: 'Cairo', continent: '非洲', x: 55, y: 40, image: 'https://images.unsplash.com/photo-1539667468225-eebb663053e6?auto=format&fit=crop&q=80&w=400&h=300', routes: 9, spots: 60, completed: 0 },
];

export const CONTINENTS_ORDER = ['中国', '亚洲其他', '欧洲', '非洲', '北美洲', '南美洲', '大洋洲'];

// Group cities by continent
export const CITIES_BY_CONTINENT = CITIES.reduce((acc, city) => {
  if (!acc[city.continent]) {
    acc[city.continent] = [];
  }
  acc[city.continent].push(city);
  return acc;
}, {} as Record<string, typeof CITIES>);
