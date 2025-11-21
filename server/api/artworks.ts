// server/api/artworks.ts

const REAL_API_BASE_URL = 'https://api.zhuangmai.cloud/api/gallery';

// 创建一个可重用的“翻译”函数
// 这里增加了对新字段 (hashId, fortune, audioUrl, mockupUrl) 的映射
const formatArtwork = (artwork: any) => {
  if (!artwork || artwork.error) {
    return { error: "Artwork not found" };
  }
  return {
    id: artwork.id,
    title: artwork.user_theme,
    author: artwork.user_name,
    imageUrl: artwork.art_image_url,
    interpretation: artwork.ai_interpretation,
    // 【新增】字段映射
    hashId: artwork.unique_hash,   // 数字指纹
    fortune: artwork.fortune_text, // 赛博占卜
    audioUrl: artwork.audio_url,   // TTS语音
    mockupUrl: artwork.mockup_url  // 文创预览图
  };
};

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  // 统一构建请求URL
  const apiUrl = `${REAL_API_BASE_URL}/list${id ? `?id=${id}` : ''}`;

  try {
    const noCacheUrl = apiUrl + (apiUrl.includes('?') ? '&' : '?') + `_t=${new Date().getTime()}`;
    const data = await $fetch<any>(noCacheUrl);

    if (id) {
      // --- 如果是请求详情，翻译单个对象 ---
      return formatArtwork(data);
    } else {
      // --- 如果是请求列表，翻译数组中的每个对象 ---
      return data.map(formatArtwork);
    }
    
  } catch (error) {
    console.error(`Error fetching from ${apiUrl}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch from the backend service.',
    });
  }
});