import React, { createContext, useContext, useState } from "react";

const HoverContext = createContext();

export function HoverProvider({ children }) {
  const [hoveredSkills, setHoveredSkills] = useState([]);
  return (
    <HoverContext.Provider value={{ hoveredSkills, setHoveredSkills }}>
      {children}
    </HoverContext.Provider>
  );
}

export function useHover() {
  return useContext(HoverContext);
}
