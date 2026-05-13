import React from "react";
import { HoverProvider } from "context/HoverContext";

import Skills from "pages/resume/Skills";
import Education from "pages/resume/Education";
import Experience from "pages/resume/Experience";
import Projects from "pages/resume/Projects";
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
