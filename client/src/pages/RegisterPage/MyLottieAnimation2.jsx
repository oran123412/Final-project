import React, { useRef, useEffect } from "react";
import lottie from "lottie-web";
import animationData2 from "./Animation2.json";

const MyLottieAnimation2 = () => {
  const animationContainerRef2 = useRef(null);

  useEffect(() => {
    if (animationContainerRef2.current) {
      const anim = lottie.loadAnimation({
        container: animationContainerRef2.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData2,
      });
      return () => anim.destroy();
    }
  }, []);

  return (
    <div
      ref={animationContainerRef2}
      style={{ position: "absolute", left: 0, width: "100%", height: "150vh" }}
    />
  );
};

export default MyLottieAnimation2;
