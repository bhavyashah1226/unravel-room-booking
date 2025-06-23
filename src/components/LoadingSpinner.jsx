import React from "react";
import s from "./LoadingSpinner.module.scss";

export default function LoadingSpinner() {
  return (
    <div className={s.container}>
      <div className={s.spinner} />
    </div>
  );
}
