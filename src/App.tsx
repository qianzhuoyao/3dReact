import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLoad } from "./hooks/useLoad";
import { useWindowSize } from "react-use";
import { Switch } from "@heroui/switch";
import "./App.css";
import { HeroUIProvider } from "@heroui/react";
import * as echarts from "echarts";
import leftTitle from "./assets/智慧机房可视化运维平台/标题框.png";
import rightTitle from "./assets/智慧机房可视化运维平台/标题2.png";
import leftBg from "./assets/智慧机房可视化运维平台/背景.png";
import title from "./assets/智慧机房可视化运维平台/智慧机房可视化运维平台.png";
import leftTitleIcon from "./assets/智慧机房可视化运维平台/图标1.png";
import rightTitleIcon from "./assets/智慧机房可视化运维平台/Group 1321316521.png";

import wd from "./assets/智慧机房可视化运维平台/温度.png";
import cpu from "./assets/智慧机房可视化运维平台/CPU.png";
import mem from "./assets/智慧机房可视化运维平台/内存.png";
import delay from "./assets/智慧机房可视化运维平台/延时.png";

import alertTime from "./assets/智慧机房可视化运维平台/告警时间.png";
import alertCount from "./assets/智慧机房可视化运维平台/告警总数.png";

function App() {
  const { width, height } = useWindowSize();

  const chart = useRef(null);

  const cabinetAndDeviceModel = useMemo(
    () => new URL("./model/untitled.glb", import.meta.url).href,
    []
  );

  const lineDevice = useMemo(
    () => new URL("./model/lineDevice.glb", import.meta.url).href,
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

  const { setRef, back, currentModelState, setRotatable, showTag, showCable } =
    useLoad([
      {
        model,
        tag: "modelA",
      },
      {
        model: lineDevice,
        tag: "lineDevice",
      },
      {
        model: cabinetAndDeviceModel,
        tag: "cabinetAndDeviceModel",
      },
    ]);

  useEffect(() => {
 
    if (chart.current) {
      const myChart = echarts.init(chart.current);
      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: false,
          // top: "5%",
          // left: "center",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],

            // adjust the start and end angle
            startAngle: 0,
            endAngle: 360,
            data: [
              { value: 1048, name: "信息" },
              { value: 735, name: "告警" },
              { value: 580, name: "一般" },
              { value: 484, name: "严重" },
              { value: 300, name: "紧急" },
            ],
          },
        ],
      };

      myChart.setOption(option);
    }
  }, [currentModelState]);

  const onHandleBack = useCallback(() => {
    back();
  }, [back]);

  return (
    <HeroUIProvider>
      <div
        className="w-full absolute top-0 left-0"
        style={{
          height: "80px",
        }}
      >
        <img src={title} alt="" className="w-full h-full" />
      </div>
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "40px",
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

      {currentModelState.includes("cabinetAndDeviceModel") ? (
        <div
          className="absolute w-full h-full"
          style={{
            pointerEvents: "none",
          }}
        >
          <div
            className="relative"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <div
              className="absolute"
              style={{
                backgroundImage: `url(${leftBg})`,
                backgroundSize: "100% 100%",
                left: "200px",
                width: "300px",
                height: "fit-content",
                top: "30%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  paddingLeft: "10px",
                  alignItems: "center",
                  backgroundImage: `url(${leftTitle})`,
                  backgroundSize: "100% 100%",
                  width: "100%",
                  height: "50px",
                }}
              >
                <img
                  src={leftTitleIcon}
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                ></img>
                <span
                  style={{
                    paddingLeft: "5px",
                    color: "#f7e4e0",
                  }}
                >
                  设备基础信息
                </span>
              </div>

              <div
                style={{
                 
                  padding: "10px",
                }}
              >
                {[
                  {
                    label: "基础设备信息",
                    value: "ccc-s0-1",
                  },
                  {
                    label: "设备类型",
                    value: "服务器",
                  },
                  {
                    label: "设备IP地址",
                    value: "18.15.1.1",
                  },
                  {
                    label: "制造商",
                    value: "浪潮",
                  },
                  {
                    label: "设备信息",
                    value: "CS402",
                  },
                  {
                    label: "设备序列号",
                    value: "12033-01454",
                  },
                  {
                    label: "设备高度",
                    value: "1",
                  },
                  {
                    label: "所属机柜",
                    value: "1-1",
                  },
                  {
                    label: "安装u位",
                    value: "25",
                  },
                ].map((item) => {
                  return (
                    <div key={item.label}>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {item.label}
                      </span>
                      :
                      <span
                        style={{
                          paddingLeft: "10px",
                          color: "rgba(255,255,255,1)",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className="absolute"
              style={{
                backgroundImage: `url(${leftBg})`,
                backgroundSize: "100% 100%",
                right: "200px",
                width: "400px",
                height: "fit-content",
                top: "10%",
              }}
            >
              <div
                style={{
                  
                  display: "flex",
                  paddingLeft: "10px",
                  alignItems: "center",
                  backgroundImage: `url(${rightTitle})`,
                  backgroundSize: "100% 100%",
                  width: "100%",
                  height: "50px",
                }}
              >
                <img
                  src={rightTitleIcon}
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                ></img>
                <span
                  style={{
                    paddingLeft: "5px",
                    color: "#f7e4e0",
                  }}
                >
                  指标信息
                </span>
              </div>
              <div
                style={{
                 
                  padding: "10px",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    label: "CPU",
                    icon: cpu,
                    value: "80%",
                  },
                  {
                    label: "内存",
                    icon: mem,
                    value: "80GB",
                  },
                  {
                    label: "延时",
                    icon: delay,
                    value: "80ms",
                  },
                  {
                    label: "温度",
                    icon: wd,
                    value: "40摄氏度",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "20px",
                      border: "#e1e1e1",
                      display: "flex",
                      borderRadius: "10px",
                      alignItems: "center",
                      color: "#ffffff",
                      height: "50px",
                      margin: "2px",
                      width: "45%",
                      background:
                        "linear-gradient(90deg, rgba(141, 142, 142, 0.15) 0%, rgba(141, 142, 142, 0) 100%)",
                    }}
                  >
                    <img
                      src={item.icon}
                      alt=""
                      style={{
                        height: "30px",
                        width: "30px",
                      }}
                    />
                    <div
                      style={{
                        paddingLeft: "10px",
                        fontSize: "15px",
                      }}
                    >
                      <p>{item.label}</p>
                      <p
                        style={{
                          fontSize: "10px",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="absolute"
              style={{
                backgroundImage: `url(${leftBg})`,
                backgroundSize: "100% 100%",
                right: "200px",
                width: "400px",
                height: "fit-content",
                top: "30%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  paddingLeft: "10px",
                  alignItems: "center",
                  backgroundImage: `url(${rightTitle})`,
                  backgroundSize: "100% 100%",
                  width: "100%",
                  height: "50px",
                }}
              >
                <img
                  src={rightTitleIcon}
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                ></img>
                <span
                  style={{
                    paddingLeft: "5px",
                    color: "#f7e4e0",
                  }}
                >
                  告警信息
                </span>
              </div>
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    label: "告警总数",
                    icon: alertCount,
                    value: "0件",
                  },
                  {
                    label: "最近发生告警时间",
                    icon: alertTime,
                    value: "2025-03-27 10:21:14",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "20px",
                      border: "#e1e1e1",
                      display: "flex",
                      borderRadius: "10px",
                      alignItems: "center",
                      color: "#ffffff",
                      height: "50px",
                      margin: "2px",
                      width: "45%",
                      background:
                        "linear-gradient(90deg, rgba(141, 142, 142, 0.15) 0%, rgba(141, 142, 142, 0) 100%)",
                    }}
                  >
                    <img
                      src={item.icon}
                      alt=""
                      style={{
                        height: "30px",
                        width: "30px",
                      }}
                    />
                    <div
                      style={{
                        paddingLeft: "10px",
                        fontSize: "15px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "10px",
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontSize: "10px",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                ref={chart}
                style={{
                  width: "100%",
                  height: "200px",
                }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

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
