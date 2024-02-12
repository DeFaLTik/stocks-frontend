import { ChangeEventHandler } from "react";
import { motion as m } from "framer-motion";

const CustomInput = ({
  value,
  onChange,
  name,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  name: string;
}) => {
  return (
    <m.div
      className={`absolute flex justify-center items-center bg-transparent w-full h-16 px-2 z-10`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <input
        className={
          `border-[1px] border-transparent/5 dark:border-neutral-800/75 h-[44px] backdrop-blur-sm ` +
          `bg-transparent/5 dark:focus:bg-black focus:bg-white focus:shadow-sm duration-400 ` +
          `w-full rounded-full py-3 px-5 outline-none text-blue-gray-700 font-sans`
        }
        style={{
          transitionProperty: "background-color",
          transitionDuration: "1000ms",
        }}
        value={value}
        placeholder="Search"
        onChange={onChange}
        name={name}
      />
    </m.div>
  );
};

export default CustomInput;

// const CustomInput = forwardRef((props, ref) => {
//   return (
//
//   );
// });
