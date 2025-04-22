export const RESUME_INTERSECTION = Symbol("resumeIntersection");
export const PAUSE_INTERSECTION = Symbol("pauseIntersection");
export const selectedTag = new URL("../assets/tag.png", import.meta.url).href;
export const unSelectedTag = new URL("../assets/grayTag.png", import.meta.url)
  .href;
export const alertSelectTag = new URL(
  "../assets/alertTooltip.png",
  import.meta.url
).href;

export const VISIBLE_WHITE = ["bg"];

export const deviceLevel = [
  0.14, 0.185, 0.225, 0.265, 0.305, 0.345, 0.385, 0.425, 0.465, 0.505, 0.545,
  0.585, 0.625, 0.665, 0.705, 0.745, 0.785, 0.825, 0.865, 0.905, 0.945, 0.985,
  1.025, 1.065, 1.105, 1.145, 1.185, 1.225, 1.265, 1.305, 1.345, 1.385, 1.425,
  1.465, 1.505, 1.545, 1.585, 1.625, 1.665, 1.705, 1.745, 1.785, 1.825, 1.865,
  1.905, 1.945, 1.985, 2.025, 2.065, 2.105, 2.145, 2.185, 2.225, 2.265, 2.305,
  2.345, 2.385, 2.425, 2.465, 2.505, 2.545, 2.585, 2.625, 2.665,
];

//线路对应关系
export const lineMap = [
  {
    start: {
      floor: 1,
      name: "1",
    },
    target: {
      floor: 1,
      name: "48",
    },
  },
  {
    start: {
      floor: 1,
      name: "48",
    },
    target: {
      floor: 1,
      name: "1",
    },
  },
];
