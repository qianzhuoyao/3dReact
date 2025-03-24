import { useCallback, useMemo } from "react";
import { useLoad } from "./hooks/useLoad";
import { useWindowSize } from "react-use";
import { Switch } from "@heroui/switch";
import "./App.css";
import { HeroUIProvider } from "@heroui/react";
function App() {
  const { width, height } = useWindowSize();

  const cabinetAndDeviceModel = useMemo(
    () => new URL("./model/untitled.glb", import.meta.url).href,
    []
  );

  const model = useMemo(
    () => new URL("./model/1.glb", import.meta.url).href,
    []
  );
  // const modelB = useMemo(
  //   () => new URL("./model/2.glb", import.meta.url).href,
  //   []
  // );

  const { setRef, back, currentModelState, setRotatable, showTag,showCable } = useLoad([
    {
      model,
      tag: "modelA",
    },
    {
      model: cabinetAndDeviceModel,
      tag: "cabinetAndDeviceModel",
    },
  ]);

  const onHandleBack = useCallback(() => {
    back();
  }, [back]);

  return (
    <HeroUIProvider>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
        }}
      >
        {currentModelState.includes("cabinetAndDeviceModel") ? (
          <svg
            onClick={onHandleBack}
            className="cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="#e0e9e8"
              d="m4 10l-.354.354L3.293 10l.353-.354zm16.5 8a.5.5 0 0 1-1 0zM8.646 15.354l-5-5l.708-.708l5 5zm-5-5.708l5-5l.708.708l-5 5zM4 9.5h10v1H4zM20.5 16v2h-1v-2zM14 9.5a6.5 6.5 0 0 1 6.5 6.5h-1a5.5 5.5 0 0 0-5.5-5.5z"
            />
          </svg>
        ) : (
          <></>
        )}
        <div className="icon-list">
          {currentModelState.includes("cabinetAndDeviceModel") ? (
            <></>
          ) : (
            <div className="flex flex-col">
              <Switch
                defaultSelected
                color="success"
                onChange={(e) => {
                  setRotatable(e.target.checked);
                }}
                endContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="#93beda"
                      fill-rule="evenodd"
                      d="M8 1.5a6.5 6.5 0 0 1 2.709.59L9.552 3.245A5 5 0 0 0 8 3a4.98 4.98 0 0 0-3.57 1.5h1.32a.75.75 0 0 1 0 1.5h-3A.75.75 0 0 1 2 5.25v-3a.75.75 0 1 1 1.5 0v1.06A6.48 6.48 0 0 1 8 1.5m4.026 3.534l-6.991 6.992C5.865 12.638 6.89 13 8 13a4.98 4.98 0 0 0 3.57-1.5h-1.32a.75.75 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-1.06A6.48 6.48 0 0 1 8 14.5a6.47 6.47 0 0 1-4.035-1.404l-.935.934a.75.75 0 0 1-1.06-1.06l11-11a.75.75 0 0 1 1.06 1.06l-.934.935a6.47 6.47 0 0 1 1.349 3.184a.75.75 0 1 1-1.488.194a5 5 0 0 0-.93-2.309M3.043 8.657q.061.463.203.895L2.09 10.708a6.5 6.5 0 0 1-.534-1.857a.75.75 0 0 1 1.487-.194"
                      clip-rule="evenodd"
                    />
                  </svg>
                }
                size="sm"
                startContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#e0e9e8"
                      d="M19 8l-4 4h3c0 3.31-2.69 6-6 6c-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6c1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4l4-4H6z"
                    >
                      <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        dur="5s"
                        from="360 12 12"
                        repeatCount="indefinite"
                        to="0 12 12"
                        type="rotate"
                      />
                    </path>
                  </svg>
                }
              >
                <span className="text-white">旋转</span>
              </Switch>
              <Switch
                className="mt-1"
                defaultSelected
                color="success"
                onChange={(e) => {
                  showTag(e.target.checked);
                }}
                endContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#93beda"
                      d="M6.5 5A1.5 1.5 0 1 0 8 6.5A1.5 1.5 0 0 0 6.5 5m0 0A1.5 1.5 0 1 0 8 6.5A1.5 1.5 0 0 0 6.5 5m11.83 3.5l4.59-4.58L21.5 2.5l-19 19l1.42 1.42l4.58-4.59l3.09 3.09A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42M13 20l-3.08-3.08l7-7L20 13M5.61 15.43L7 14l-3-3V4h7l3.06 3.06l1.41-1.4l-3.06-3.08A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42M5 6.5A1.5 1.5 0 1 0 6.5 5A1.5 1.5 0 0 0 5 6.5"
                    />
                  </svg>
                }
                size="sm"
                startContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#e0e9e8"
                      d="m21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42M13 20l-9-9V4h7l9 9M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5"
                    />
                  </svg>
                }
              >
                <span className="text-white">标签</span>
              </Switch>
              <Switch
                className="mt-1"
                defaultSelected
                color="success"
                onChange={(e) => {
                  showCable(e.target.checked);
                }}
                endContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="#93beda"
                      d="M5.15 3.15a.5.5 0 0 1 .707 0l2.15 2.15l2.15-2.15a.5.5 0 0 1 .707.707l-2.15 2.15l2.15 2.15a.5.5 0 0 1-.707.707l-2.15-2.15l-2.15 2.15a.5.5 0 0 1-.707-.707l2.15-2.15l-2.15-2.15a.5.5 0 0 1 0-.707M9 13a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
                    />
                  </svg>
                }
                size="sm"
                startContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#e0e9e8"
                      d="M3 19v-5h2V7q0-1.65 1.175-2.825T9 3t2.825 1.175T13 7v10q0 .825.588 1.413T15 19t1.413-.587T17 17v-7h-2V5h1V3h4v2h1v5h-2v7q0 1.65-1.175 2.825T15 21t-2.825-1.175T11 17V7q0-.825-.587-1.412T9 5t-1.412.588T7 7v7h2v5H8v2H4v-2z"
                    />
                  </svg>
                }
              >
                <span className="text-white">线缆</span>
              </Switch>
            </div>
          )}
        </div>
      </div>

      <div
        ref={setRef}
        style={{
          width: width + "px",
          height: height + "px",
        }}
      ></div>
    </HeroUIProvider>
  );
}

export default App;
