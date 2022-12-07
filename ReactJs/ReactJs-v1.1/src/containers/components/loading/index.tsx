import { RootState } from "boot/rootState";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";

export default function LoadingComponent() {
  const { isLoading } = useSelector(
    (state: RootState) => ({
      isLoading: state.common.isLoading
    }),
    shallowEqual
  );

  return isLoading ? (
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  ) : null;
}
