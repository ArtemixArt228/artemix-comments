import React, { useEffect, useState } from "react";

import { auth } from "../utils/firebase";
import { db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { useRouter } from "next/router";

import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Message from "../components/Message";

import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

import Link from "next/link";

import { motion as m } from "framer-motion";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);

  const route = useRouter();

  const [user, loading] = useAuthState(auth);

  const getData = async () => {
    if (loading) return;
    if (!user) {
      return route.push("/auth/login");
    }

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));

    return onSnapshot(q, (snapshot) =>
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };

  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);

    await deleteDoc(docRef);
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  if (loading)
    return (
      <div className="h-screen w-full grid place-items-center">Loading...</div>
    );

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Your posts</h1>
      <div>
        {posts.map((post, i) => (
          <Message key={post.id} {...post} i={i}>
            <div className="flex gap-4">
              <button
                onClick={() => deletePost(post.id)}
                className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
              >
                <BsTrash2Fill className="text-2xl" /> Delete
              </button>
              <Link href={{ pathname: "/post", query: post }}>
                <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                  <AiFillEdit className="text-2xl" /> Edit
                </button>
              </Link>
            </div>
          </Message>
        ))}
      </div>
      <button
        className="font-medium text-white bg-gray-800 py-2 px-4 my-6 rounded-lg"
        onClick={() => {
          auth.signOut();
          route.push("/");
        }}
      >
        Sign Out
      </button>
    </m.div>
  );
};

export default Dashboard;
