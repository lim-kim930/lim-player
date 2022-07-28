/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "./index.css";
import PlayerTemplete from "./playerTemplate";
import { hide, show, addClass, removeClass, secondToTime, percentToSecond } from "./utils";
import { PlayerOptions, AudioConfig } from "./types";

class LimPlayer {
    private static playerCount = 0;
    container: HTMLElement;
    playerID: string;
    options: PlayerOptions;
    playLists: AudioConfig[];
    playing: AudioConfig | null;
    elements: { [key: string]: HTMLElement } | undefined;
    private audio: HTMLAudioElement | undefined;
    constructor(el: string, options?: PlayerOptions, lists?: AudioConfig[]) {
        // 播放器数量
        LimPlayer.playerCount++;
        // if(options?.mutex && LimPlayer.playerCount > 1) {
        //     throw new Error("When using the option 'mutex' is true, only one instance of the player can be spawned");
        // } 
        if (!el) throw new Error("Missing required parameter: el");
        const element = document.getElementById(el);
        if (!element) throw new Error("No element found with id: " + el);
        this.container = element;
        this.options = this.initOptions(options);
        this.saveOptionsStorage(true);
        localStorage.setItem("lim_player_volume", String(this.options.volume!));
        this.playLists = lists || [];
        this.playing = this.playLists[0] || null;
        const templete = new PlayerTemplete(this.options, this.playing);
        this.playerID = templete.id;
        addClass(element, "limplayer");
        element.setAttribute("id", this.playerID);
        element.innerHTML = templete.content;
        this.initElements();
        this.initAudio(this.playing);
        this.initEvents();
    }

    private initAudio(audio: AudioConfig) {
        this.audio = document.createElement("audio");
        this.audio.volume = this.options.volume! / 100;
        if (audio) {
            this.audio.src = audio.src;
        }
        this.audio.addEventListener("canplay", () => {
            // this.audio!.play().catch((err)=>{
            //     throw err;
            // });
            // console.log(this.audio!.currentTime);
            // console.log(this.audio!.duration);
            if (this.audio!.duration) {
                this.elements!.durationText.innerText = secondToTime(this.audio!.duration);
            }
        });
    }

    private initOptions(options?: PlayerOptions) {
        const defaultOptions: PlayerOptions = {
            autoplay: true,
            preload: "metadata",
            mutex: false,
            lrcType: "lrc",
            loopType: "none",
            shuffle: false,
            theme: "default",
            volume: 50
        };
        return options ? { ...defaultOptions, ...options } : defaultOptions;
    }

    private initElements() {
        // like
        const likedSvg = document.querySelector("#" + this.playerID + " .like .liked") as HTMLElement;
        const likeButton = document.querySelector("#" + this.playerID + " .like button") as HTMLElement;
        const unlikeSvg = document.querySelector("#" + this.playerID + " .like .unliked") as HTMLElement;
        // shuffle
        const shuffleSvg = document.querySelector("#" + this.playerID + " .shuffle svg") as HTMLElement;
        const shuffleButton = document.querySelector("#" + this.playerID + " .shuffle") as HTMLElement;
        const shufflePointer = document.querySelector("#" + this.playerID + " .shuffle .pointer") as HTMLElement;
        // loop
        const listLoopSvg = document.querySelector("#" + this.playerID + " .loop .list") as HTMLElement;
        const singleLoopSvg = document.querySelector("#" + this.playerID + " .loop .single") as HTMLElement;
        const loopButtton = document.querySelector("#" + this.playerID + " .loop") as HTMLElement;
        const loopPointer = document.querySelector("#" + this.playerID + " .loop .pointer") as HTMLElement;
        // volume
        const muteSvg = document.querySelector("#" + this.playerID + " .volume .mute") as HTMLElement;
        const mediumVolumeSvg = document.querySelector("#" + this.playerID + " .volume .medium") as HTMLElement;
        const highVolumeSvg = document.querySelector("#" + this.playerID + " .volume .high") as HTMLElement;
        const volumeButton = document.querySelector("#" + this.playerID + " .volume button") as HTMLElement;
        const volumeProgressNow = document.querySelector("#" + this.playerID + " .volume .now") as HTMLElement;
        const volumeProgressBar = document.querySelector("#" + this.playerID + " .volume .progressbar") as HTMLElement;
        const volumePointer = document.querySelector("#" + this.playerID + " .volume .pointer") as HTMLElement;
        // progressbar
        const durationText = document.querySelector("#" + this.playerID + " .playback .duration span") as HTMLElement;
        const nowText = document.querySelector("#" + this.playerID + " .playback .now-position span") as HTMLElement;
        const playbackProgressBar = document.querySelector("#" + this.playerID + " .playback .progressbar") as HTMLElement;
        const playbackPointer = document.querySelector("#" + this.playerID + " .playback .pointer") as HTMLElement;
        const playbackProgressNow = document.querySelector("#" + this.playerID + " .playback .now") as HTMLElement;

        this.elements = {
            likedSvg, unlikeSvg, likeButton,
            shuffleSvg, shuffleButton, shufflePointer,
            listLoopSvg, singleLoopSvg, loopButtton, loopPointer,
            muteSvg, mediumVolumeSvg, highVolumeSvg, volumeButton, volumeProgressNow, volumeProgressBar, volumePointer,
            durationText, nowText, playbackProgressBar, playbackPointer, playbackProgressNow
        };
        console.log(this.elements);
    }

    private saveOptionsStorage(firstFlag = false) {
        if (!firstFlag) return localStorage.setItem("lim_player_options", JSON.stringify(this.options));
        const options = localStorage.getItem("lim_player_options");
        let _options: PlayerOptions;
        if (options) {
            _options = { ...JSON.parse(options), ...this.options } as PlayerOptions;
        } else {
            _options = this.initOptions(this.options);
        }
        localStorage.setItem("lim_player_options", JSON.stringify(_options));
    }

    private getOptionsStorage() {
        const options = localStorage.getItem("lim_player_options");
        return options ? JSON.parse(options) as PlayerOptions : this.options;
    }

    private initEvents() {
        let oldSvg: HTMLElement;
        let newSvg: HTMLElement;
        let className: string[];
        if (!this.elements) throw new Error("Elements need to be initialized before initializing events");
        const likedSvg = this.elements.likedSvg;
        const unlikeSvg = this.elements.unlikeSvg;

        const shuffle = this.elements.shuffleSvg;
        const shufflePointer = this.elements.shufflePointer;

        const singleLoopSvg = this.elements.singleLoopSvg;
        const listLoopSvg = this.elements.listLoopSvg;
        const loopPointer = this.elements.loopPointer;

        const highVolumeSvg = this.elements.highVolumeSvg;
        const muteSvg = this.elements.muteSvg;
        const mediumVolumeSvg = this.elements.mediumVolumeSvg;
        const volumeProgressBar = this.elements.volumeProgressBar;
        const volumePointer = this.elements.volumePointer;
        const volumeProgressNow = this.elements.volumeProgressNow;

        const playbackProgressBar = this.elements.playbackProgressBar;
        const playbackPointer = this.elements.playbackPointer;
        const playbackProgressNow = this.elements.playbackProgressNow;
        // 喜欢按钮点击事件
        this.elements.likeButton.addEventListener("click", () => {
            if (!this.playing) return;
            if (this.playing.liked) {
                oldSvg = likedSvg;
                newSvg = unlikeSvg;
                className = ["animate_beat", "animate_shake"];
                this.likeChanged("unlike", this.playing);
            } else {
                oldSvg = unlikeSvg;
                newSvg = likedSvg;
                className = ["animate_shake", "animate_beat"];
                this.likeChanged("liked", this.playing);
            }
            this.playing.liked = !this.playing.liked;
            // TODO: 需要在回调里更改总数据的like
            hide(oldSvg);
            removeClass(oldSvg, className[0]);
            show(newSvg);
            addClass(newSvg, className[1]);
        });
        // 随机播放按钮点击事件
        this.elements.shuffleButton.addEventListener("click", () => {
            addClass(shuffle, "animate_beat");
            setTimeout(() => {
                removeClass(shuffle, "animate_beat");
            }, 300);
            if (this.options.shuffle) {
                removeClass(shuffle, "checked");
                hide(shufflePointer);
            } else {
                addClass(shuffle, "checked");
                show(shufflePointer);
            }
            this.options.shuffle = !this.options.shuffle;
        });
        // 循环按钮点击事件
        this.elements.loopButtton.addEventListener("click", () => {
            let noneFlag = false;
            switch (this.options.loopType) {
                case "single":
                    noneFlag = true;
                    oldSvg = singleLoopSvg;
                    newSvg = listLoopSvg;
                    this.options.loopType = "none";
                    break;
                case "list":
                    oldSvg = listLoopSvg;
                    newSvg = singleLoopSvg;
                    this.options.loopType = "single";
                    break;
                default:
                    addClass(listLoopSvg, "animate_beat", "checked");
                    show(loopPointer);
                    this.options.loopType = "list";
                    return;
            }
            hide(oldSvg);
            removeClass(oldSvg, "animate_beat", "checked");
            show(newSvg);
            if (noneFlag) {
                addClass(listLoopSvg, "animate_beat");
                setTimeout(() => {
                    removeClass(listLoopSvg, "animate_beat");
                }, 300);
                hide(loopPointer);
                return;
            }
            addClass(singleLoopSvg, "animate_beat", "checked");
        });
        // 音量按钮点击事件
        this.elements.volumeButton.addEventListener("click", () => {
            const volume = localStorage.getItem("lim_player_volume");
            const _volume = (volume && volume !== "0") ? Number(volume) : 50;

            if (this.options.volume === 0) {
                hide(muteSvg);
                if (_volume > 50) {
                    show(highVolumeSvg);
                } else {
                    show(mediumVolumeSvg);
                }
                this.options.volume = _volume;
            } else {
                hide(mediumVolumeSvg);
                hide(highVolumeSvg);
                show(muteSvg);
                this.options.volume = 0;
            }
            this.saveOptionsStorage();
            volumeProgressNow.style.width = String(this.options.volume) + "%";
            if (this.audio) {
                this.audio.volume = this.options.volume / 100;
            }
        });
        // 音量条事件
        volumeProgressBar.addEventListener("mousedown", (e) => {
            const moveHandler = (e: MouseEvent) => {
                const width = e.clientX - volumeProgressBar.offsetLeft - 15;
                if (width < 0 || width > 100) return;
                this.options.volume = width;
                if (width > 50) {
                    hide(mediumVolumeSvg);
                    hide(muteSvg);
                    show(highVolumeSvg);
                } else if (width === 0) {
                    hide(highVolumeSvg);
                    hide(mediumVolumeSvg);
                    show(muteSvg);
                } else {
                    hide(muteSvg);
                    hide(highVolumeSvg);
                    show(mediumVolumeSvg);
                }
                volumeProgressNow.style.width = String(width) + "px";
                if (this.audio) {
                    this.audio.volume = width / 100;
                }
            };
            const upHandler = () => {
                localStorage.setItem("lim_player_volume", String(this.options.volume!));
                document.removeEventListener("mousemove", moveHandler);
                document.removeEventListener("mouseup", upHandler);
                removeClass(volumePointer, "pointer-active");
                removeClass(volumeProgressNow, "now-active");
            };
            // console.log(e);
            // console.log(volumeProgressBar.offsetLeft);
            moveHandler(e);
            addClass(volumePointer, "pointer-active");
            addClass(volumeProgressNow, "now-active");
            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", upHandler);
        });
        // 空格播放和暂停
        document.addEventListener("keypress", (e) => {
            const element = e.target! as HTMLElement;
            if (element.nodeName == 'TEXTAREA' || element.nodeName == 'INPUT') {
                return;
            } else {
                e.preventDefault();
                // TODO:
                if (this.audio) {
                    // TODO: 使用worker
                    this.audio.play().then(() => {
                        setInterval(() => {
                            const currentTime = this.audio!.currentTime;
                            this.elements!.nowText.innerText = secondToTime(currentTime);
                        }, 1000);
                    }).catch((err) => {
                        throw err;
                    });
                }
            }

        });
        // 播放进度条事件
        playbackProgressBar.addEventListener("mousedown", (e) => {
            if (!this.audio) return;
            let second: number;
            const moveHandler = (e: MouseEvent) => {
                const widthDifference = e.clientX - playbackProgressBar.offsetLeft - 15;
                // console.log(playbackProgressBar.offsetWidth);

                // console.log(widthDifference);
                // console.log(widthDifference / playbackProgressBar.offsetWidth);
                const precent = widthDifference / playbackProgressBar.offsetWidth;
                const current = percentToSecond(precent, this.audio!.duration);
                second = current.second;
                this.elements!.nowText.innerText = current.time;
                playbackProgressNow.style.width = (precent * 100).toString() + "%";
            };
            const upHandler = () => {
                // localStorage.setItem("lim_player_volume", String(this.options.volume!));
                document.removeEventListener("mousemove", moveHandler);
                document.removeEventListener("mouseup", upHandler);
                removeClass(playbackPointer, "pointer-active");
                removeClass(playbackProgressNow, "now-active");
                if(this.audio) {
                    this.audio.currentTime = second;
                }
            };
            moveHandler(e);
            addClass(playbackPointer, "pointer-active");
            addClass(playbackProgressNow, "now-active");
            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", upHandler);
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private likeChanged(value: "liked" | "unlike", audio: AudioConfig) { }

    onLikeChanged(callback: (value: "liked" | "unlike", audio: AudioConfig) => void) {
        this.likeChanged = callback;
    }

}



export default LimPlayer;