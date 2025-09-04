import { calculateMetal } from '@/functions/algorithm';
import { qm, byTypeMap, bronzeComponents, timeIt } from './helpers';
import type { SmeltingComponent } from '@/types';

/**
 * Computes the total output in mB from a set of used minerals.
 * @param units - an array of objects containing mineral.yield and quantity
 * @returns total produced mB from all minerals
 */
function totalUsed(units: { mineral: { yield: number }, quantity: number }[]) {
  return units.reduce((s, u) => s + u.mineral.yield * u.quantity, 0);
}

describe('calculateMetal - failure & edge cases', () => {
  const bronze = bronzeComponents();

  it('No minerals at all -> not enough total material available', () => {
    const inv = byTypeMap([]);
    const res = calculateMetal(432, bronze, inv);
    expect(res.success).toBe(false);
    expect(res.message).toContain('Not enough total material available');
  });

  it('Required component key missing in map -> not enough <type> for minimum requirement', () => {
    // Copper present, tin missing entirely
    const inv = byTypeMap([
      ['copper', [qm('Medium Copper', 'copper', 24, 100)]],
    ]);
    const res = calculateMetal(432, bronze, inv);
    expect(res.success).toBe(false);
    expect(res.message?.toLowerCase()).toContain('not enough tin');
  });

  it('Conflicting percentage windows (mins add to > 100%) -> UNSAT by combination', () => {
    // Create impossible ratios for smelting component
    const badAlloy: SmeltingComponent[] = [
      { mineral: 'a', min: 60, max: 100 },
      { mineral: 'b', min: 50, max: 100 },
    ];
    const inv = byTypeMap([
      ['a', [qm('A1', 'a', 10, 100)]],
      ['b', [qm('B1', 'b', 10, 100)]],
    ]);
    const res = calculateMetal(100, badAlloy, inv);
    expect(res.success).toBe(false);
    expect(res.message).toContain('Could not find valid combination of materials');
  });

  it('Conflicting percentage windows (maxes sum < 100%) -> UNSAT by combination', () => {
    // Create impossible ratios for smelting component
    const badAlloy: SmeltingComponent[] = [
      { mineral: 'a', min: 0,  max: 40 },
      { mineral: 'b', min: 0,  max: 30 },
    ];
    const inv = byTypeMap([
      ['a', [qm('A1', 'a', 10, 100)]],
      ['b', [qm('B1', 'b', 10, 100)]],
    ]);
    const res = calculateMetal(100, badAlloy, inv);
    expect(res.success).toBe(false);
    expect(res.message).toContain('Could not find valid combination of materials');
  });

  it('Boundary acceptance: exact 8% tin is allowed', () => {
    // target 400; tin=32 (8%), copper=368 (92%)
    const inv = byTypeMap([
      ['tin',    [qm('Tiny Tin',    'tin',    16, 2)]],   // 32
      ['copper', [qm('Copper 16u',  'copper', 16, 23)]],  // 368
    ]);
    const res = calculateMetal(400, bronze, inv);
    expect(res.success).toBe(true);
    expect(res.outputMb).toBe(400);
    expect(totalUsed(res.usedMinerals)).toBe(400);
  });

  it('Map key case-insensitivity (helpers lower-case keys) -> still succeeds', () => {
    // byTypeMap lower-cases keys + qm lower-cases produces -> should work
    const inv = byTypeMap([
      ['Tin',    [qm('Small Cassiterite', 'TIN',    16, 3)]],
      ['Copper', [qm('Medium Copper',     'Copper', 24, 7),
                  qm('Large Copper',      'cOpPeR', 36, 6)]],
    ]);
    const res = calculateMetal(432, bronze, inv);
    expect(res.success).toBe(true);
    expect(res.outputMb).toBe(432);
  });

  it('Component order robustness for a known feasible case', () => {
    // robustness/invariance check: verifies that a known-feasible bronze request succeeds '
    // regardless of the order of the alloy components array
    const inv = byTypeMap([
      ['tin',    [qm('Small Cassiterite', 'tin', 16, 3)]],
      ['copper', [qm('Medium Copper', 'copper', 24, 7), qm('Large Copper', 'copper', 36, 6)]],
    ]);
    const bronze1 = bronze;
    const bronze2 = [bronze[1], bronze[0]]; // swap order
    expect(calculateMetal(432, bronze1, inv).success).toBe(true);
    expect(calculateMetal(432, bronze2, inv).success).toBe(true);
  });
});
