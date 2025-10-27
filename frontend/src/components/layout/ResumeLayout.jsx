import React from "react";
import { HoverProvider } from "context/HoverContext";

import Skills from "pages/Resume/Skills";
import Education from "pages/Resume/Education";
import Experience from "pages/Resume/Experience";
import Projects from "pages/Resume/Projects";
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
