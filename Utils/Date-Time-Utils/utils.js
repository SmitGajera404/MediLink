export const convertToIST = (date) => {
    const istOffset = 330; // IST is UTC+5:30
    const utcTime = date.getTime();
    return new Date(utcTime + istOffset * 60 * 1000);
}