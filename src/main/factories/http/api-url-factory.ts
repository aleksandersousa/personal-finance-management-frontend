export const makeApiUrl = (path: string): string => {
  const baseUrl =
    `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_VERSION}` ||
    'http://localhost:3000/api/v1';
  return `${baseUrl}${path}`;
};
