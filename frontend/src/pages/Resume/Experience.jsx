import React from "react";
import ResumeSection from "components/resume/ResumeSection";
import DatedEntry from "components/resume/DatedEntry"
import { experience } from "data/experience";

export default function Experience() {
  return (
    <ResumeSection title="Experience">
      {experience.map((job, idx) => (
        <DatedEntry key={idx} {...job} />
      ))}
    </ResumeSection>
  );
}
