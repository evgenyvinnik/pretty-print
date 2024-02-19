export const isStringNullOrWhitespaceOnly = (text: string | null): boolean => {
  return text == null || text.trim() === "";
};
