import { useParams } from "react-router-dom";
import { useModelDetails } from "../hooks/useLoadDetails";
import { useWindowSize } from "react-use";
import { useMemo } from "react";

export const ModelDetail = () => {
  const { id } = useParams(); // 读取 URL 参数
  console.log(id,'cscscsc');
  const { width, height } = useWindowSize();
  const model = useMemo(
    () => new URL("./model/1.glb", import.meta.url).href,
    []
  );

  const { setRef } = useModelDetails([model]);

  return (
    <div
      ref={setRef}
      style={{
        width: width + "px",
        height: height + "px",
      }}
    ></div>
  );
};
