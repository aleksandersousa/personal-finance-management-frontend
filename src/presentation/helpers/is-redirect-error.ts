export function isRedirectError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return (
    'digest' in error &&
    typeof error.digest === 'string' &&
    error.digest.startsWith('NEXT_REDIRECT')
  );
}
