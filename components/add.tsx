'use client';

import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export const AddForm = () => {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      title: { value: string };
      message: { value: string };
    };
    const title = target.title.value;
    const message = target.message.value;
    const res = await fetch(`/api/messages`, {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: title, message: message}),
    });
    const result = await res.json();
    if (res.status !== 200) {
      const errDiv = document.getElementById('error-message')
      if (errDiv)
        errDiv.innerText = result.error_message;
    } else {
      target.title.value = "";
      target.message.value = "";
      router.refresh();
    }
  };

  return (
    <form method="post" action="/api/messages" onSubmit={handleSubmit}>
      <div className="text-red-400" id="error-message"></div>
      <div className="mb-4">
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="title" id="title" type="text" placeholder="Title"/>
      </div>
      <div className="mb-4">
        <textarea className="shadow appearance-none border border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" name="message" placeholder="Message" rows={5}></textarea>
      </div>
      <div className="flex items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Add
        </button>
      </div>
    </form>
  );
}
