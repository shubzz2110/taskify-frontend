export const getInitials = (name: string) => {
  if (!name) return "";

  const words = name.trim().split(/\s+/); // removes extra spaces

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words[0].length >= 2) {
    return (words[0][0] + words[0][1]).toUpperCase();
  } else {
    return words[0][0].toUpperCase();
  }
};