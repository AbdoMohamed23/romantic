export const config = {
  music: {
    storageKey: 'romantic-site-music-playing',
    pendingStartKey: 'romantic-site-music-pending',
  },
  auth: {
    storageKey: 'romantic-site-authenticated',
    adminStorageKey: 'romantic-site-admin',
  },
  animations: {
    fullscreenReveal: {
      holdDuration: 1.4,
      openDuration: 1.2,
      heartCount: 65,
    },
    page: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
    final: {
      wordDelay: 140,
      celebrationDuration: 4,
    },
  },
}
