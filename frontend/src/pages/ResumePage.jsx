import Page from "components/ui/Page";
import ResumeSection from "features/resume/ResumeSection";
import { resume } from "features/resume/resume";

export default function Resume() {
  return (
    <Page title="resume">
      {resume.map((section) => (
        <ResumeSection key={section.title} {...section} />
      ))}
    </Page>
  );
}