export function getLastNDates(n) {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${day}`);
  }
  return dates;
}

export function calculateStatsForItem(item, last7, last30) {
  const log = item.doneLog || [];

  const done7 = log.filter((date) => last7.includes(date)).length;
  const done30 = log.filter((date) => last30.includes(date)).length;

  let expected7 = 1;
  let expected30 = 1;

  switch (item.freq) {
    case "daily":
      expected7 = 7;
      expected30 = 30;
      break;
    case "weekly":
      expected7 = 1;
      expected30 = 4;
      break;
    case "monthly":
      expected7 = 1;
      expected30 = 1;
      break;
  }

  const weekly = Math.min(100, Math.round((done7 / expected7) * 100));
  const monthly = Math.min(100, Math.round((done30 / expected30) * 100));

  return {
    id: item.id,
    name: item.name,
    freq: item.freq,
    weekly,
    monthly,
  };
}
