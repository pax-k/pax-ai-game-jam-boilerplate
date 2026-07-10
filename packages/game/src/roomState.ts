export type PlayerCollection<T> = {
  forEach(callback: (value: T, key: string) => void): void;
};

export type PlayerLookup<T> = {
  get(key: string): T | undefined;
};

export function forEachAvailablePlayer<T>(
  players: PlayerCollection<T> | undefined,
  callback: (player: T, sessionId: string) => void
) {
  players?.forEach(callback);
}

export function getAvailablePlayer<T>(players: PlayerLookup<T> | undefined, sessionId: string) {
  return players?.get(sessionId);
}
