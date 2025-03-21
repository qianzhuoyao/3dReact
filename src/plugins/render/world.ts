import { getWindowSingle } from "./../../window/windowSingle";
export const worldCab = () => {
  getWindowSingle().world.step(1 / 60); // 物理世界更新
};
