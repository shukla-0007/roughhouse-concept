import { useSyncExternalStore } from 'react'

function createStore(initial) {
  let state = initial
  const listeners = new Set()
  return {
    get: () => state,
    set: (patch) => {
      const next = typeof patch === 'function' ? patch(state) : patch
      state = { ...state, ...next }
      listeners.forEach((l) => l())
    },
    sub: (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
  }
}

export const store = createStore({
  cursor: null, // label shown by the custom cursor
  ready: false, // loader finished
  scenesReady: 0, // WebGL scenes whose textures have resolved
})

export const useStore = (sel) => useSyncExternalStore(store.sub, () => sel(store.get()))
