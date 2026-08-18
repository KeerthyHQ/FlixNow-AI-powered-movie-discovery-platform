import React from "react";

function Pagination({ previous, next, pageno }) {
  return (
    <div className="flex justify-center items-center gap-6 py-8">

      {/* Previous */}
      <button
        onClick={previous}
        className="px-6 py-2 rounded-full
        bg-[#2a2a2a] text-gray-300
        hover:bg-[#3a3a3a] hover:text-white
        transition duration-300 shadow-md"
      >
 
      <i className="fa-solid fa-caret-left mr-2"></i> 

      Previous

      </button>


      {/* Page Number */}

      <div className="px-5 py-2 rounded-full bg-black border border-gray-700 text-white font-semibold shadow">
        {pageno}

      </div>

      {/* Next */}
      <button
        onClick={next}
        className="px-6 py-2 rounded-full
        bg-[#2a2a2a] text-gray-300
        hover:bg-[#3a3a3a] hover:text-white
        transition duration-300 shadow-md"
      >
        Next 
        <i className="fa-solid fa-caret-right ml-2"></i>
      </button>

    </div>
  );
}

export default Pagination;
