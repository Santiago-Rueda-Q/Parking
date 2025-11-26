// src/test/unit/map.service.spec.js
import { describe, it, expect } from 'vitest'
import { MapService } from '@/services/map.service'

describe('MapService', () => {
  const repo = {
    async load() { return { rows: 2, cols: 3, occupied: ['A1'] } },
    async save(x) { this.saved = x }
  }
  const entriesMock = { async listActive() { return [] } }
  const svc = new MapService(repo, entriesMock)

  it('genera estructura válida del mapa', async () => {
    const grid = await svc.getGrid()

    expect(Array.isArray(grid)).toBe(true)
    expect(grid.length).toBeGreaterThan(0)

    expect(grid[0]).toHaveProperty('code')
    expect(grid[0]).toHaveProperty('isOccupied') // <-- aquí el cambio

    const a1 = grid.find(c => c.code === 'A1')
    expect(a1).toBeTruthy()

  })
})
