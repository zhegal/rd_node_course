import { getCurrentDate } from "../lib/getCurrentDate.js";
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
  const item = setDoneActivity(id);
  const day = getCurrentDate();
  console.log(`Activity "${item.name}" set as ✅ done for ${day}`);
}

export function stats() {
  const stats = getActivityStats();
  console.table(stats);
}

export function remove({ id }) {
  if (!id) throw new Error("Missing required fields");
  removeActivity(Number(id));
  console.log(`Activity with id ${id} was successfully deleted`);
}

export function update({ id, name, freq }) {
  if (!id, !name, !freq) throw new Error("Missing required fields");
  const activity = updateActivity(id, name, freq);
  const body = [
    'Updated activity:',
    `ID: ${activity.id}`,
    `Name: ${activity.name}`,
    `Frequency: ${activity.freq}`,
  ];
  console.log(body.join('\n'));
}
