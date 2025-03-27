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
  0.25, 0.4, 0.51, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7,
  1.8, 1.9, 2, 2.1, 2.2,
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

