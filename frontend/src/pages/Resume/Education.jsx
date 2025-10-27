import React from "react";
import ResumeSection from "components/resume/ResumeSection";
import DatedEntry from "components/resume/DatedEntry"
import { education } from "data/education";

export default function Education() {
  return (
    <ResumeSection title="Education">
      {education.map((job, idx) => (
        <DatedEntry key={idx} {...job} />
      ))}
    </ResumeSection>
  );
}
