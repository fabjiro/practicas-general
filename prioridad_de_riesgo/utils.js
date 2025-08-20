export function isPriorityLevelTaken(data, prioridad) {
  return data.some((item) => item.prioridad == prioridad);
}