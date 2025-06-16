import { Database } from "../lib/db.js";
import { getCurrentDate } from "../lib/getCurrentDate.js";
import { newIdFromArray } from "../lib/newIdFromArray.js";

const db = new Database();

export function addNew(name, freq) {
  const allItems = db.get();
  const createdAt = getCurrentDate();
  const id = newIdFromArray(allItems);

  const item = {
    id,
    name,
    freq,
    createdAt,
    updatedAt: createdAt,
    doneLog: [],
  };

  allItems.push(item);
  db.save(allItems);
  return item;
}

export function getAll() {
  return db.get();
}

export function setDoneById(id) {
  const allItems = db.get();
  const date = getCurrentDate();

  const item = allItems.find(i => i.id === id);
  if (!item) return null;

  if (!Array.isArray(item.doneLog)) {
    item.doneLog = [];
  }

  if (!item.doneLog.includes(date)) {
    item.doneLog.push(date);
  }

  db.save(allItems);
  return item;
}

export function getStats() {
  return "stats";
}

export function removeById(id) {
  const allItems = db.get();
  const index = allItems.findIndex(i => i.id === id);

  if (index === -1) return false;

  allItems.splice(index, 1);
  db.save(allItems);
  return true;
}

export function updateById(id, name, freq) {
  return "updated";
}
