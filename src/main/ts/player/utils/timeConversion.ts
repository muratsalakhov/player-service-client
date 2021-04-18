export default (ms:number):string => {
    const seconds = Math.floor((ms / 1000) % 60),
        minutes = Math.floor((ms / (1000 * 60)) % 60),
        hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    return ((hours < 10) ? "0" + hours : hours) + ":" +
        ((minutes < 10) ? "0" + minutes : minutes) + ":" +
        ((seconds < 10) ? "0" + seconds : seconds);
};