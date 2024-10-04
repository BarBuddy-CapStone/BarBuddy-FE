import React from "react";
import { BookingTableInfo, CustomerForm, BarInfo, TableSelection, TimeSelection } from "src/pages";

const BookingTable = () => {
  return (
    <div className="flex overflow-hidden flex-col bg-zinc-900">
      <main className="self-center mt-4 mx-4 w-full max-w-[1100px]"> {/* Reduced margins */}
        <div className="flex gap-2 max-md:flex-col">
          <div className="flex flex-col w-8/12 max-md:w-full">
            <BookingTableInfo />
            <TableSelection />
            <TimeSelection />
            <CustomerForm />
          </div>
          <BarInfo />
        </div>
      </main>
    </div>
  );
};

export default BookingTable;
