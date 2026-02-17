export const makeApiUrl = (path: string): string => {
  const baseUrl =
    `${process.env.API_URL}/${process.env.API_VERSION}` ||
    'http://localhost:3000/api/v1';
  return `${baseUrl}${path}`;
};
