import React from "react";
import { useHover } from "context/HoverContext";
import "./DatedEntry.css";

export default function DatedEntry({ qualifier, location, context, startDate, endDate, content, skills }) {
  const { setHoveredSkills } = useHover();

  return (
    <div
      className="dated-entry"
      onMouseEnter={() => skills?.length && setHoveredSkills(skills)}
        onMouseLeave={() => setHoveredSkills([])}
    >
      <p><strong>{qualifier}</strong> — {location}</p>
      <p>{context} · {startDate} – {endDate}</p>
      <p>{content}</p>
    </div>
  );
}
