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

export { hide, show, addClass, removeClass };