'use client';

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type SearchFormProps = {
  search: string;
}

export const SearchForm = (props: SearchFormProps) => {
  const router = useRouter();
  const [searchString, setSearchString] = useState(props.search);

  return (
    <form method="get" id="searchForm">
      <p className="flex w-full justify-center border-b border-gray-300 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4" type="text" name="search" placeholder="Search" value={searchString} onChange={(e) => setSearchString(e.target.value)} onKeyPress={(e) => {
    if(e.key === 'Enter') {
      (document.getElementById('searchForm')! as HTMLFormElement).submit();
    }
  }}/>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Search
        </button>
      </p>
    </form>
  );
}
