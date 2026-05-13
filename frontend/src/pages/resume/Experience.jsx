import React from "react";
import ResumeSection from "features/resume/components/ResumeSection";
import DatedEntry from "features/resume/components/DatedEntry";
import { experience } from "features/resume/data/experience";
import "./Experience.css";

export default function Experience() {
  return (
    <ResumeSection title="Experience">
      {experience.map((company, idx) => (
        <div key={idx} className="company-group">
          <h3 className="company-name">{company.company}</h3>
          {company.roles.map((job, jIdx) => (
            <DatedEntry key={jIdx} location={company.company} {...job} />
          ))}
        </div>
      ))}
    </ResumeSection>
  );
}