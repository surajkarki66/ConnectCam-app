import cx from "classnames";
import { Mic, Video, PhoneOff, VideoOff, MicOff } from "lucide-react";

import styles from "@/components/Bottom/index.module.css";

type PropsType = {
  toggleAudio: () => void;
  toggleVideo: () => void;
  leaveRoom: () => void;
  playing: boolean;
  muted: boolean;
};

const Bottom: React.FC<PropsType> = (props) => {
  const { muted, playing, toggleAudio, toggleVideo, leaveRoom } = props;

  return (
    <div className={styles.bottomMenu}>
      {muted ? (
        <MicOff
          className={cx(styles.icon, styles.active)}
          size={55}
          onClick={toggleAudio}
        />
      ) : (
        <Mic className={styles.icon} size={55} onClick={toggleAudio} />
      )}
      {playing ? (
        <Video className={styles.icon} size={55} onClick={toggleVideo} />
      ) : (
        <VideoOff
          className={cx(styles.icon, styles.active)}
          size={55}
          onClick={toggleVideo}
        />
      )}
      <PhoneOff size={55} className={cx(styles.icon)} onClick={leaveRoom} />
    </div>
  );
};

export default Bottom;
