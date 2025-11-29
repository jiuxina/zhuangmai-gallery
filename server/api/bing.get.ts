export default defineEventHandler(async (event) => {
  try {
    // 请求 Bing 官方接口
    const response: any = await $fetch('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
    
    // 拼接完整的图片 URL
    if (response?.images?.[0]?.url) {
      const imageUrl = 'https://cn.bing.com' + response.images[0].url;
      const copyright = response.images[0].copyright;
      return { 
        url: imageUrl,
        copyright: copyright
      };
    }
    throw new Error('No image found');
  } catch (error) {
    // 如果获取失败，返回空，前端会显示默认背景
    console.error('Bing API Error:', error);
    return { url: '', copyright: '' };
  }
});