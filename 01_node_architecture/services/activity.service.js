import {
  addNew,
  getAll,
  getStats,
  removeById,
  setDoneById,
  updateById,
} from "../models/activity.model.js";

export function addNewActivity(name, freq) {
  const result = addNew(name, freq);
  return result;
}

export function getAllActivities() {
  const all = getAll();
  return all;
}

export function setDoneActivity(id) {
  return setDoneById(Number(id));
}

export function getActivityStats() {
  return getStats();
}

export function removeActivity(id) {
  return removeById(Number(id));
}

export function updateActivity(id, name, freq) {
  return updateById(Number(id), name, freq);
}
