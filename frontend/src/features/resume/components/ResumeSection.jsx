import React from "react";
import "./ResumeSection.css";

export default function ResumeSection({ title, children}) {
  return (
    <div className='section'>
      <div className="section-label">{title}</div>
      <div className="section-content">{children}</div>
    </div>
  );
}
