"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "@/components/Icon";
import { reviewSources, type ReviewSource, type TravelerReview } from "@/lib/reviews";

function Rating({ source, badge = false }: { source: ReviewSource; badge?: boolean }) {
  return <span className={`review-rating review-rating--${source.toLowerCase()}`} role="img" aria-label="5 out of 5">
    {Array.from({ length: 5 }, (_, index) => <i key={index} aria-hidden="true">{source === "Google" ? "★" : ""}</i>)}
    {badge && <span className="review-check" aria-hidden="true">✓</span>}
  </span>;
}

function TripadvisorIcon() {
  return <svg className="tripadvisor-logo" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="20" fill="currentColor" />
    <path d="M9.2 16.2c2.9-2.2 6.2-3.2 10.8-3.2s7.9 1 10.8 3.2M12.2 14.7l-2.5-3.1M27.8 14.7l2.5-3.1" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="13.7" cy="21.1" r="6.2" fill="none" stroke="white" strokeWidth="2" />
    <circle cx="26.3" cy="21.1" r="6.2" fill="none" stroke="white" strokeWidth="2" />
    <circle cx="13.7" cy="21.1" r="2.1" fill="white" /><circle cx="26.3" cy="21.1" r="2.1" fill="white" />
    <path d="M18.7 21.2 20 24l1.3-2.8" fill="white" />
  </svg>;
}

function GoogleIcon() {
  return <svg className="google-g-logo" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 31.7 14l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5Z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 31.7 14l5.7-5.7A20 20 0 0 0 6.3 14.7Z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.8-2 13.3-5.2l-6.2-5.2A12 12 0 0 1 12.9 28l-6.6 5.1A20 20 0 0 0 24 44Z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.2 5.6l6.2 5.2C41 35.4 44 30.3 44 24c0-1.2-.1-2.3-.4-3.5Z" />
  </svg>;
}

function SourceMark({ source }: { source: ReviewSource }) {
  return <span className={`review-source-mark review-source-mark--${source.toLowerCase()}`} role="img" aria-label={source}>
    {source === "Tripadvisor"
      ? <><TripadvisorIcon /><span className="review-source-label" aria-hidden="true">Tripadvisor</span></>
      : <><GoogleIcon /><span className="review-source-label google-wordmark" aria-hidden="true"><i>G</i><i>o</i><i>o</i><i>g</i><i>l</i><i>e</i></span></>}
  </span>;
}

function ReviewRail({ reviews }: { reviews: readonly TravelerReview[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const rail = railRef.current;
    if (!rail) return;

    function update() {
      const { scrollLeft, scrollWidth, clientWidth } = rail!;
      setAtStart(scrollLeft <= 1);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }

    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scrollByAmount(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  }

  return <div className="review-rail-wrap">
    <button type="button" className="review-rail-nav review-rail-nav--prev" aria-label="Scroll reviews left" onClick={() => scrollByAmount(-1)} disabled={mounted && atStart}>
      <ArrowLeft />
    </button>
    <div className="review-card-rail" ref={railRef}>
      {reviews.map((review) => <article className="traveler-review-card" key={`${review.source}-${review.name}-${review.title ?? review.text}`}>
        <header>
          <span className={`review-avatar review-avatar--${review.avatarTone}`} aria-hidden="true">{review.initials}</span>
          <span className="review-author"><strong>{review.name}</strong><small>{review.date}{review.translatedFrom ? ` · Translated from ${review.translatedFrom}` : ""}</small></span>
          <SourceMark source={review.source} />
        </header>
        <Rating source={review.source} badge />
        {review.title && <h3>{review.title}</h3>}
        <blockquote>{review.text}</blockquote>
      </article>)}
    </div>
    <button type="button" className="review-rail-nav review-rail-nav--next" aria-label="Scroll reviews right" onClick={() => scrollByAmount(1)} disabled={mounted && atEnd}>
      <ArrowRight />
    </button>
  </div>;
}

export function ReviewsShowcase({ reviews }: { reviews: readonly TravelerReview[] }) {
  return <div className="reviews-showcase">
    {reviewSources.map((summary) => {
      const sourceReviews = reviews.filter((review) => review.source === summary.source);
      return <section className="review-source-row" key={summary.source} aria-labelledby={`review-source-${summary.source.toLowerCase()}`}>
        <div className="review-source-summary">
          <p id={`review-source-${summary.source.toLowerCase()}`}>{summary.verdict}</p>
          <Rating source={summary.source} />
          <span>Based on <strong>{summary.total} reviews</strong></span>
          <SourceMark source={summary.source} />
        </div>
        <ReviewRail reviews={sourceReviews} />
      </section>;
    })}
  </div>;
}
