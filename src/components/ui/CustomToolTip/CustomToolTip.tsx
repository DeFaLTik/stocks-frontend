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
          <Divider className="w-6 h-[1px] absolute top-0" />
          <div>{content}</div>
        </>
      }
      placement="bottom"
      closeDelay={100}
      offset={0}
      className="shadow-none bg-transparent rounded-none"
    >
      {children}
    </Tooltip>
  );
}
