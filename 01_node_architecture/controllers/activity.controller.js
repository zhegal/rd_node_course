import {
  addNewActivity,
  getActivityStats,
  getAllActivities,
  removeActivity,
  setDoneActivity,
  updateActivity,
} from "../services/activity.service.js";

export function add({ name, freq }) {
  if (!name || !freq) throw new Error("Missing required fields");
  return addNewActivity(name, freq);
}

export function list() {
  return getAllActivities();
}

export function done({ id }) {
  if (!id) throw new Error("Missing required fields");
  return setDoneActivity(id);
}

export function stats() {
  return getActivityStats();
}

export function remove({ id }) {
  if (!id) throw new Error("Missing required fields");
  return removeActivity(id);
}

export function update({ id, name, freq }) {
  if (!id, !name, !freq) throw new Error("Missing required fields");
  return updateActivity(id, name, freq);
}
