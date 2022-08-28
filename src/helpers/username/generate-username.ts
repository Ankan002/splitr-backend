export const generateUsername = (email: string) => {
    return email.split("@")[0] + "_gal";
}