import React from "react";
import LinkBadge from "components/ui/LinkBadge"
import { github, linkedin, researchgate, ravelry} from 'assets/icons';
import ResumeLayout from "components/layout/ResumeLayout"
function Resume(){
    return (
    <>
    <div>
        <LinkBadge href="https://www.github.com/clebauer"
                    imgSrc={github}
                    text="Github"
                    alt="Github Logo"/>
        <LinkBadge href="https://www.linkedin.com/in/cassielebauer"
                    imgSrc={linkedin}
                    text="LinkedIn"
                    alt="LinkedIn Logo"/>
        <LinkBadge href="https://www.researchgate.net/scientific-contributions/Cassie-Lebauer-2090529942"
                    imgSrc={researchgate}
                    text="ResearchGate"
                    alt="ResearchGate Logo"/>
        <LinkBadge href="https://www.ravelry.com/projects/QueerHearts/"
                    imgSrc={ravelry}
                    text="Ravelry"
                    alt="Ravelry Logo"/>
    </div>
    <div>
        <ResumeLayout/>
    </div>
    </>)
}

export default Resume;