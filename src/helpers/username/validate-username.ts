export const validateUsername = (username: string): boolean =>
  username.trim().split("_")[username.trim().split("_").length - 1] !== "gal" &&
  username.trim().split(" ").length < 2;
