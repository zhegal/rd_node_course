export function newIdFromArray(arr) {
  const withId = arr.filter((obj) => typeof obj.id === "number");
  if (withId.length === 0) return 1;
  const maxId = Math.max(...withId.map((obj) => obj.id));
  return maxId + 1;
}
