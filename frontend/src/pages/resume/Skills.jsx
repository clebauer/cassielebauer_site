import React from "react";
import ResumeSection from "features/resume/components/ResumeSection";
import SkillEntry from "features/resume/components/SkillEntry"

export default function Skills() {
  return (
    <ResumeSection title="Skills">
        <div className="skills-list">
            <SkillEntry skill="Python"/>
            <SkillEntry skill="SQL"/>
            <SkillEntry skill="React"/>
            <SkillEntry skill="Javascript"/>
            <SkillEntry skill="FastAPI"/>
            <SkillEntry skill="Git"/>
        </div>
    </ResumeSection>
  );
}
