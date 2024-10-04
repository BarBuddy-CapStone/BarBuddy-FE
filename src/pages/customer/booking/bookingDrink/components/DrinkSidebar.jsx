import React from "react";
import { Filter, SelectedItems } from "src/pages";

const DrinkSidebar = () => {
  return (
    <aside className="w-full flex flex-col gap-4 lg:w-full">
      <Filter />
      <SelectedItems />
    </aside>
  );
};

export default DrinkSidebar;
