import {
  from,
  fromEvent,
  mergeMap,
  switchMap,
  Observer,
  map,
  Subject,
  withLatestFrom,
} from "rxjs";
import { Object3D } from "three";
import { GLTF, GLTFExporter, GLTFLoader } from "three/examples/jsm/Addons.js";

/**
 * 上传模型
 *
 * const {execute,subscribe} = uploadModel()
 *
 *
 */

interface IRT {
  gltf: GLTF;
  file: File;
  index: number;
  newBlob: Promise<Blob>;
}

function exportGLTF(gltfScene: Object3D) {
  const exporter = new GLTFExporter();

  // 创建下载链接并触发下载
  return new Promise<Blob>((res) => {
    exporter.parse(
      gltfScene,
      (result) => {
        const json = JSON.stringify(result, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        res(blob);
      },
      () => {},
      { binary: false }
    );
  });
}

export const uploadModel = <T, E>(
  uploadFetch: (params: IRT) => Promise<T>,
  mergeCount?: number
) => {
  const ele = document.getElementById("uploadModel-id");
  const uploadEle =
    ele instanceof HTMLInputElement ? ele : document.createElement("input");

  uploadEle.type = "file";
  uploadEle.id = "uploadModel-id";
  uploadEle.style.visibility = "hidden";
  uploadEle.style.position = "absolute";
  uploadEle.style.pointerEvents = "none";

  document.body.appendChild(uploadEle);
  const eleEventObserver = fromEvent<Event>(uploadEle, "change");

  const subject = new Subject<E>();

  return {
    execute: (insertInfo: E) => {
      subject.next(insertInfo);
      uploadEle.click();
    },
    subscribe: (
      subscribeCb?: Partial<Observer<T>> | ((value: T) => void) | undefined
    ) => {
      console.log("1d1d");
      return eleEventObserver
        .pipe(
          withLatestFrom(subject),
          switchMap(([{ target }, insertInfo]) => {
            return from((target as HTMLInputElement).files || []).pipe(
              map((file, index) => {
                const loader = new GLTFLoader();
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                return new Promise<IRT>((res, rej) => {
                  reader.onload = function (event) {
                    loader.parse(
                      event.target?.result as ArrayBuffer,
                      "",
                      (gltf) => {
                        // console.log("加载的 glTF 文件:", gltf);
                        gltf.scene.userData.insertInfo = insertInfo;
                        res({
                          gltf,
                          file,
                          newBlob: exportGLTF(gltf.scene),
                          index,
                        });
                      },
                      (err) => {
                        rej(err);
                      }
                    );
                  };

                  reader.onerror = function (error) {
                    rej(error);
                  };
                });
              }),
              mergeMap(async (value) => {
                return uploadFetch(await value);
              }, mergeCount || 3)
              // 控制并发数
            );
          })
        )
        .subscribe(subscribeCb);
    },
  };
};
