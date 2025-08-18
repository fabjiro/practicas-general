export function nivelDePrioridadAlreadyExists(data, prioridad) {
  return data.some((item) => item.prioridad == prioridad);
}
