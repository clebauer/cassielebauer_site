import React from "react";
import { useHover } from "context/HoverContext";
import "./SkillEntry.css";

export default function SkillEntry({ skill }) {
  const { hoveredSkills } = useHover();
  const isHighlighted = hoveredSkills.includes(skill);

  return (
    <span
      className={`skill-entry ${isHighlighted ? "highlight" : ""}`}
    >
      {skill}
    </span>
  );
}
