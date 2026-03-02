if (!self || typeof self === "undefined" || !("onmessage" in self)) {
  console.error("Cannot load worker.");
}

self.onmessage = (event) => {
  const { type, payload } = event.data || {};
  if (type === "PING") {
    self.postMessage({
      type: "PONG",
      payload: {
        received: payload,
        at: Date.now(),
      },
    });
    return;
  }
  // 기본 에코
  self.postMessage({
    type: "HELATH-CHECK",
    payload,
  });
};
