import React from "react";
import ResumeSection from "features/resume/components/ResumeSection";
import DatedEntry from "features/resume/components/DatedEntry"
import { education } from "features/resume/data/education";

export default function Education() {
  return (
    <ResumeSection title="Education">
      {education.map((job, idx) => (
        <DatedEntry key={idx} {...job} />
      ))}
    </ResumeSection>
  );
}
