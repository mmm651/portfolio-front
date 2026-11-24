/** Turn any HttpErrorResponse from the backend into a readable message. */
export function apiError(err: any, fallback: string): string {
  if (err?.status === 0) {
    return 'Cannot reach the server. Is the backend running (port 3000)?';
  }
  const body = err?.error;
  if (typeof body === 'string' && body) return body;
  return body?.message || body?.error || fallback;
}
