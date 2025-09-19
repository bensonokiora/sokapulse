'use client';

import { useEffect, useState } from 'react';

export default function Year() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <span id="year">{year}</span>;
}