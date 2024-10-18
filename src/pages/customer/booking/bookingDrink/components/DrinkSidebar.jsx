import React from "react";
import { SelectedItems } from "src/pages";

const DrinkSidebar = ({
  drinks,
  onRemove,
  discount,  // Add discount prop
}) => {
  return (
    <aside className="w-full lg:w-full flex flex-col gap-4 mt-6 lg:mt-0 px-4">
      <SelectedItems
        drinks={drinks}
        onRemove={onRemove}
        discount={discount}  // Pass discount to SelectedItems
      />
    </aside>
  );
};

export default DrinkSidebar;
