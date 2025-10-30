// server/api/gallery.ts

// 这是我们的模拟数据库
const galleryData = [
  {
    id: 1,
    user_name: '阿明',
    user_theme: '星辰与大海',
    art_image_url: 'https://gallery.00000721.xyz/gallery/demo/1.jpg', // 请替换为真实可访问的图片URL
    ai_interpretation: '这幅作品将星辰的璀璨与海洋的深邃融为一体，色彩大胆而富有想象力，仿佛一场壮丽的宇宙梦境。',
  },
  {
    id: 2,
    user_name: '晓月',
    user_theme: '山间的风',
    art_image_url: 'https://gallery.00000721.xyz/gallery/demo/2.jpg', // 请替换为真实可访问的图片URL
    ai_interpretation: '流动的线条如同山风拂过，带来了草木的清新与自然的律动。配色淡雅，意境悠远，充满了东方美学的禅意。',
  },
  {
    id: 3,
    user_name: 'Traveler',
    user_theme: '赛博都市的霓虹',
    art_image_url: 'https://gallery.00000721.xyz/gallery/demo/3.jpg', // 请替换为真实可访问的图片URL
    ai_interpretation: '传统纹样与未来主义的霓虹光影发生了奇妙的碰撞。强烈的色彩对比和几何构图，展现了文化在未来都市中的新生。',
  },
  // 您可以按此格式添加更多作品...
];

export default defineEventHandler((event) => {
  // 这段代码让我们的模拟API可以根据ID返回单个作品，为后续详情页做准备
  const id = event.context.params?.id ? parseInt(event.context.params.id) : null;
  if (id) {
    const artwork = galleryData.find(item => item.id === id);
    return artwork || { error: 'Artwork not found' };
  }
  
  // 如果没有ID，就返回所有作品
  return galleryData;
});