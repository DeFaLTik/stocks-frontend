import { motion as m } from "framer-motion";

export default function About() {
  return (
    <m.div
      key="about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.4,
          // delay: 0.2,
          type: "tween",
          ease: "easeInOut",
        },
      }}
      transition={{ duration: 0.4, type: "tween" }}
      className="w-full h-full z-50 flex justify-center whitespace-nowrap 
      items-center text-7xl font-semibold bg-gradient-to-b 
      from-transparent
      dark:from-transparent/50   dark:to-neutral-800 to-neutral-200 backdrop-blur-3xl"
    >
      About
    </m.div>
  );
}
