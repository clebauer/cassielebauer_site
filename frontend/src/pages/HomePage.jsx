import { Link } from "react-router-dom";
import Page from "components/ui/Page";
import Icon from "components/ui/Icon";
import FactList from "components/ui/FactList";

import "features/home/Home.css";
import portrait from 'assets/portrait2.jpeg'
import { professional, personal } from "features/home/about";

const goLinks = [
  { icon: "code", label: "see what I've built", to: "/tech" },
  { icon: "heart", label: "meet Alterknitive", to: "/community" },
  { icon: "palette", label: "browse my art", to: "/art" },
];



export default function Home() {
  return (
    <Page title="about me">
      <div className="home">
        <img className="home-photo"
          src={portrait}
          alt="Cassie smiling and glancing up and to the left, one hand behind her head, outdoors.
               She has half-pink half-purple hair, a septum ring and spider bites,
               and wears a hand-knit black shawl with rainbow stripes." />
        <FactList title="professionally," facts={professional} />
        <FactList title="personally," facts={personal} />

{/*         <div className="pill-row"> */}
{/*           {goLinks.map((l, i) => ( */}
{/*             <Link */}
{/*               key={l.to} */}
{/*               to={l.to} */}
{/*               className="pill" */}
{/*               style={{ "--pill-color": `var(--color-${i + 1})` }} */}
{/*             > */}
{/*               <Icon name={l.icon} /> */}
{/*               {l.label} */}
{/*             </Link> */}
{/*           ))} */}
{/*         </div> */}


      </div>
    </Page>
  );
}