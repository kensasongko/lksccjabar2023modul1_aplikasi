'use client';

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

type DeleteButtonProps = {
  id: string;
}

export const DeleteButton = (props: DeleteButtonProps) => {
  const router = useRouter();
  const handleDelete = async (e: MouseEvent) => {
    const res = await fetch(`/api/messages/${props.id}`, {
      method: "delete",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (res.status !== 200) {
      const result = await res.json();
      const errDiv = document.getElementById('error-message')
      if (errDiv)
        errDiv.innerText = result.error_message;
    } else {
      router.refresh();
    }
  };

  return (
    <button className="bg-red-500 rounded inline-block px-3 py-1 text-sm font-semibold text-white mr-2 mb-2" onClick={handleDelete}>Delete</button>
  );
}
