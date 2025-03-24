import { getWindowSingle } from "../../window/windowSingle";

export const battery = () => {
  getWindowSingle().objects.texture.offset.x -= 0.01;
};
