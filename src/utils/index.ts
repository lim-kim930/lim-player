const hide = (element: HTMLElement) => {
    element.style.display = "none";
};

const show = (element: HTMLElement) => {
    element.style.display = "block";
};

const addClass = (element: HTMLElement, ...name: string[]) => {
    element.classList.add(...name);
};

const removeClass = (element: HTMLElement, ...name: string[]) => {
    element.classList.remove(...name);
};

const secondToTime = (duration: number) => {
    let minute = Math.floor(duration / 60);
    let second = Math.round((duration % 60));
    if (second === 60) {
        second = 0;
        minute++;
    }
    const _second = second < 10 ? ("0" + second.toString()) : second.toString();
    return minute.toString() + ":" + _second;
};

const percentToSecond = (precent: number, duration: number) => {
    const second = duration * precent;
    const time = secondToTime(second);
    return { second, time };
};

const getElement = (id: string) => {
    return document.querySelector("#" + id) as HTMLElement;
};

export { hide, show, addClass, removeClass, secondToTime, percentToSecond, getElement };