import ReactPlayer from "react-player";
import cx from "classnames";
import { Mic, MicOff, UserSquare2 } from "lucide-react";

import styles from "@/components/Player/index.module.css";

type PropsType = {
    url: MediaStream;
    muted: boolean;
    playing: boolean;
    isActive: boolean;
}
const Player: React.FC<PropsType> = (props) => {
  const { url, muted, playing, isActive } = props;
  return (
    <div
      className={cx(styles.playerContainer, {
        [styles.notActive]: !isActive,
        [styles.active]: isActive,
        [styles.notPlaying]: !playing,
      })}
    >
      {playing ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          width="100%"
          height="100%"
        />
      ) : (
        <UserSquare2 className={styles.user} size={isActive ? 400 : 150} />
      )}

      {!isActive ? (
        muted ? (
          <MicOff className={styles.icon} size={20} />
        ) : (
          <Mic className={styles.icon} size={20} />
        )
      ) : undefined}
    </div>
  );
};

export default Player;