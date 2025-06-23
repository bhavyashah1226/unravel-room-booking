import React, { useState, useEffect, useRef, useMemo } from "react";
import s from "./RoomCardMedia.module.scss";

export default function RoomCardMedia({ variant, hotel }) {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Build slides: images then videos
  const slides = useMemo(() => {
    const photos = [];
    const vids = [];

    if (Array.isArray(variant.images)) {
      variant.images.forEach((img) =>
        photos.push({
          type: "image",
          src: img.twoX.square,
          srcSet: img.threeX
            ? `${img.twoX.square} 1x, ${img.threeX.square} 2x`
            : undefined,
        })
      );
    }
    if (Array.isArray(hotel.images)) {
      hotel.images.forEach((img) =>
        photos.push({
          type: "image",
          src: img.twoX.square,
          srcSet: img.threeX
            ? `${img.twoX.square} 1x, ${img.threeX.square} 2x`
            : undefined,
        })
      );
    }
    if (variant.video_url?.med) {
      vids.push({ type: "video", src: variant.video_url.med });
    }
    if (Array.isArray(hotel.new_videos)) {
      hotel.new_videos.forEach((v) =>
        vids.push({ type: "video", src: v.video_url.med })
      );
    }
    return [...photos, ...vids];
  }, [variant, hotel]);

  // Observe visibility to autoplay and reset when off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          setCurrent(0); // reset carousel when scrolled away
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Autoplay only while visible
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(
      () => setCurrent((i) => (i + 1) % slides.length),
      4000
    );
    return () => clearInterval(timer);
  }, [isVisible, slides.length]);

  // Restart video when its slide becomes active
  useEffect(() => {
    if (slides[current]?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [current, slides]);

  if (!slides.length) return null;

  const prev = () => setCurrent((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setCurrent((i) => (i + 1) % slides.length);

  // Only render the active slide
  const ActiveSlide = () => {
    const slide = slides[current];
    if (slide.type === "video") {
      return (
        <video
          ref={videoRef}
          src={slide.src}
          preload="metadata"
          muted
          loop
          playsInline
          autoPlay={isVisible}
          className={s.slide}
        />
      );
    }
    return (
      <img
        src={slide.src}
        srcSet={slide.srcSet}
        alt=""
        className={s.slide}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={s.container}>
      <ActiveSlide />

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

      <div className={s.dots}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`${s.dot} ${
              idx === current ? s.dotActive : s.dotInactive
            }`}
          />
        ))}
      </div>
    </div>
  );
}
