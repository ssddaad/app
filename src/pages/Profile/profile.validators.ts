export const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const isPhone = (v: string) =>
  /^[+]?[\d\s\-()]{7,20}$/.test(v);

export const isURL = (v: string) =>
  /^(https?:\/\/)?([^\s.]+\.[^\s]{2,}|localhost[:\d]*)[^\s]*$/i.test(v);

export const isPostal = (v: string) =>
  /^[A-Za-z0-9\s\-]{3,10}$/.test(v);
