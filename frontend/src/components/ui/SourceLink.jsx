import { Link } from "react-router-dom";
import Icon from "components/ui/Icon";
import "./SourceLink.css";

export default function SourceLink({ label, icon, href, to, accent }) {
  const style = accent ? { "--bullet-color": `var(--color-${accent})` } : undefined;
  const content = (
    <>
      {icon && <Icon name={icon} />}
      {label}
    </>
  );

  return to ? (
    <Link to={to} className="source-link" style={style}>{content}</Link>
  ) : (
    <a href={href} className="source-link" style={style} target="_blank" rel="noopener noreferrer">
      {content}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}