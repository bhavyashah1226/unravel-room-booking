import React, { useState } from "react";
import RoomCardMedia from "./RoomCardMedia";
import RoomVariantsModal from "./RoomVariantsModal";
import sampleJson from "../data/rooms.json";
import s from "./RoomCard.module.scss";

export default function RoomCard({ room }) {
  const hotel = sampleJson.hotel_details;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [base, ...extras] = room.variants || [];
  const fromPrice = room.variants?.length
    ? Math.min(...room.variants.map((v) => v.total_price.discounted_price))
    : 0;
  const currency = base?.total_price.currency || "";

  return (
    <>
      <div className={s.container}>
        <div className={s.mediaWrapper}>
          <RoomCardMedia
            variant={base}
            hotel={hotel}
          />
        </div>

        <div className={s.content}>
          <h3 className={s.title}>{room.name}</h3>

          {room.description && (
            <p className={s.description}>{room.description}</p>
          )}

          {base.display_properties && base.display_properties.length > 0 && (
            <p className={s.propertiesLine}>
              {base.display_properties.map((dp) => dp.value).join(" · ")}
            </p>
          )}

          <p className={s.priceText}>
            {currency}
            {Math.round(fromPrice)}
          </p>

          <div className={s.footer}>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={s.selectButton}>
              Select
            </button>

            {extras.length > 0 && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={s.extrasButton}>
                See {extras.length} more options
              </button>
            )}
          </div>
        </div>
      </div>

      <RoomVariantsModal
        open={isModalOpen}
        room={room}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
