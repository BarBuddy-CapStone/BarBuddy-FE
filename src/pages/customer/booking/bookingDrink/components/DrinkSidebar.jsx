import React from "react";
import { Filter, SelectedItems } from "src/pages";

const DrinkSidebar = ({ drinks, parsePrice, onRemove }) => {
  return (
    <aside className="w-full lg:w-full flex flex-col gap-4 mt-6 lg:mt-0 px-4"> {/* Adjusted spacing */}
      <div className="mb-4"> {/* Adds margin below the Filter */}
        <Filter />
      </div>
      <SelectedItems drinks={drinks} parsePrice={parsePrice} onRemove={onRemove} />
    </aside>
  );
};

export default DrinkSidebar;
