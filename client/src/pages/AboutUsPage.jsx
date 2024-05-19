import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData4 from "./AnimationIcons.json";
import "./AboutUsPage.css";

const AboutUsPage = () => {
  const animationContainerRef = useRef(null);

  useEffect(() => {
    if (animationContainerRef.current) {
      const anim = lottie.loadAnimation({
        container: animationContainerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData4,
      });
      anim.setSpeed(0.2);

      return () => anim.destroy();
    }
  }, []);
  return (
    <div>
      {}
      <div className="about-us-content">
        <h1>About Us</h1>
        <p>
          Welcome to our online bookstore and book marketplace! This platform
          serves as a marketplace where you can buy and sell books. Once
          registered, you can create your own book listings to sell your
          products. Explore our wide range of books and start trading today!
        </p>

        <h2>Operating Instructions</h2>
        <p>
          To effectively navigate and utilize this platform, follow these
          instructions:
        </p>
        <ul>
          <li>
            <strong>Homepage:</strong> Browse through all the available books
            for buying or selling.
          </li>
          <li>
            <strong>About Us:</strong> Find information about the platform and
            usage guidance.
          </li>
          <li>
            <strong>Register/Login Page:</strong> Register or log in to access
            the platform.
          </li>
          <li>
            <strong>Liked Page:</strong> View all the books you have liked.
            (Only registered users can access this page)
          </li>
          <li>
            <strong>My Cards:</strong> Access all the books you have created for
            sale. (Only registered sellers can access this page)
          </li>
          <li>
            <strong>Create New Card:</strong> Create a new book listing to sell.
            (Only registered sellers can access this page)
          </li>
          <li>
            <strong>Sandbox:</strong> Exclusively for admins, this section
            allows you to monitor user activities, manage user statuses, and
            delete users as needed.
          </li>
        </ul>
        <p>
          All major actions within the platform are available in the left drawer
          and footer navigation bar, ensuring convenient access from anywhere.
        </p>
        <p>
          Admins have access to a sandbox where they can monitor user
          activities, change user statuses, and delete users.
        </p>

        <h2>Our Story</h2>
        <p>
          Our company, founded by Oran Meir, has achieved remarkable success
          stories in just a few years of operation. We are committed to
          providing an exceptional trading experience for our users and look
          forward to collaborating with you.
        </p>

        <h2>Contact Us</h2>
        <p>
          For support or inquiries about this platform, feel free to contact us
          at any time: <strong>050-33333574</strong>.
        </p>
      </div>

      {}
      <div ref={animationContainerRef} className="animation-container"></div>
    </div>
  );
};

export default AboutUsPage;
