export function formatDateShort(date: Date): string {
    const day = date.toLocaleDateString('default', { weekday: 'short' });
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month} ${date.getUTCDate()}`;
}

export function formatMMDDYYY(date: string): string {
    const dateObj = new Date(date);
    const yyyy = dateObj.getFullYear();
    let mm: string | number = dateObj.getMonth() + 1; // Months start at 0!
    let dd: string | number = dateObj.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedDate = mm + '/' + dd + '/' + yyyy;
    return formattedDate;
}

export function isFutureTime(now: Date, time: Date): boolean {
    return now < time;
}
