import React from "react";

import { motion as m } from "framer-motion";

const Message = ({ children, avatar, username, description, i }) => {
  return (
    <m.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: `0.${i}`, duration: 0.5 }}
      className="bg-white p-8 border-b-2 rounded-lg"
    >
      <div className="flex items-center gap-2">
        <img src={avatar} className="w-10 rounded-full" alt="Image user" />
        <h2>{username}</h2>
      </div>
      <div className="py-4">
        <p>{description}</p>
      </div>
      {children}
    </m.div>
  );
};

export default Message;
