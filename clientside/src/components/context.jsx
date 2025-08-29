import React, { createContext, useState } from "react";

// Create Context
export const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [isUserBlocked, setIsUserBlocked] = useState(false);

  const toggleUserBlock = () => {
    setIsUserBlocked(prev => !prev);
  };

  return (
    <MessageContext.Provider value={{ isUserBlocked, toggleUserBlock }}>
      {children}
    </MessageContext.Provider>
  );
};
