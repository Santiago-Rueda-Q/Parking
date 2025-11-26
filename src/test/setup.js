import { afterEach, vi } from 'vitest'

afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
})

if (!globalThis.crypto || !globalThis.crypto.randomUUID) {
    globalThis.crypto = {
        randomUUID: () => '00000000-0000-4000-8000-TESTUUID0000'
    }
}
if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},    
    removeListener: () => {}, 
    dispatchEvent: () => false
  })
}