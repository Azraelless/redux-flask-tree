import counterReducer, { toggleBranch } from './treeSlice';

describe('counter reducer', () => {
  const initialState = {};
  const id = 1

  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({});
  });

  it('should handle toggleBranch', () => {
    const stateWithClosedBranch = {
      [id]: { name: 'name', open: false }
    }
    const actual = counterReducer(stateWithClosedBranch, toggleBranch(id));
    expect(actual[id].open).toEqual(true);
  });

  it('should handle decrement', () => {
    const stateWithClosedBranch = {
      [id]: { name: 'name', open: true }
    }
    const actual = counterReducer(stateWithClosedBranch, toggleBranch(id));
    expect(actual[id].open).toEqual(false);
  });
});
