import React from "react";
import "./LinkBadge.css"

function LinkBadge({href, imgSrc, text, alt}){
    return (
        <a href={href} className="link-badge" target="_blank">
            <img src={imgSrc} alt={alt} className="link-logo"/>
            <span>{text}</span>
        </a>
    )
}

export default LinkBadge;