const _isUserMediaSupported = () => {
  if (typeof window === undefined) return;
  if (!navigator.mediaDevices?.getUserMedia) {
    console.error(
      "이 브라우저는 navigator.mediaDevices.getUserMedia()를 지원하지 않습니다.",
    );
    return false;
  }
  const isLocalhost = ["localhost", "127.0.0.1"].includes(location.hostname);
  if (!isLocalhost && location.protocol !== "https:") {
    console.error(
      "getUserMedia는 보통 HTTPS(또는 localhost)에서만 동작합니다.",
    );
    return false;
  }
  return true;
};

export const getMediastream = async () => {
  if (typeof window === undefined) return null;
  const isSupported = _isUserMediaSupported();
  if (!isSupported) return null;
  return await navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return null;
    });
};
