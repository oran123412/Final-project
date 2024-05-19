import React, { useRef, useEffect } from "react";
import lottie from "lottie-web";
import animationData from "./Animation.json";

const MyLottieAnimation = () => {
  const animationContainerRef = useRef(null);

  useEffect(() => {
    if (animationContainerRef.current) {
      const anim = lottie.loadAnimation({
        container: animationContainerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
      return () => anim.destroy();
    }
  }, []);

  return (
    <div
      ref={animationContainerRef}
      style={{ width: "100%", height: "30vh" }}
    />
  );
};

export default MyLottieAnimation;
