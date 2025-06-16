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
  const activity = addNewActivity(name, freq);
  const body = [
    'Added new activity:',
    `ID: ${activity.id}`,
    `Name: ${activity.name}`,
    `Frequency: ${activity.freq}`,
  ];
  console.log(body.join('\n'));
}

export function list() {
  const list = getAllActivities();
  console.table(list, ['id', 'name', 'freq', 'createdAt', 'updatedAt']);
}

export function done({ id }) {
  if (!id) throw new Error("Missing required fields");
  return setDoneActivity(id);
}

export function stats() {
  const stats = getActivityStats();
  console.table(stats);
}

export function remove({ id }) {
  if (!id) throw new Error("Missing required fields");
  return removeActivity(Number(id));
}

export function update({ id, name, freq }) {
  if (!id, !name, !freq) throw new Error("Missing required fields");
  return updateActivity(id, name, freq);
}
