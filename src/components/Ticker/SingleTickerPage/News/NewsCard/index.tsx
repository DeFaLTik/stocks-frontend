import { INews } from "@/models";
import { format } from "date-fns";

export default function NewsCard({ data }: { data: INews }) {
  return (
    <div className="w-full h-full grid grid-cols-1 grid-rows-4">
      <div className="row-span-2  break-words">
        <div className="w-full h-full line-clamp-2 font-Roboto">
          {data.title.slice(0, data.title.lastIndexOf("-") - 1) + "."}
        </div>
      </div>
      <div className="flex justify-end text-neutral-400">{data.author}</div>
      <div className="flex justify-end text-neutral-400">
        {format(new Date(data.published_at), "dd.MM.yyyy")}
      </div>
    </div>
  );
}
