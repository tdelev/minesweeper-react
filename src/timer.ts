function leadZero(num: number) {
    return num < 10 ? `0${num}` : `${num}`;
}

export const time = {
    secondsToString: function (seconds: number) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${leadZero(min)}:${leadZero(sec)}`;
    }
};