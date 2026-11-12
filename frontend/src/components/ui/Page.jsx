import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Page({ title, parents = [], children }) {
  useEffect(() => {
      document.title = `${title} · cassie`;
  }, [title]);

  return (
    <div className="panel">
      <div className="col-title col-title--crumbs">
        {parents.length > 0 && (
          <nav aria-label="breadcrumb" className="parent-crumbs">
            {parents.map((p) => (
              <Fragment key={p.to}>
                <Link to={p.to} className="parent-crumb">{p.label}</Link>
                <span className="parent-crumb-sep" aria-hidden="true">/</span>
              </Fragment>
            ))}
          </nav>
        )}
        <h1>{title}</h1>
      </div>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}