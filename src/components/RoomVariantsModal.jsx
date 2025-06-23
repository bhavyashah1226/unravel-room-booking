import React, { useState, useEffect, useRef, useMemo } from "react";
import sampleJson from "../data/rooms.json";
import s from "./RoomVariantsModal.module.scss";

export default function RoomVariantsModal({ open, room, onClose }) {
  const hotel = sampleJson.hotel_details;
  const variants = room.variants || [];
  const [variantIdx, setVariantIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const videoRef = useRef(null);
  const variant = variants[variantIdx];

  // Build slides: variant images, variant video, hotel videos, hotel images
  const slides = useMemo(() => {
    const photos = (variant.images || []).map((img) => ({
      type: "image",
      src: img.twoX.square,
      srcSet: img.threeX
        ? `${img.twoX.square} 1x, ${img.threeX.square} 2x`
        : undefined,
    }));
    const vids = [];
    if (variant.video_url)
      vids.push({ type: "video", src: variant.video_url.med });
    (hotel.new_videos || []).forEach((v) =>
      vids.push({ type: "video", src: v.video_url.med })
    );
    (hotel.images || []).forEach((img) =>
      photos.push({
        type: "image",
        src: img.twoX.square,
        srcSet: img.threeX
          ? `${img.twoX.square} 1x, ${img.threeX.square} 2x`
          : undefined,
      })
    );
    return [...photos, ...vids];
  }, [variant, hotel]);

  // Autoplay video when active
  useEffect(() => {
    if (slides[slideIdx]?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [slideIdx, slides]);

  if (!open || !variant) return null;

  const prevVariant = () =>
    setVariantIdx((i) => (i - 1 + variants.length) % variants.length);
  const nextVariant = () => setVariantIdx((i) => (i + 1) % variants.length);
  const prevSlide = () =>
    setSlideIdx((i) => (i - 1 + slides.length) % slides.length);
  const nextSlide = () => setSlideIdx((i) => (i + 1) % slides.length);

  return (
    <div className={s.container}>
      <div className={s.modal}>
        <button
          onClick={prevVariant}
          className={`${s.variantNavButton} ${s.prev}`}>
          ‹
        </button>
        <button
          onClick={nextVariant}
          className={`${s.variantNavButton} ${s.next}`}>
          ›
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className={s.closeButton}>
          ×
        </button>

        <div className={s.content}>
          <div className={s.mediaContainer}>
            {slides.map((slide, idx) =>
              idx === slideIdx ? (
                slide.type === "video" ? (
                  <video
                    key={idx}
                    ref={videoRef}
                    src={slide.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className={s.slide}
                  />
                ) : (
                  <img
                    key={idx}
                    src={slide.src}
                    srcSet={slide.srcSet}
                    alt=""
                    className={s.slide}
                  />
                )
              ) : null
            )}

            {slides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className={`${s.slideNavButton} ${s.prev}`}>
                  ‹
                </button>
                <button
                  onClick={nextSlide}
                  className={`${s.slideNavButton} ${s.next}`}>
                  ›
                </button>
                <div className={s.dots}>
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSlideIdx(idx)}
                      className={`${s.dot} ${
                        idx === slideIdx ? s.dotActive : s.dotInactive
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className={s.details}>
            <h2 className={s.roomName}>{room.name}</h2>
            <h3 className={s.variantName}>{variant.name}</h3>

            <div className={s.properties}>
              {(variant.display_properties || []).map((dp) => (
                <p
                  key={dp.name}
                  className={s.propertyItem}>
                  • {dp.value}
                </p>
              ))}
            </div>

            <div className={s.priceContainer}>
              <span className={s.price}>
                {variant.total_price.currency}
                {Math.round(variant.total_price.discounted_price)}
              </span>
              <span className={s.originalPrice}>
                {variant.total_price.currency}
                {Math.round(variant.total_price.total_price)}
              </span>
            </div>

            {variant.cancellation_info?.free_cancel_description && (
              <p className={s.cancelDescription}>
                {variant.cancellation_info.free_cancel_description}
              </p>
            )}

            <button className={s.selectButton}>Select</button>
          </div>
        </div>
      </div>
    </div>
  );
}
