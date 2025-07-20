export function createChatName(body: {
  name?: string;
  members: string[];
}): string {
  if (body.name) return body.name;

  const uniqueNames = Array.from(new Set(body.members));
  const joined = uniqueNames.join(" & ");

  return joined.length <= 128 ? joined : joined.slice(0, 125) + "...";
}
