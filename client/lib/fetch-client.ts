// lib/fetch-client.ts
export const authFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");

  return fetch(`http://localhost:4400${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
