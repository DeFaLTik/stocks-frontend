import { Divider, Tooltip } from "@nextui-org/react";

export default function CustomToolTip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  return (
    <Tooltip
      content={
        <>
          {/* <Divider className="w-6 h-[1px] absolute top-0" /> */}
          <div className="font-light text-xs">{content}</div>
        </>
      }
      placement="bottom"
      closeDelay={100}
      offset={0}
      className={
        `shadow-sm rounded-lg border-[1px] border-transparent ` +
        `bg-zinc-200 text-black dark:bg-black dark:text-zinc-200 dark:border-zinc-700`
      }
    >
      {children}
    </Tooltip>
  );
}
