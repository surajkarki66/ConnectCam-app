import { useState, useEffect, useRef } from "react";

const useMediaStream = () => {
  const [state, setState] = useState<MediaStream>();
  const isStreamSet = useRef(false);

  useEffect(() => {
    if (isStreamSet.current) return;
    isStreamSet.current = true;
    (async function initStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setState(stream);
      } catch (e) {}
    })();
  }, []);

  return {
    stream: state,
  };
};

export default useMediaStream;
