export const getUserIdList = (text: string): string[] => {
  const users = text.match(/@[a-zA-Z0-9¥.]*/g);
  if (users) {
    return users.map((user) => user.substr(1));
  }
  return [];
};

export const getMessageFromText = (text: string): string => {
  return text.replace(/<@[a-zA-Z0-9¥.]*>/g, "").trim();
};
