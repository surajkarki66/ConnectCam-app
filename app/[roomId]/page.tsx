"use client";

import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import usePlayer from "@/hooks/usePlayer";

import Player from "@/components/Player/index";
import Bottom from "@/components/Bottom/index";
import CopySection from "@/components/CopySection/index";

import styles from "@/styles/room.module.css";
import { useParams } from "next/navigation";

const Room = () => {
  const { socket } = useSocket();
  const params = useParams();
  const roomId = params.roomId;
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(myId, roomId, peer, stream);

  const [users, setUsers] = useState({});

  useEffect(() => {
    if (!socket || !peer || !stream) return;
    const handleUserConnected = (newUser: string) => {
      const call = peer.call(newUser, stream);

      call.on("stream", (incomingStream) => {
        setPlayers((prev) => ({
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [newUser]: call,
        }));
      });
    };
    socket.on("user-connected", handleUserConnected);

    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer, setPlayers, socket, stream]);

  useEffect(() => {
    if (!socket) return;
    const handleToggleAudio = (userId: string) => {
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId]!.muted;
        return { ...copy };
      });
    };

    const handleToggleVideo = (userId: string) => {
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId]!.playing;
        return { ...copy };
      });
    };

    const handleUserLeave = (userId: string) => {
      (users as Record<string, any>)[userId]?.close();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };
    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-leave", handleUserLeave);
    return () => {
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-toggle-video", handleToggleVideo);
      socket.off("user-leave", handleUserLeave);
    };
  }, [players, setPlayers, socket, users]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(stream);

      call.on("stream", (incomingStream) => {
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [callerId]: call,
        }));
      });
    });
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!stream || !myId) return;
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: true,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream]);

  return (
    <>
      <div className={styles.activePlayerContainer}>
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive
          />
        )}
      </div>
      <div className={styles.inActivePlayerContainer}>
        {Object.keys(nonHighlightedPlayers).map((playerId) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        })}
      </div>
      <CopySection roomId={roomId as string} />
      <Bottom
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
    </>
  );
};

export default Room;
