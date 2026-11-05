import React from "react";
import { HoverProvider } from "context/HoverContext";

import Skills from "features/resume/Skills";
import Education from "features/resume/Education";
import Experience from "features/resume/Experience";
import Projects from "features/resume/Projects";
import "./ResumeLayout.css";

export default function ResumeLayout() {
  return (
    <HoverProvider>
        <div className="resume-grid">
            <div className="skills"><Skills /></div>
            <div className="education"><Education /></div>
            <div className="experience"><Experience /></div>
            <div className="projects"><Projects /></div>
        </div>
    </HoverProvider>
  );
}
