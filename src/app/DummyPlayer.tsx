/* TO BE REMOVED */

import { forwardRef } from "react";

export const DummyPlayer = forwardRef<any, any>(function ({ src }, ref) {
  return (
    <audio
      className="DUMMY_player"
      crossOrigin="anonymous"
      src={src}
      ref={ref}
      controls
    />
  );
});
