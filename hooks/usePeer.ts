import { useSocket } from "@/context/socket";
import { useParams } from "next/navigation";
import {Peer} from "peerjs";

import { useState, useEffect, useRef } from "react";

const usePeer = () => {
  const { socket } = useSocket();
  const roomId = useParams().roomId;
  const [peer, setPeer] = useState<Peer>();
  const [myId, setMyId] = useState("");
  const isPeerSet = useRef(false);

  useEffect(() => {
    if (isPeerSet.current || !roomId || !socket) return;
    isPeerSet.current = true;
    let myPeer: Peer;
    (async function initPeer() {
      myPeer =  new Peer();
      setPeer(myPeer);

      myPeer.on("open", (id) => {
        setMyId(id);
        socket?.emit("join-room", roomId, id);
      });
    })();
  }, [roomId, socket]);

  return {
    peer,
    myId,
  };
};

export default usePeer;
