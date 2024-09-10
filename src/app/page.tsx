'use client';

import {Alloy} from "@/app/types";
import { useState, useEffect } from 'react';

export default function Home() {
  const [alloys, setAlloys] = useState<Alloy[]>([]);

  useEffect(() => {
    async function fetchAlloys() {
      const response = await fetch('/api/alloys');
      const data = await response.json();
      setAlloys(data);
    }
    fetchAlloys();
  }, []);

  return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Available Alloys</h1>
        <ul>
          {alloys.map((alloy) => (
              <li key={alloy.name} className="mb-2">
                {alloy.name}
              </li>
          ))}
        </ul>
      </main>
  );
}