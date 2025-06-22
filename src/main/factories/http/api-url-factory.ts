export const makeApiUrl = (path: string): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  return `${baseUrl}${path}`;
};
