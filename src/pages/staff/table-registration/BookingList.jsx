import React, { useState } from "react";
import { FilterSection, BookingTable } from "src/pages";

function BookingList() {
  const [filter, setFilter] = useState({
    name: "",
    phone: "",
    email: "",
    status: "Đang phục vụ",
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <main className="flex overflow-hidden flex-col grow px-7 pt-7 pb-32 w-full bg-white max-md:px-5 max-md:pb-24 max-md:max-w-full">
      <section className="flex flex-col px-6 py-6 bg-white rounded-3xl border border-black border-solid max-md:px-5 max-md:mr-1 max-md:max-w-full">
        <FilterSection onFilterChange={handleFilterChange} />
      </section>
      <BookingTable filter={filter} />
    </main>
  );
}

export default BookingList;
