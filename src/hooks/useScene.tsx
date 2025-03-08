import { getWindowSingle } from "../window/windowSingle";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { useEffect } from "react";

export const useScene = () => {
  useEffect(() => {
    getWindowSingle().threeScene.environment =
      getWindowSingle().threePmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture;
  }, []);
};
