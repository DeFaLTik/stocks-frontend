"use client";
import { useEffect, useState } from "react";
import styles from "./scrollToTopBtn.module.css";

const ScrollToTopButton = ({
  showTicker,
  showOnBottom,
}: {
  showTicker: boolean;
  showOnBottom: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const toggleVisibility = () => {
    const element = document.getElementById("scrollable-component");
    if (element === null) {
      throw Error("no sush element");
    }
    const curScrollPos = element.scrollTop;
    const isVisible = prevScrollPos < curScrollPos && curScrollPos > 300;
    setPrevScrollPos(curScrollPos);
    setIsVisible(isVisible);
  };
  const scrollToTop = () => {
    const element = document.getElementById("scrollable-component");
    if (element === null) {
      throw Error("no sush element");
    }
    element.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    const element = document.getElementById("scrollable-component");
    if (element === null) {
      throw Error("no sush element");
    }
    element.addEventListener("scroll", toggleVisibility);
    return () => {
      element.removeEventListener("scroll", toggleVisibility);
    };
  }, [prevScrollPos]);
  return (
    <div
      className={`${styles.scrollToTop} dark:bg-black dark:text-zinc-200 dark:border-zinc-700`}
      onClick={scrollToTop}
      style={
        (isVisible || showOnBottom) && showTicker
          ? { bottom: "2rem" }
          : { bottom: "-3rem" }
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </div>
  );
};
export default ScrollToTopButton;
