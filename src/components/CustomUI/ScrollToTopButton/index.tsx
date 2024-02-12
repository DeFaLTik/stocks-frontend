"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "@/styles/scrollToTopBtn.module.css";

const ScrollToTopButton = ({
  showOnBottom,
  isScrollGoingDown,
}: {
  showTicker: boolean;
  showOnBottom: boolean;
  isScrollGoingDown: CallableFunction;
}) => {
  const [isScrolled, setisScrolled] = useState(false);
  const [isGoingDown, setIsGoingDown] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const toggleVisibility = useCallback(
    (element: Event) => {
      if (element === null) {
        throw Error("no sush element");
      }
      const curScrollPos = (element.target as HTMLElement).scrollTop;
      setIsGoingDown(prevScrollPos < curScrollPos);
      isScrollGoingDown(prevScrollPos < curScrollPos);
      setPrevScrollPos(curScrollPos);
      setisScrolled(curScrollPos > 300);
    },
    [prevScrollPos, isScrollGoingDown]
  );
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
  }, [toggleVisibility]);
  return (
    <div
      className={`${styles.scrollToTop} border-2 bg-zinc-200  text-black rounded-full
       dark:bg-black dark:text-zinc-200 dark:border-zinc-700`}
      onClick={scrollToTop}
      style={
        (!isGoingDown || showOnBottom) && isScrolled
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
