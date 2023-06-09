// TODO: 改写成类的形式
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
// TODO: 创建一个Elements对象
const initElements = (id: string) => {
    // info
    const audioCover = getElement(id + " .limplayer-info .cover img");
    const audioArtist = getElement(id + " .info .artist a");
    const audioName = getElement(id + " .info .name a");
    // like
    const likedSvg = getElement(id + " .like .liked");
    const likeButton = getElement(id + " .like button");
    const unlikeSvg = getElement(id + " .like .unliked");
    // shuffle
    const shuffleSvg = getElement(id + " .shuffle svg");
    const shuffleButton = getElement(id + " .shuffle");
    const shufflePointer = getElement(id + " .shuffle .pointer");
    // loop
    const listLoopSvg = getElement(id + " .loop .list");
    const singleLoopSvg = getElement(id + " .loop .single");
    const loopButtton = getElement(id + " .loop");
    const loopPointer = getElement(id + " .loop .pointer");
    // volume
    const muteSvg = getElement(id + " .volume .mute");
    const mediumVolumeSvg = getElement(id + " .volume .medium");
    const highVolumeSvg = getElement(id + " .volume .high");
    const volumeButton = getElement(id + " .volume button");
    const volumeProgressNow = getElement(id + " .volume .now");
    const volumeProgressBar = getElement(id + " .volume .progressbar");
    const volumePointer = getElement(id + " .volume .pointer");
    // progressbar
    const durationText = getElement(id + " .playback .duration span");
    const nowText = getElement(id + " .playback .now-position span");
    const playbackProgressBar = getElement(id + " .playback .progressbar");
    const playbackPointer = getElement(id + " .playback .pointer");
    const playbackProgressNow = getElement(id + " .playback .now");
    const playbackProgressBuffered = getElement(id + " .playback .buffered");
    // play control button
    const playSvg = getElement(id + " .controls-playpause .play");
    const pauseSvg = getElement(id + " .controls-playpause .pause");
    const loadingSvg = getElement(id + " .controls-playpause .player-loading");
    const playButton = getElement(id + " .controls-playpause button");
    const preButton = getElement(id + " .controls-left .pre");
    const nextButton = getElement(id + " .controls-right .next");

    return {
        audioCover, audioArtist, likedSvg, unlikeSvg, likeButton, audioName, shuffleSvg, shuffleButton, shufflePointer, listLoopSvg, singleLoopSvg, loopButtton, loopPointer, muteSvg, mediumVolumeSvg, highVolumeSvg, volumeButton, volumeProgressNow, volumeProgressBar, volumePointer, durationText, nowText, playbackProgressBar, playbackPointer, playbackProgressNow, playbackProgressBuffered, playSvg, pauseSvg, playButton, loadingSvg, preButton, nextButton
    };
};

const isMobile = () => {
    const mobileReg = /(mobile|phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
    return navigator.userAgent.match(mobileReg) !== null;
};

const generateRandomString = (size: number) => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    randomString += Math.floor(Math.random() * 10);
    for (let i = 1; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}

export { hide, show, addClass, removeClass, secondToTime, percentToSecond, getElement, initElements, isMobile, generateRandomString };