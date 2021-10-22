import { memo } from "react";

const Time = ({ time }) => (
  <time className="vp-controls__time" dateTime={time}>
    {time}
  </time>
);

export default memo(Time);
