export const createCabinet = async () => {
  const controller = new AbortController();
  const signal = controller.signal;

  const res = await fetch("mwapi/cmdb/digitalTwin/getRoomInfo/browse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  }).then((response) => response.json());
};
