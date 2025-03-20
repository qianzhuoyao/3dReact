import { useMemo } from "react";
import { useLoad } from "./hooks/useLoad";
import { useWindowSize } from "react-use";
import "./App.css";

function App() {
  const { width, height } = useWindowSize();
  const model = useMemo(
    () => new URL("./model/1.glb", import.meta.url).href,
    []
  );
  const modelB = useMemo(
    () => new URL("./model/2.glb", import.meta.url).href,
    []
  );

  const { setRef } = useLoad([
    {
      model,
      tag: "modelA",
    },
    {
      model: modelB,
      tag: "modelB",
    },
  ]);

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
