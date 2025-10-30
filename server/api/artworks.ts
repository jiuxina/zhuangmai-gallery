// 使用一些占位图片和文字来模拟数据
// 图片来源于 Unsplash，仅作示例
const artworks = [
  {
    id: 1,
    title: "凤凰牡丹",
    author: "阿明",
    imageUrl: "/1.png",
    interpretation: "AI解读：此图以凤凰与牡丹为核心，凤凰展翅，象征吉祥与重生；牡丹盛开，寓意富贵与繁荣。整体构图均衡，色彩鲜明，既有传统壮锦的韵味，又融入了现代审美的力量感，是一幅充满希望与生命力的佳作。",
  },
  {
    id: 2,
    title: "太阳蛙纹",
    author: "小雅",
    imageUrl: "/2.png",
    interpretation: "AI解读：作品融合了壮族经典的太阳纹与蛙纹。太阳代表光明与能量，蛙则是生命与丰收的图腾。AI通过细腻的线条重构了这两个古老符号，展现了壮族先民对自然的敬畏与对生命繁衍的期盼。",
  },
  {
    id: 3,
    title: "云雷飞鸟",
    author: "壮乡智造",
    imageUrl: "/3.png",
    interpretation: "AI解读：该作品以流畅的云雷纹为底，描绘了飞鸟翱翔的姿态。云雷象征雨水与恩泽，飞鸟则代表自由与信息的传递。这幅数字艺术品表达了在现代科技的滋养下，传统文化得以跨越时空、自由传播的美好愿景。",
  },
  {
    id: 4,
    title: "几何花卉",
    author: "AI探索者",
    imageUrl: "/4.png",
    interpretation: "AI解读：通过对数千张壮锦纹样的学习，LoRA模型精准地捕捉了其几何化、对称性的构图特征。此图中的花卉并非自然的简单模仿，而是经过高度提炼的艺术符号，展现了壮锦艺术中独特的秩序之美与抽象之美。",
  },
  {
    id: 5,
    title: "龙凤呈祥",
    author: "数字传承人",
    imageUrl: "/5.png",
    interpretation: "AI解读：龙与凤，作为中华民族的经典图腾，在壮锦艺术中亦有体现。此作通过强烈的色彩对比和复杂的线条交织，营造出一种动态的和谐感。它不仅是对传统的致敬，更是AI对“力量”与“优雅”这对永恒主题的现代诠释。",
  },
  {
    id: 6,
    title: "水波锦鲤",
    author: "云端画师",
    imageUrl: "/6.png",
    interpretation: "AI解读：灵感源于壮族对水的亲近。作品用水波纹作为背景，描绘了锦鲤嬉戏的场景，寓意年年有余、生活富足。AI生成的纹理细节丰富，仿佛能感受到织物的质感，完美融合了数字技术的精准与传统手工艺的温度。",
  },
];

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  if (id) {
    const artwork = artworks.find((a) => a.id === parseInt(id as string));
    return artwork || { error: "Artwork not found" };
  }

  return artworks;
});