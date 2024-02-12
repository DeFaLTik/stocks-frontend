import { motion as m } from "framer-motion";
import { PropsWithChildren } from "react";

export default function DefaultPageAnimation({
  children,
  className,
  keyChildren,
}: {
  children: React.ReactNode;
  className: string;
  keyChildren: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.4,
          type: "tween",
          ease: "easeInOut",
        },
      }}
      transition={{ duration: 0.4, type: "tween" }}
      className={className}
      key={keyChildren}
    >
      {children}
    </m.div>
  );
}
