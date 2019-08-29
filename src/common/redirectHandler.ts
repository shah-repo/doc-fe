export const redirectTo = (url: string): () => any => {
  return () => {
    window.location.href = url;
    return null;
  }
}