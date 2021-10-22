import { memo } from "react";

const Loader = ({ on }) =>
  on && (
    <div className="vp-loader">
      <div />
    </div>
  );

export default memo(Loader);
