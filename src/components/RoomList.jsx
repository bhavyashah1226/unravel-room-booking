import React, { useState, useRef, useEffect, useCallback } from "react";
import RoomCard from "./RoomCard";
import LoadingSpinner from "./LoadingSpinner";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import sampleJson from "../data/rooms.json";
import s from "./RoomList.module.scss";

const roomsData = sampleJson.rooms_by_serial_no.flatMap((g) => g.rooms);
const PAGE_SIZE = 10;

export default function RoomList() {
  const [page, setPage] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef();

  const loadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const start = (page - 1) * PAGE_SIZE;
      const next = roomsData.slice(start, start + PAGE_SIZE);
      setRooms((prev) => [...prev, ...next]);
      setPage((p) => p + 1);
      setLoading(false);
    }, 300);
  }, [page]);

  useEffect(() => {
    loadMore(); // initial load
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useInfiniteScroll({
    loading,
    hasMore: rooms.length < roomsData.length,
    onLoadMore: loadMore,
    sentinelRef,
  });

  return (
    <div className={s.container}>
      {rooms.map((room, idx) => (
        <RoomCard
          key={`${room.room_type_code}-${idx}`}
          room={room}
        />
      ))}

      {loading && <LoadingSpinner />}

      <div ref={sentinelRef} />
    </div>
  );
}
