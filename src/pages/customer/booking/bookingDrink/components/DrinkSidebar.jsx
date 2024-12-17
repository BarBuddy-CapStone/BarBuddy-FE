import React from "react";
import { SelectedItems } from "src/pages";

const DrinkSidebar = ({
  drinks,
  onRemove,
  discount,
  onProceedToPayment,
  numOfPeople
}) => {
  return (
    <aside className="w-full lg:w-full flex flex-col gap-4 mt-6 lg:mt-0 px-4">
      <SelectedItems
        drinks={drinks}
        onRemove={onRemove}
        discount={discount}
        onProceedToPayment={onProceedToPayment}
        numOfPeople={numOfPeople}
      />
    </aside>
  );
};

export default DrinkSidebar;
