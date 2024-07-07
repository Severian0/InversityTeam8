let SearchBox = () => {
  return (
    <div class="relative trnasition-all duration-1000">
      <input
        type="search"
        name=""
        id=""
        placeholder="Search..."
        class="mx-1 text-gray-400 opacity-90 hover:opacity-100 py-[0.5px] font-jetbrains text-sm border border-dotted border-neutral-500 hover:border-orange-500 hover:border-solid rounded-md h-fit selectable-tag mt-auto cursor-pointer mb-1 filter-selectable-tag duration-600 ease-in-out whitespace-nowrap text-nowrap bg-transparent focus:border-transparent focus:ring-1 focus:ring-orange-500 focus:opacity-100 focus:outline-none pl-8 pr-2 w-28 focus:w-64 md:w-40 md:focus:w-80 transition-all"
      />
      <div class="absolute inset-y-0 left-2 flex items-center pointer-events-none">
        <svg
          class="w-4 h-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="10" cy="8" r="7"></circle>
          <line x1="21" y1="21" x2="17.65" y2="16.65"></line>
        </svg>
      </div>
    </div>
  );
};

export default SearchBox;
