import type { Breed, Herb, Prescription, DiseaseType, Staff } from "@/types/game";

export const DISEASE_SYMPTOMS: Record<DiseaseType, string[]> = {
  fever: ["体温偏高", "无精打采", "食欲不振", "鼻子发干", "魔力发热"],
  cold: ["流鼻涕", "频繁打喷嚏", "身体发冷", "精神萎靡", "咳嗽"],
  poisoning: ["呕吐", "腹泻", "瞳孔异常", "皮毛变色", "口中异味"],
  fatigue: ["无力", "嗜睡", "反应迟缓", "魔力耗尽", "眼神空洞"],
  fracture: ["肢体肿胀", "行动不便", "触碰尖叫", "骨骼异响", "无法站立"],
  mana_disorder: ["魔力溢出", "无意识施法", "元素暴走", "光环混乱", "魔力失控"],
  curse: ["噩梦连连", "阴影缠身", "运气极差", "眼睛发黑", "体重骤降"],
  parasite: ["瘙痒难忍", "皮毛脱落", "食量暴增但消瘦", "粪便异常", "皮肤凸起"],
  dehydration: ["口干舌燥", "皮肤弹性差", "尿液深黄", "眼窝凹陷", "严重口渴"],
  allergy: ["皮肤红肿", "不停抓挠", "呼吸急促", "眼泪不止", "眼皮肿胀"],
};

export const DISEASE_NAMES: Record<DiseaseType, string> = {
  fever: "灵热症",
  cold: "风寒症",
  poisoning: "灵毒症",
  fatigue: "气虚症",
  fracture: "骨伤症",
  mana_disorder: "灵脉紊乱",
  curse: "咒怨症",
  parasite: "灵虫寄生",
  dehydration: "津液亏损",
  allergy: "灵兽过敏",
};

export const SEVERITY_NAMES = {
  mild: "轻度",
  moderate: "中度",
  severe: "重度",
  critical: "危重",
};

export const WEATHER_NAMES = {
  sunny: "晴",
  cloudy: "阴",
  rainy: "雨",
  stormy: "雷雨",
  misty: "雾",
};

export const SEVERITY_COLORS = {
  mild: "bg-clinic-jade/15 text-clinic-jade border-clinic-jade/30",
  moderate: "bg-clinic-amber/20 text-amber-700 border-clinic-amber/40",
  severe: "bg-clinic-warm/20 text-orange-700 border-clinic-warm/40",
  critical: "bg-clinic-crisis/20 text-clinic-crisis border-clinic-crisis/50",
};

export const SEVERITY_BORDER = {
  mild: "border-clinic-jade/50",
  moderate: "border-clinic-amber/60",
  severe: "border-clinic-warm/60",
  critical: "border-clinic-crisis",
};

export const ELEMENT_NAMES: Record<string, string> = {
  fire: "火",
  water: "水",
  wood: "木",
  thunder: "雷",
  earth: "土",
  light: "光",
  dark: "暗",
  neutral: "无",
};

export const ELEMENT_EMOJI: Record<string, string> = {
  fire: "🔥",
  water: "💧",
  wood: "🌿",
  thunder: "⚡",
  earth: "🪨",
  light: "✨",
  dark: "🌑",
  neutral: "⚪",
};

export const BREEDS: Breed[] = [
  {
    id: "fox_fire",
    name: "赤焰灵狐",
    emoji: "🦊",
    element: "fire",
    rarity: 2,
    description: "毛色火红，尾尖常有火焰跃动。喜温热，耐寒力差。",
    evolutionEmojis: ["🦊", "🦊🔥", "🐺🔥"],
    evolvesAt: 4,
    baseFees: 80,
  },
  {
    id: "dragon_water",
    name: "青鳞幼龙",
    emoji: "🐉",
    element: "water",
    rarity: 4,
    description: "古老龙族后裔，鳞片呈青色，善用水系法术。",
    evolutionEmojis: ["🐉", "🐲", "🐲💧"],
    evolvesAt: 5,
    baseFees: 200,
  },
  {
    id: "cat_wood",
    name: "林间雾猫",
    emoji: "🐱",
    element: "wood",
    rarity: 1,
    description: "栖息于森林深处的神秘猫科灵兽，行踪飘渺。",
    evolutionEmojis: ["🐱", "🐈", "🐈‍⬛🌿"],
    evolvesAt: 3,
    baseFees: 50,
  },
  {
    id: "bird_thunder",
    name: "雷羽雀",
    emoji: "🐦",
    element: "thunder",
    rarity: 2,
    description: "羽翼间常含雷电电流，鸣叫声似雷鸣。",
    evolutionEmojis: ["🐦", "🐦⚡", "🦅⚡"],
    evolvesAt: 4,
    baseFees: 90,
  },
  {
    id: "turtle_earth",
    name: "磐甲玄龟",
    emoji: "🐢",
    element: "earth",
    rarity: 3,
    description: "龟壳坚硬如磐山，寿命极长，行动迟缓但稳如泰山。",
    evolutionEmojis: ["🐢", "🐢🪨", "🐢⛰️"],
    evolvesAt: 5,
    baseFees: 150,
  },
  {
    id: "rabbit_light",
    name: "月光玉兔",
    emoji: "🐰",
    element: "light",
    rarity: 3,
    description: "毛发在月光下会发出柔和光晕，性情温顺。",
    evolutionEmojis: ["🐰", "🐇✨", "🐇🌙"],
    evolvesAt: 4,
    baseFees: 120,
  },
  {
    id: "wolf_dark",
    name: "幽影夜狼",
    emoji: "🐺",
    element: "dark",
    rarity: 4,
    description: "融入黑暗中的神秘狼族灵兽，双眼发出幽蓝光芒。",
    evolutionEmojis: ["🐺", "🐺🌑", "🐕‍🦺🌒"],
    evolvesAt: 5,
    baseFees: 180,
  },
  {
    id: "bear_earth",
    name: "巨力棕熊",
    emoji: "🐻",
    element: "earth",
    rarity: 2,
    description: "体型庞大，力大无穷，平时温和但发怒时极危险。",
    evolutionEmojis: ["🐻", "🐻🪨", "🦍⛰️"],
    evolvesAt: 4,
    baseFees: 110,
  },
  {
    id: "snake_fire",
    name: "赤纹火蟒",
    emoji: "🐍",
    element: "fire",
    rarity: 3,
    description: "身带赤色纹路，体温极高，所过之处草木枯萎。",
    evolutionEmojis: ["🐍", "🐍🔥", "🐲🔥"],
    evolvesAt: 5,
    baseFees: 140,
  },
  {
    id: "frog_water",
    name: "碧潭灵蛙",
    emoji: "🐸",
    element: "water",
    rarity: 1,
    description: "深潭中常见的小灵兽，跳跃能力惊人且皮肤可分泌粘液。",
    evolutionEmojis: ["🐸", "🐸💧", "🦎💧"],
    evolvesAt: 3,
    baseFees: 45,
  },
  {
    id: "butterfly_light",
    name: "幻光蝶",
    emoji: "🦋",
    element: "light",
    rarity: 2,
    description: "翅膀散发梦幻光泽，鳞粉有微弱治愈效果。",
    evolutionEmojis: ["🦋", "🦋✨", "🦋🌈"],
    evolvesAt: 4,
    baseFees: 75,
  },
  {
    id: "pig_light",
    name: "福气金豚",
    emoji: "🐷",
    element: "light",
    rarity: 1,
    description: "金色皮毛胖嘟嘟的小灵兽，据说能带来好运。",
    evolutionEmojis: ["🐷", "🐖✨", "🐗💰"],
    evolvesAt: 3,
    baseFees: 60,
  },
];

export const HERBS: Herb[] = [
  {
    id: "herb_cold",
    name: "冰霜草",
    emoji: "❄️",
    element: "water",
    price: 15,
    description: "生于极寒之地，有清热退火之效。",
  },
  {
    id: "herb_fire",
    name: "赤炎花",
    emoji: "🌺",
    element: "fire",
    price: 18,
    description: "花瓣如火，可温中散寒。",
  },
  {
    id: "herb_wood",
    name: "生命藤",
    emoji: "🌿",
    element: "wood",
    price: 22,
    description: "蕴含强韧生命力，可修补骨骼经脉。",
  },
  {
    id: "herb_pure",
    name: "净灵花",
    emoji: "🌸",
    element: "neutral",
    price: 35,
    description: "稀有药花，可净化毒素与诅咒。",
  },
  {
    id: "herb_energy",
    name: "聚灵果",
    emoji: "🍇",
    element: "light",
    price: 28,
    description: "果实可快速补充魔力与体力。",
  },
  {
    id: "herb_stable",
    name: "定根石粉",
    emoji: "🪨",
    element: "earth",
    price: 20,
    description: "磨粉入药可稳定紊乱的灵脉。",
  },
  {
    id: "herb_light",
    name: "圣光草",
    emoji: "✨",
    element: "light",
    price: 40,
    description: "闪耀着神圣光芒，可驱散邪祟寄生虫。",
  },
  {
    id: "herb_water",
    name: "玉泉露",
    emoji: "💧",
    element: "water",
    price: 12,
    description: "清晨收集的玉泉之水，滋补津液。",
  },
  {
    id: "herb_antidote",
    name: "千毒散",
    emoji: "🍃",
    element: "wood",
    price: 30,
    description: "可解百毒的解毒良药。",
  },
  {
    id: "herb_immune",
    name: "玄黄根",
    emoji: "🥕",
    element: "earth",
    price: 25,
    description: "固本培元，增强灵兽免疫力。",
  },
];

export const PRESCRIPTIONS: Prescription[] = [
  {
    id: "presc_fever",
    disease: "fever",
    name: "退热方",
    herbIds: ["herb_cold", "herb_water", "herb_pure"],
    successRate: 85,
  },
  {
    id: "presc_cold",
    disease: "cold",
    name: "驱寒方",
    herbIds: ["herb_fire", "herb_wood", "herb_water"],
    successRate: 88,
  },
  {
    id: "presc_poisoning",
    disease: "poisoning",
    name: "解毒方",
    herbIds: ["herb_antidote", "herb_pure", "herb_water"],
    successRate: 80,
  },
  {
    id: "presc_fatigue",
    disease: "fatigue",
    name: "补气方",
    herbIds: ["herb_energy", "herb_wood", "herb_light"],
    successRate: 90,
  },
  {
    id: "presc_fracture",
    disease: "fracture",
    name: "接骨方",
    herbIds: ["herb_wood", "herb_immune", "herb_energy"],
    successRate: 82,
  },
  {
    id: "presc_mana",
    disease: "mana_disorder",
    name: "稳脉方",
    herbIds: ["herb_stable", "herb_energy", "herb_pure"],
    successRate: 78,
  },
  {
    id: "presc_curse",
    disease: "curse",
    name: "破咒方",
    herbIds: ["herb_light", "herb_pure", "herb_fire"],
    successRate: 75,
  },
  {
    id: "presc_parasite",
    disease: "parasite",
    name: "驱虫方",
    herbIds: ["herb_light", "herb_antidote", "herb_immune"],
    successRate: 83,
  },
  {
    id: "presc_dehydration",
    disease: "dehydration",
    name: "生津方",
    herbIds: ["herb_water", "herb_wood", "herb_energy"],
    successRate: 92,
  },
  {
    id: "presc_allergy",
    disease: "allergy",
    name: "消敏方",
    herbIds: ["herb_immune", "herb_water", "herb_pure"],
    successRate: 86,
  },
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: "staff_1",
    name: "青鸢",
    title: "初级护理员",
    emoji: "👩‍⚕️",
    skillLevel: 1,
    status: "idle",
    assignedBedId: null,
    dailyWage: 30,
  },
  {
    id: "staff_2",
    name: "白术",
    title: "资深护理员",
    emoji: "👨‍⚕️",
    skillLevel: 2,
    status: "idle",
    assignedBedId: null,
    dailyWage: 50,
  },
];

export const INITIAL_BEDS = [
  { id: "bed_1", name: "一号病床" },
  { id: "bed_2", name: "二号病床" },
  { id: "bed_3", name: "三号病床" },
  { id: "bed_4", name: "四号病床" },
];

export const OWNER_NAMES = [
  "灵溪村的王婶",
  "云渺城的李少侠",
  "翠竹林的老道士",
  "百花谷的花仙子",
  "飞鹰寨的大当家",
  "青云宗的内门弟子",
  "四海商会的少主",
  "山间隐居的药师",
  "灵兽山庄的驯兽师",
  "蓬莱岛的散仙",
  "明月楼的歌姬",
  "镇北关的将军",
  "西湖畔的书生",
  "南疆的蛊婆",
  "东海的渔翁",
];

export const BEAST_NAMES = [
  "小红", "豆豆", "阿毛", "雪球", "团子", "琥珀", "黑炭",
  "灵灵", "月月", "辰辰", "小玄", "青璃", "赤炎", "阿土",
  "花花", "金儿", "银角", "小羽", "萌萌", "糖糖", "布丁",
  "果冻", "毛毛", "白泽", "麒麟", "阿凤", "小龙", "圆圆",
];

export const NOTES_SUCCESS = [
  "恢复得很好，蹦蹦跳跳地离开了。",
  "临别时还回头看了一眼，似乎有些不舍。",
  "痊愈后精神百倍，主人非常感激。",
  "临走时叼来了一束野花送给护理员。",
  "健康出院，还在院子里打了几个滚。",
];

export const NOTES_FAIL = [
  "病情恶化，主人抱走时叹息不已。",
  "治疗效果不佳，灵兽虚弱地离去。",
  "因误诊延误了病情，主人面露愠色。",
  "只得转往大城市的高级诊所求治。",
  "灵兽对这里产生了阴影，不愿再踏入半步。",
];

export const FEEDING_STATEMENTS = [
  {
    lie: "它平时只吃灵谷，从不吃别的。",
    truth: "主人偷偷喂了它一块凡人的糕点，可能因此中毒。",
    questions: ["最近有没有喂过特别的食物？", "有没有可能偷吃了什么？", "最近有没有更换灵食品牌？"]
  },
  {
    lie: "它饭量很好，每顿都吃两大碗。",
    truth: "其实它已经三天没怎么吃东西了，主人怕担责没说。",
    questions: ["食量最近有没有变化？", "有没有挑食的情况？", "有没有呕吐的痕迹？"]
  },
  {
    lie: "只给它喝山泉灵水。",
    truth: "昨天它偷偷喝了池塘里的污水，可能感染了寄生虫。",
    questions: ["有没有喝过不干净的水？", "最近有没有去池塘边玩耍？", "有没有出现腹泻的情况？"]
  },
  {
    lie: "昨天刚喂过补血丹，状态很好。",
    truth: "主人给它喂了过期的丹药，导致它灵力紊乱。",
    questions: ["最近有没有喂过丹药？", "丹药有没有过期？", "有没有出现狂躁的症状？"]
  },
  {
    lie: "它从不乱吃东西。",
    truth: "它在院子里吃了一株不知名的毒草，主人没发现。",
    questions: ["有没有可能误食了什么植物？", "最近有没有去野外？", "有没有出现口吐白沫的情况？"]
  },
];

export const INJURY_STATEMENTS = [
  {
    lie: "它只是不小心摔了一跤，应该没什么大事。",
    truth: "其实是主人训练时下手太重，导致它骨裂严重。",
    questions: ["是怎么受伤的？", "受伤时有没有听到异响？", "受伤后能不能正常行动？"]
  },
  {
    lie: "它的腿只是有点抽筋。",
    truth: "它的腿其实已经骨折三天了，主人一直拖着没带来。",
    questions: ["这种情况持续多久了？", "有没有肿胀的迹象？", "触碰时它会叫吗？"]
  },
  {
    lie: "它只是有点累，休息一下就好。",
    truth: "它参加了地下斗兽场，被打得遍体鳞伤。",
    questions: ["最近有没有参加激烈的活动？", "身上有没有其他伤口？", "有没有异常的瘀青？"]
  },
  {
    lie: "它身上的伤口是和别的灵兽玩耍时弄的。",
    truth: "其实是被主人虐待造成的，主人不敢说实话。",
    questions: ["伤口是什么时候出现的？", "有没有人为造成的痕迹？", "灵兽怕不怕主人？"]
  },
  {
    lie: "它只是有点没精神。",
    truth: "它被邪修的暗劲所伤，经脉受损严重。",
    questions: ["有没有遇到过可疑的人？", "有没有出现灵气紊乱的情况？", "最近有没有做过噩梦？"]
  },
  {
    lie: "它的骨头全碎了！恐怕活不了多久了！",
    truth: "只是皮外擦伤，主人夸大伤势想要优先治疗。",
    questions: ["受伤后它能正常走动吗？", "有没有看到明显的骨折变形？", "它现在还能吃东西吗？"]
  },
  {
    lie: "它快不行了！浑身是血，伤得非常严重！",
    truth: "只是被荆棘划了几道浅口，主人想插队优先看诊。",
    questions: ["伤口深不深？", "有没有大量出血？", "它精神状态怎么样？"]
  },
  {
    lie: "它的伤势恶化了！比昨天严重十倍！",
    truth: "伤势其实正在好转，主人想骗诊所多开些贵重药材。",
    questions: ["昨天和今天相比有什么变化？", "伤口有没有在愈合？", "有没有量过体温？"]
  },
];

export const ONSET_STATEMENTS = [
  {
    lie: "今天早上才发现不对劲的。",
    truth: "其实一周前就有症状了，主人一直忙没在意。",
    questions: ["最早发现异常是什么时候？", "症状是突然出现还是慢慢加重的？", "之前有没有类似的情况？"]
  },
  {
    lie: "昨天还好好的，今天突然就倒下了。",
    truth: "它已经低烧半个月了，主人以为只是普通的灵热。",
    questions: ["最近有没有发烧？", "有没有夜间盗汗的情况？", "有没有逐渐消瘦？"]
  },
  {
    lie: "它的病是昨天突然得的。",
    truth: "它吃了带毒的食物已经三天了，毒性慢慢发作。",
    questions: ["三天前有没有吃过特别的东西？", "有没有呕吐或腹泻过？", "有没有出现过腹痛的迹象？"]
  },
  {
    lie: "它从来没生过病，这是第一次。",
    truth: "它从小就有旧疾，每次发作主人都自己给它喂药。",
    questions: ["以前有没有过类似的症状？", "有没有先天性的疾病？", "平时有没有长期服药？"]
  },
  {
    lie: "从早上到现在才两个时辰。",
    truth: "它已经昏迷了一天一夜，主人害怕了才送来。",
    questions: ["什么时候开始昏迷的？", "昏迷前有没有什么异常？", "有没有尝试过唤醒它？"]
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  feeding: "🍽️ 喂食情况",
  injury: "🩹 伤势描述",
  onset_time: "⏰ 发病时间",
};

export const CATEGORY_ICONS: Record<string, string> = {
  feeding: "🍽️",
  injury: "🩹",
  onset_time: "⏰",
};
