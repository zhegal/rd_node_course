export function getCurrentDate() {
  const shift = parseInt(process.env.DAY_OFFSET || "0", 10);
  const now = Date.now() + shift * 24 * 60 * 60 * 1000;
  const date = new Date(now);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
