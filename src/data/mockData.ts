import type {
  DashboardData,
  SchoolData,
  GuideMonthlyData,
  MediaMonthlyData,
  CoreMonthlyData,
  Activity,
  SchoolDetail,
  GuideDetail,
} from "@/types";

const SCHOOLS = [
  { name: "北京市第一中学", shortName: "北京一中" },
  { name: "北京市第四中学", shortName: "北京四中" },
  { name: "北京市第八中学", shortName: "北京八中" },
  { name: "清华大学附属中学", shortName: "清华附中" },
  { name: "北京大学附属中学", shortName: "北大附中" },
  { name: "中国人民大学附属中学", shortName: "人大附中" },
  { name: "北京师范大学附属中学", shortName: "北师大附中" },
  { name: "北京市东直门中学", shortName: "东直门中学" },
  { name: "北京市景山学校", shortName: "景山学校" },
  { name: "北京市海淀区实验中学", shortName: "海淀实验" },
];

const GUIDE_NAMES = [
  "张明辉",
  "李小红",
  "王建国",
  "赵雨晴",
  "刘子轩",
  "陈雨桐",
  "杨浩然",
  "周佳怡",
  "吴俊杰",
  "郑思琪",
  "孙文博",
  "马晓燕",
  "朱明宇",
  "胡雅婷",
  "林浩然",
  "何雨欣",
  "高志远",
  "罗梦琪",
  "梁宇轩",
  "宋雨彤",
  "唐浩然",
  "许佳怡",
  "韩俊杰",
  "冯思琪",
];

const GRADES = ["初一", "初二", "初三", "高一", "高二", "高三"];

const TEAM_THEMES = [
  "追寻红色足迹主题研学",
  "缅怀革命先烈清明祭扫",
  "红领巾心向党教育活动",
  "传承红色基因夏令营",
  "爱国主义教育实践活动",
  "重温革命历史研学之旅",
  "纪念建党主题研学活动",
  "国庆红色文化寻访活动",
];

const ACTIVITY_TITLES = [
  "清明祭扫革命先烈活动",
  "红领巾讲解员授牌仪式",
  '"永远跟党走"主题演讲比赛',
  "红色故事进校园巡回宣讲",
  "纪念建党103周年座谈会",
  "青少年红色文化夏令营开营",
  "国庆升旗仪式暨爱国教育活动",
  '"重走长征路"沉浸式体验活动',
  "烈士纪念日公祭活动",
  "新团员入团宣誓仪式",
];

const ACTIVITY_DESCS = [
  "来自多所学校的师生齐聚纪念馆，缅怀革命先烈，传承红色精神。",
  "20名优秀少先队员正式受聘为红领巾讲解员，肩负起传播红色文化的使命。",
  "全市中小学生代表讲述红色故事，抒发爱党爱国情怀。",
  "宣讲团走进校园，为同学们带来生动的红色教育课程。",
  "老党员与青年学生共聚一堂，共话初心使命。",
  "百余名青少年开启红色之旅，在实践中感悟革命精神。",
  "庄严的升旗仪式后，师生共同参观展览，接受爱国主义教育。",
  "通过沉浸式体验，让参与者深切感受长征精神的伟大。",
  "社会各界代表向烈士敬献花篮，表达深切缅怀。",
  "新团员在革命先烈纪念碑前庄严宣誓，立下青春誓言。",
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function generateMonths(): string[] {
  const now = new Date();
  const year = now.getFullYear();
  const months: string[] = [];
  for (let m = 1; m <= 12; m++) {
    months.push(`${year}-${String(m).padStart(2, "0")}`);
  }
  return months;
}

function generateSchoolData(): {
  rankings: SchoolData[];
  details: Record<string, SchoolDetail>;
} {
  const months = generateMonths();
  const rankings: SchoolData[] = [];
  const details: Record<string, SchoolDetail> = {};

  SCHOOLS.forEach((school, idx) => {
    const id = `school-${idx + 1}`;
    const teamCount = randomInt(8, 25);
    const studentCount = teamCount * randomInt(30, 50);
    const guideCount = randomInt(3, 10);
    const guideServiceHours = randomInt(50, 200);

    const schoolData: SchoolData = {
      id,
      name: school.name,
      teamCount,
      studentCount,
      guideCount,
      guideServiceHours,
    };
    rankings.push(schoolData);

    const teams = Array.from({ length: teamCount }, () => ({
      id: generateId(),
      date:
        months[randomInt(0, months.length - 1)] +
        `-${String(randomInt(1, 28)).padStart(2, "0")}`,
      studentCount: randomInt(25, 55),
      theme: TEAM_THEMES[randomInt(0, TEAM_THEMES.length - 1)],
    })).sort((a, b) => b.date.localeCompare(a.date));

    const guides: GuideDetail[] = Array.from(
      { length: guideCount },
      (_, gi) => ({
        id: `guide-${id}-${gi}`,
        name: GUIDE_NAMES[(idx * 3 + gi) % GUIDE_NAMES.length],
        school: school.name,
        grade: GRADES[randomInt(0, GRADES.length - 1)],
        serviceHours: randomInt(
          20,
          Math.floor(guideServiceHours / guideCount) + 10,
        ),
        joinDate:
          months[randomInt(0, 6)] +
          `-${String(randomInt(1, 28)).padStart(2, "0")}`,
      }),
    );

    details[id] = {
      school: schoolData,
      teams,
      guides,
    };
  });

  rankings.sort((a, b) => b.teamCount - a.teamCount);

  return { rankings, details };
}

function generateGuideData(): GuideMonthlyData[] {
  const months = generateMonths();
  let cumulative = 0;
  return months.map((month) => {
    cumulative += randomInt(5, 15);
    return {
      month,
      registeredCount: cumulative,
      serviceHours: randomInt(80, 200),
    };
  });
}

function generateMediaData(): MediaMonthlyData[] {
  const months = generateMonths();
  return months.map((month) => ({
    month,
    videoViews: randomInt(5000, 50000),
    liveViews: randomInt(2000, 30000),
  }));
}

function generateCoreMonthlyData(): CoreMonthlyData[] {
  const months = generateMonths();
  return months.map((month) => ({
    month,
    visits: randomInt(8000, 25000),
    tours: randomInt(150, 500),
  }));
}

function generateActivities(): Activity[] {
  const now = new Date();
  return ACTIVITY_TITLES.map((title, idx) => {
    const date = new Date(now);
    date.setDate(date.getDate() - idx * randomInt(5, 15));
    const dateStr = date.toISOString().split("T")[0];
    return {
      id: `activity-${idx}`,
      title,
      date: dateStr,
      image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent("red revolutionary memorial hall interior with people, solemn atmosphere, red theme, documentary photography style")}&image_size=landscape_16_9`,
      description: ACTIVITY_DESCS[idx],
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export function generateMockData(): DashboardData {
  const { rankings, details } = generateSchoolData();
  const coreMonthlyData = generateCoreMonthlyData();
  const totalVisits = coreMonthlyData.reduce((sum, m) => sum + m.visits, 0);
  const totalTours = coreMonthlyData.reduce((sum, m) => sum + m.tours, 0);

  return {
    coreStats: {
      totalVisits,
      totalTours,
      visitsYoY: randomInt(8, 25),
      toursYoY: randomInt(5, 20),
    },
    coreMonthlyData,
    schoolRankings: rankings,
    guideData: generateGuideData(),
    mediaData: generateMediaData(),
    martyrProgress: {
      confirmed: randomInt(60, 85),
      total: 100,
    },
    activities: generateActivities(),
    schoolDetails: details,
    lastGenerated: new Date().toISOString(),
    dataVersion: "1.0",
  };
}
