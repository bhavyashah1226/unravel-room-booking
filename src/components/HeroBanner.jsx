import React, { useState, useEffect, useRef } from "react";
import sampleJson from "../data/rooms.json";
import s from "./HeroBanner.module.scss";

export default function HeroBanner() {
  const hd = sampleJson.hotel_details;

  const slides = [
    ...(hd.new_videos || []).map((v) => ({
      type: "video",
      src: v.video_url.med,
    })),
    ...(hd.images || []).map((img) => ({
      type: "image",
      src: img.twoX.square,
      srcSet: img.threeX
        ? `${img.twoX.square} 1x, ${img.threeX.square} 2x`
        : undefined,
    })),
  ];

  const [current, setCurrent] = useState(0);
  const videoRef = useRef(null);

  // Cycle slides every 5s
  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  // Play new video slide from start
  useEffect(() => {
    if (slides[current]?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [current, slides]);

  if (!slides.length) return null;

  const prev = () => setCurrent((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setCurrent((i) => (i + 1) % slides.length);

  // Render only the active slide
  const ActiveSlide = () => {
    const slide = slides[current];
    if (!slide) return null;

    if (slide.type === "video") {
      return (
        <video
          src={slide.src}
          preload="metadata"
          muted
          loop
          playsInline
          autoPlay
          ref={videoRef}
          className={s.slide}
        />
      );
    } else {
      return (
        <img
          src={slide.src}
          srcSet={slide.srcSet}
          alt=""
          className={s.slide}
        />
      );
    }
  };

  const priceObj = hd.properties.price?.[0] || {};
  const startPrice = `${priceObj.unit || ""}${Math.round(priceObj.value || 0)}`;

  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <ActiveSlide />

        <div className={s.overlay} />

        <button
          onClick={prev}
          className={`${s.navButton} ${s.prev}`}>
          ‹
        </button>
        <button
          onClick={next}
          className={`${s.navButton} ${s.next}`}>
          ›
        </button>

        <div className={s.heroText}>
          <h1 className={s.title}>{hd.display_name}</h1>
          <div className={s.rating}>
            {Array.from({ length: hd.properties.star_rating || 0 }).map(
              (_, i) => (
                <span
                  key={i}
                  className={s.star}>
                  ★
                </span>
              )
            )}
            {hd.properties.review_summary && (
              <>
                <span className={s.ratingSeparator}>·</span>
                <span className={s.reviewCount}>
                  {hd.properties.review_summary[0].review_count.toLocaleString()}{" "}
                  reviews
                </span>
              </>
            )}
          </div>
          <p className={s.priceLine}>
            From <span className={s.price}>{startPrice}</span> per night
          </p>
        </div>

        <div className={s.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`${s.dot} ${i === current ? s.active : s.inactive}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
