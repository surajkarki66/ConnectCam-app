import { useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "@/context/socket";
import { useRouter } from "next/navigation";
import Peer from "peerjs";

type PlayerType = {
  url: MediaStream;
  muted: boolean;
  playing: boolean;
};

type PlayersStateType = {
  [key: string]: PlayerType;
};

const usePlayer = (
  myId: string,
  roomId?: string | string[],
  peer?: Peer,
  stream?: MediaStream
) => {
  const { socket } = useSocket();
  const [players, setPlayers] = useState<PlayersStateType>({});
  const router = useRouter();
  const playersCopy = cloneDeep(players);

  const playerHighlighted = playersCopy[myId];
  delete playersCopy[myId];

  const nonHighlightedPlayers = playersCopy;

  const turnOffTracks = (type: "audio" | "video") => {
    let track = stream?.getTracks().find((track) => track.kind === type);
    if (track?.enabled) {
      track.enabled = false;
    }
  };
  const leaveRoom = () => {
    socket!.emit("user-leave", myId, roomId);
    peer?.disconnect();
    turnOffTracks("audio");
    turnOffTracks("video");
    router.push("/");
  };

  const toggleAudio = () => {
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[myId].muted = !copy[myId].muted;
      if (stream) {
        const audioTrack = stream.getTracks().find((track) => track.kind === "audio");
        if (audioTrack) {
          audioTrack.enabled = prev[myId].muted;
        }
      }
      return { ...copy };
    });
    socket!.emit("user-toggle-audio", myId, roomId);
  };

  const toggleVideo = () => {
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[myId].playing = !copy[myId].playing;
      if (stream) {
        const videoTrack = stream.getTracks().find((track) => track.kind === "video");
        if (videoTrack) {
          videoTrack.enabled = !prev[myId].playing;
        }
      }
      return { ...copy };
    });
    socket!.emit("user-toggle-video", myId, roomId);
  };

  return {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  };
};

export default usePlayer;
