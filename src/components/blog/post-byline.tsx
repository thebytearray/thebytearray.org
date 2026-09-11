import { Avatar } from "@heroui/react";

import { team } from "@/content/site";
import { formatDate } from "@/lib/format";

export function PostByline({ author, date }: { author: string; date: string }) {
  const member = team.find((person) => person.name === author);

  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        {member ? <Avatar.Image alt="" src={member.avatar} /> : null}
        <Avatar.Fallback>{author.charAt(0)}</Avatar.Fallback>
      </Avatar>
      <p className="text-sm">
        <span className="font-medium">{author}</span>
        {member ? <span className="text-muted">, {member.role.toLowerCase()}</span> : null}
        <br />
        <time className="text-muted" dateTime={date}>
          {formatDate(date)}
        </time>
      </p>
    </div>
  );
}
