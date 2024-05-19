import React, { useEffect, useRef } from "react";
import animationData3 from "./Animation404.json";
import lottie from "lottie-web";

const MyLottieAnimation3 = () => {
  const animationContainerRef = useRef(null);

  useEffect(() => {
    if (animationContainerRef.current) {
      const anim = lottie.loadAnimation({
        container: animationContainerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData3,
      });

      return () => anim.destroy();
    }
  }, []);

  return <div ref={animationContainerRef} />;
};

export default MyLottieAnimation3;
