import React, { useState, useEffect } from "react";

import Message from "../components/Message";

import { useRouter } from "next/router";

import { auth, db } from "../utils/firebase";

import { toast } from "react-toastify";

import { motion as m } from "framer-motion";

import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

const Details = () => {
  const route = useRouter();

  const routeData = route.query;

  const [msg, setMsg] = useState("");
  const [allMsg, setAllMsg] = useState([]);

  const submitComment = async () => {
    if (!auth.currentUser) return route.push("/auth/login");

    if (!msg) {
      toast.error("Write some comment 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message: msg,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });

    setMsg("");
  };

  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);

    return onSnapshot(docRef, (snapshot) =>
      setAllMsg(snapshot.data().comments)
    );
  };

  useEffect(() => {
    if (!route.isReady) return;
    getComments();
  }, [route.isReady]);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    >
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Leave a comment 😁"
            className="bg-gray-800 w-full p-2 text-white text-sm rounded-l-lg"
          />
          <button
            onClick={submitComment}
            className="bg-cyan-500 text-white py-2 px-4 text-sm rounded-r-lg"
          >
            Comment
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMsg?.map((msg, i) => (
            <m.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: `0.${i}`, duration: 0.5 }}
              className="bg-white p-4 my-4 border-2 rounded-lg"
              key={msg.time}
            >
              <div className="flex items-center gap-2 mb-4">
                <img
                  className="w-10 rounded-full"
                  src={msg.avatar}
                  alt="user avatar"
                />
                <h2>{msg.userName}</h2>
              </div>
              <h2>{msg.message}</h2>
            </m.div>
          ))}
        </div>
      </div>
    </m.div>
  );
};

export default Details;
