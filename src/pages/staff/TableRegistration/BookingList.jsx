import React from "react";
import FilterSection from "./FilterSection";
import BookingTable from "./BookingTable";

function BookingList() {
  return (
    <main className="flex overflow-hidden flex-col grow px-7 pt-7 pb-32 w-full bg-white max-md:px-5 max-md:pb-24 max-md:max-w-full">
      <h1 className="self-start ml-7 text-4xl font-bold text-sky-900 max-md:ml-2.5 max-md:text-3xl">
        DANH SÁCH ĐẶT BÀN
      </h1>
      <section className="flex flex-col px-7 py-14 w-full text-lg bg-white rounded-3xl border border-black border-solid shadow-lg max-md:px-5 max-md:mr-1 max-md:max-w-full">
        <FilterSection />
      </section>
      <BookingTable />
    </main>
  );
}

export default BookingList;
