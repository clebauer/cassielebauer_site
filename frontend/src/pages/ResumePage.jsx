import Page from "components/ui/Page";
import ResumeIntro from "features/resume/ResumeIntro";
import ResumeNav from "features/resume/ResumeNav";
import ResumeSection from "features/resume/ResumeSection";
import { resume } from "features/resume/resume";

// "work experience" -> "work-experience", used for the nav's jump links
const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const sections = resume.map((section) => ({ ...section, id: slug(section.title) }));
const navItems = sections.map(({ id, title }) => ({ id, title }));

export default function Resume() {
  return (
    <Page title="resume">
      <ResumeIntro />
      <ResumeNav sections={navItems} />
      {sections.map((section) => (
        <ResumeSection key={section.id} {...section} />
      ))}
    </Page>
  );
}