export const CATEGORIES = [
    "C",
    "CSS",
    "Git",
    "Haskell",
    "Java",
    "LaTeX",
    "MySQL",
    "Python",
    "R",
    "React",
    "Spring",
    "Spring Cloud",
    "国学",
    "密码学",
    "强化学习",
    "数学",
    "机器学习",
    "游戏王",
    "算法",
    "统计",
    "设计模式"
];

export const CATEGORY_NETWORK = {
    "Java": ["Spring"],
    "Spring": ["Java", "Spring Cloud"],
    "Spring Cloud": ["Spring"],
    "机器学习": ["统计", "强化学习"],
    "数学": ["统计", "密码学"],
    "统计": ["机器学习", "数学", "R"],
    "R": ["统计"],
    "密码学": ["数学"],
    "强化学习": ["机器学习"]
}
