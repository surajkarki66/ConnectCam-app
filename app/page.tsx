"use client";

import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { Video } from "lucide-react";

import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const createAndJoin = () => {
    const roomId = uuidv4();
    router.push(`/${roomId}`);
  };

  const joinRoom = () => {
    if (roomId) router.push(`/${roomId}`);
    else {
      alert("Please provide a valid room id");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full flex justify-center items-center p-4 shadow-md mt-5">
        <Video className="text-blue-500 text-4xl mr-3" size={48} />
        <h1 className="text-4xl font-extrabold">ConnectCam</h1>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 sm:px-6 lg:px-8">
        <h3 className="text-xl font-bold mb-6 text-center text-gray-400">
          Premium video meetings. Now free for everyone.
        </h3>
        <div className="flex flex-col items-center mb-4 w-full max-w-md">
          <input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e?.target?.value)}
            className="px-4 py-2 border rounded-md mb-4 w-full text-black"
          />
          <button
            onClick={joinRoom}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
          >
            Join Room
          </button>
        </div>
        <span className="text-gray-500 my-4">
          --------------- OR ---------------
        </span>
        <button
          onClick={createAndJoin}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-full max-w-md"
        >
          Create a new room
        </button>
      </div>
      <footer className="w-full flex justify-center p-4 shadow-inner">
        <p className="text-sm text-gray-600">
          &copy; 2024 ConnectCam. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
