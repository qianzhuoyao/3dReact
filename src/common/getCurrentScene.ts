import { getWindowSingle } from "../window/windowSingle";

/**
 * 当前所在场景是机房还是机柜
 *
 * @param   {string}  modelTag  [modelTag description]
 *
 * @return  {[type]}            [return description]
 */
export const getCurrentScene = (modelTag: string) => {
  return getWindowSingle().state.currentLoadImportModels.has(modelTag);
};
