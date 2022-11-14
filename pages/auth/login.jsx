import React, { useEffect } from "react";

import { FcGoogle } from "react-icons/fc";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { auth } from "../../utils/firebase";

import { useRouter } from "next/router";

import { useAuthState } from "react-firebase-hooks/auth";

import { motion as m } from "framer-motion";

const Login = () => {
  const route = useRouter();

  const [user, loading] = useAuthState(auth);

  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      route.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (user) {
      route.push("/");
    } else {
      console.log("login");
    }
  }, [user]);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg"
    >
      <h2 className="text-2xl font-medium">Join Today</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with one of the providers</h3>
        <button
          className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2"
          onClick={GoogleLogin}
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </m.div>
  );
};

export default Login;
