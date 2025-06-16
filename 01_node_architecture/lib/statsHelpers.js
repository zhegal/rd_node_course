export function getLastNDates(n) {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${day}`);
  }
  return dates;
}

export function calculateStatsForItem(item, days7, days30) {
  const log = item.doneLog || [];

  const done7 = log.filter(date => days7.includes(date)).length;
  const done30 = log.filter(date => days30.includes(date)).length;

  const weekly = Math.round((done7 / 7) * 100);
  const monthly = Math.round((done30 / 30) * 100);

  return {
    id: item.id,
    name: item.name,
    freq: item.freq,
    weekly,
    monthly,
  };
}