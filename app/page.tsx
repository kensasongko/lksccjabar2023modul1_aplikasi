import { AddForm } from '@/components/add';
import { DeleteButton } from '@/components/delete';
import { SearchForm } from '@/components/search';
import { Message } from '@/libs/types';

async function getData() {
  const BASE_URL = process.env.BASE_URL;
  const res = await fetch(`${BASE_URL}/api/messages`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
 
  return res.json();
}

async function searchData(searchString: string) {
  const BASE_URL = process.env.BASE_URL;
  const res = await fetch(`${BASE_URL}/api/search/message`, { 
    cache: 'no-store' ,
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({search: searchString}),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
 
  return res.json();
}

export default async function Home({params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
  }) {
  let data: Message[];
  const searchParam = searchParams.search;
  const searchString = (searchParam?searchParam.toString():'');

  if (searchString !== '') {
    data = await searchData(searchString);
  } else {
    data = await getData();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-5">
      <div className="w-full max-w-5xl items-center justify-between font-mono text-sm">
        <SearchForm search={searchString} />
      </div>

      <div className="grid grid-cols-4">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-6 m-4">
          <AddForm />
        </div>

        {data && data.map((message:Message) => (
          <div className="bg-white relative flex before:absolute m-4 shadow-lg rounded">
            <div className="max-w-sm overflow-hidden">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{message.title}</div>
                <p className="text-gray-700 text-base">{message.message}</p>
              </div>
              <div className="px-6 pt-4 pb-2">
                <DeleteButton id={message.id} />
              </div>
            </div>
          </div>
        ))}
        </div>
    </main>
  )
}
