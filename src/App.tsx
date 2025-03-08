import { useMemo } from "react";
import { useLoad } from "./hooks/useLoad";

function App() {
  const model = useMemo(
    () => new URL("./model/LittlestTokyo.glb", import.meta.url).href,
    []
  );

  const { setRef, width, height } = useLoad([model]);

  return (
    <div
      ref={setRef}
      style={{
        width: width + "px",
        height: height + "px",
      }}
    ></div>
  );
}

export default App;
