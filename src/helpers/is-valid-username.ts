
export const isValidUsername = (username: string): boolean => {
    if(username.length < 3) return false;

    if(username.split("_")[username.split("_").length - 1] !== "gal") return false;

    return true;
}