import React from "react";
import "./Hero.css";

/*
Reusable Hero component
Props:
- title: string
- subtitle: string
- imageSrc: string (path from public/, e.g. /images/hero-pharmacy.png)
- imageAlt: string (descriptive alt text)
- ctaPrimary: { label, to } (optional)
- ctaSecondary: { label, to } (optional)
- align: "image-left" | "image-right" (default: image-left)
- bulletPoints: string[] (optional)
 - bgImageSrc: string (optional background image for full hero section)
 - bgImageSrc: string (optional background image for full hero section)
 - overlay: boolean (optional overlay over bg, default false)
*/

import { Link } from "react-router-dom";

const Hero = ({
  title,
  subtitle,
  imageSrc = "/hero-pharmacy.jpg",
  imageAlt = "Illustration of online medicine ordering with pharmacist preparing a package; healthcare icons; clean white with soft blue/green gradient.",
  ctaPrimary,
  ctaSecondary,
  align = "image-left",
  bulletPoints = [],
  bgImageSrc,
  overlay = false,
}) => {
  const hasBgNoOverlay = Boolean(bgImageSrc) && !overlay;
  const sectionClass = `site-hero ${align}${hasBgNoOverlay ? " has-bg-no-overlay" : ""}${overlay ? " has-overlay" : ""}`;
  return (
    <section className={sectionClass}>
      {bgImageSrc && (
        <div
          className="site-hero-bg"
          aria-hidden="true"
          style={{ backgroundImage: `url(${bgImageSrc})` }}
        />
      )}
      {overlay && <div className="site-hero-overlay" aria-hidden="true" />}
      {imageSrc && (
        <div className="site-hero-illustration" aria-hidden={!imageAlt}>
          <img
            src={imageSrc}
            className="site-hero-image"
            alt={imageAlt}
            loading="eager"
          />
        </div>
      )}
      <div className="site-hero-content">
        {title && <h1 className="site-hero-title animated-gradient">{title}</h1>}
        {subtitle && <p className="site-hero-subtitle fade-in">{subtitle}</p>}
        {Array.isArray(bulletPoints) && bulletPoints.length > 0 && (
          <ul className="site-hero-bullets" aria-label="Key benefits">
            {bulletPoints.slice(0, 5).map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        )}
        {(ctaPrimary || ctaSecondary) && (
          <div className="site-hero-ctas">
            {ctaPrimary && (
              <Link className="site-hero-btn primary" to={ctaPrimary.to}>
                {ctaPrimary.label}
              </Link>
            )}
            {ctaSecondary && (
              <Link className="site-hero-btn secondary" to={ctaSecondary.to}>
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
