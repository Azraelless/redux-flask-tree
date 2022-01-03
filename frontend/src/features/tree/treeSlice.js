import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchChildren } from './treeAPI';

const initialState = {};

export const getChildren = createAsyncThunk(
  'tree/fetchCount',
  async (id, { dispatch, getState }) => {
    // if children branches already downloaded - just open it
    if (getState().tree[id]?.children) dispatch(toggleBranch(id));
    else {
      const response = await fetchChildren(id);
      return { data: response.data, parent: id };
    }
  }
);

export const treeSlice = createSlice({
  name: 'tree',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    toggleBranch: (state, action) => {
      state[action.payload].open = !state[action.payload].open
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChildren.fulfilled, (state, action) => {
        // if there's no parent - it's the root
        const parentId = action.payload.parent
        if (parentId) {
          // if there's a parent toggle it open
          state[parentId].open = !state[parentId].open;
          state[parentId].children = []
        }
        // if there are children
        if (action.payload.data?.length) {
          action.payload.data.forEach(branch => {
            // create each child
            state[branch.id] = { name: branch.name, open: false }
            // if there is a parent - assign the child to him
            if (parentId) state[parentId].children.push(branch.id)
          });
        }
      });
  },
});

export const { toggleBranch } = treeSlice.actions;

export default treeSlice.reducer;
