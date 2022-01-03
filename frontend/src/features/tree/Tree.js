import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getChildren,
  toggleBranch,
} from './treeSlice';
import styles from './Tree.module.css';

export function Tree() {
  const rootId = 1
  const root = useSelector(state => state.tree[rootId]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!root) {
      dispatch(getChildren())
    }
  }, [])

  return (
    root ? <Branch id={rootId} /> : <div>No data yet</div>
  );
}

function Branch(props) {
  const dispatch = useDispatch();
  const id = props.id;
  const branch = useSelector(state => state.tree[id])

  return (
    <div>
      <div onClick={() => branch.open ? dispatch(toggleBranch(id)) : dispatch(getChildren(id))}>
        <span className={styles.icon}>
          {branch.children?.length !== 0 ? (branch.open ? '-' : '+') : ''}
        </span>
        {branch.name}
      </div>
      {branch.open && branch.children?.length > 0 && (
        <div className={styles.branchChildren}>
          {branch.children.map(child => (<Branch id={child} />))}
        </div>
      )}
    </div>
  );
}
