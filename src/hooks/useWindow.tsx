import { useEffect } from "react";
import { windowSingle } from "../window/windowSingle";

export const useWindow = () => {
  useEffect(() => {
    windowSingle();
  }, []);
};
