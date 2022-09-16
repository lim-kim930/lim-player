/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "./assets/index.less";
import PlayerTemplete from "./playerTemplate";
import { hide, show, addClass, removeClass, secondToTime, percentToSecond, initElements } from "./utils";
import { PlayerOptions, AudioConfig, PlayerEvents } from "./types";
import PlayerStorage from "./storage";
import { defaultOptions } from "./config";

class LimPlayer {
    private static playerCount = 0;
    container: HTMLElement;
    playerID: string;
    options: PlayerOptions;
    playList: AudioConfig[];
    playing: AudioConfig | null;
    private isLoaing = false;
    private bufferd = 0;
    private playbackTimer: number | undefined;
    private controlTimer: number | undefined;
    private loadingCheckTimer: number | undefined;
    private progressMoveLock: boolean | undefined;
    private elements: { [key: string]: HTMLElement };

    private liked: ((audio: AudioConfig) => void) | undefined;
    private unliked: ((audio: AudioConfig) => void) | undefined;
    private ended: (() => void) | undefined;
    audio: HTMLAudioElement | undefined;
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
        // 使用initialTime配合storage可以从上次播放位置继续播放
        PlayerStorage.setOptions(this.options);
        // localStorage.setItem("lim_player_volume", this.options.volume!.toString());
        // TODO: 检查用户输入的播放列表; 解析音乐文件，提取出相关信息
        this.playList = this.initPlayList(lists);
        this.playing = this.playList[0] || null;
        // TODO: 根据专辑颜色或options里的主题，更改.playback .progressbar .now的背景色
        const templete = new PlayerTemplete(this.options, this.playing);
        this.playerID = templete.id;
        addClass(element, "limplayer");
        element.setAttribute("id", this.playerID);
        element.innerHTML = templete.content;
        this.elements = initElements(this.playerID);
        this.initAudioElement();
        this.initEvents();
    }

    private initAudioElement() {
        this.audio = document.createElement("audio");
        this.audio.preload = this.options.preload!;
        this.audio.autoplay = this.options.autoplay!;
        this.audio.loop = this.options.loopType === "single";
        this.audio.volume = this.options.volume!;
        if (this.playing) {
            this.audio.src = this.playing.src;
        }
        // TODO: 加载动画应该出现在播放被影响的时候，而不是正常缓冲的时候
        this.loadingCheckTimer = window.setInterval(() => {
            // console.log(this.audio!.networkState);
            const len = this.audio!.buffered.length;
            // TODO: 通过buffered.length展示分段加载进度
            if (len !== 0) {
                // console.log(len);
                // let i = 0;
                // while (i < len) {
                //     console.log(this.audio!.buffered.end(i));
                //     i++;
                // }

                const bufferd = this.audio!.buffered.end(len - 1);
                if (this.bufferd !== this.audio!.buffered.end(len - 1)) {
                    this.bufferd = bufferd;
                    // console.log(this.audio!.buffered.end(len - 1));
                    this.elements.playbackProgressBuffered.style.width = Math.trunc(this.bufferd * 100 / this.audio!.duration).toString() + "%";
                }

            }
            if (this.audio!.networkState === 2 && !this.isLoaing) {
                this.elements.loadingSvg.style.display = "inline-block";
                this.isLoaing = true;
            } else if (this.audio!.networkState !== 2 && this.isLoaing) {
                this.elements.loadingSvg.style.display = "none";
                this.isLoaing = false;
            }
        }, 100);
        this.audio.addEventListener("canplay", () => {
            // this.audio!.play().catch((err)=>{
            //     throw err;
            // });
            if (this.audio!.duration) {
                this.elements.durationText.innerText = secondToTime(this.audio!.duration);
            }
        });
        if (this.audio.autoplay) {
            // const handler = () => {
            //     this.playHandler();
            //     this.audio!.removeEventListener("play", handler);
            // };
            // this.audio.addEventListener("play", handler);
            this.audio.addEventListener("play", () => {
                this.playHandler();
            });
        }

        // this.initAudio();
    }

    private initAudio(audio?: AudioConfig | null) {
        if (!audio)
            audio = this.playing;
        if (this.audio && audio) {
            this.audio.src = audio.src;
            this.elements.audioName.innerText = audio.name || "unkown";
            this.elements.audioArtist.innerText = audio.artist || "unkown";
            this.elements.audioCover.setAttribute("src", audio.cover || "");
            this.setLikedUI();
            // TODO: 加载动画 加载的时候进度条跳动问题
        }
        this.elements.nowText.innerText = "0:00";
        this.elements.durationText.innerText = "loading...";
        this.elements.playbackProgressNow.style.width = "0";
        this.elements.playbackProgressBuffered.style.width = "0";
        this.autoplayHelper();
    }

    private checkOptionsValid(options: PlayerOptions) {
        const keys = Object.keys(options);
        keys.forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(defaultOptions, key)) {
                throw new ReferenceError("An unknown field was passed in: " + key);
            }
        });
    }

    private initOptions(options?: PlayerOptions) {
        const storageOptions = PlayerStorage.getOptions();
        let _options: PlayerOptions | null;
        if (options) {
            if (storageOptions) {
                _options = options.lotp === false ? { ...defaultOptions, ...storageOptions, ...options } : { ...defaultOptions, ...options, ...storageOptions };
            }
            else {
                _options = { ...defaultOptions, ...options };
            }
        } else {
            if (!storageOptions) {
                return defaultOptions;
            }
            _options = storageOptions;
        }
        this.checkOptionsValid(_options);
        return _options;
    }

    private initPlayList(list: AudioConfig[] | undefined) {
        if (list && list.length !== 0) {
            list.forEach((audio, index) => {
                if (!audio.name || !audio.src || !audio.artist) {
                    throw new ReferenceError("Missing required fields in an audio config");
                }
                audio.index = index;
            });
        } else {
            list = [];
        }
        return list;
    }

    private setLikedUI() {
        const likedSvg = this.elements.likedSvg;
        const unlikeSvg = this.elements.unlikeSvg;
        if (this.playing!.liked) {
            hide(unlikeSvg);
            show(likedSvg);
        } else {
            hide(likedSvg);
            show(unlikeSvg);
        }
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
                if (this.unliked) {
                    this.unliked(this.playing);
                }
            } else {
                oldSvg = unlikeSvg;
                newSvg = likedSvg;
                className = ["animate_shake", "animate_beat"];
                if (this.liked) {
                    this.liked(this.playing);
                }
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
            PlayerStorage.setOptions(this.options);
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
                case "none":
                    addClass(listLoopSvg, "animate_beat", "checked");
                    show(loopPointer);
                    this.options.loopType = "list";
            }
            PlayerStorage.setOptions(this.options);
            if (this.audio) {
                this.audio.loop = this.options.loopType === "single";
            }
            if (this.options.loopType === "list") {
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
            const volume = this.options.volume!;
            // 取消静音以后要恢复到的值
            const _volume = volume !== 0 ? volume : 0.5;
            let volumeToSet: number;
            if (this.options.mute) {
                hide(muteSvg);
                if (_volume > 0.5) {
                    show(highVolumeSvg);
                } else {
                    show(mediumVolumeSvg);
                }
                volumeToSet = _volume;
                this.options.mute = false;
            } else {
                hide(mediumVolumeSvg);
                hide(highVolumeSvg);
                show(muteSvg);
                volumeToSet = 0;
                this.options.mute = true;
            }
            PlayerStorage.setOptions(this.options);
            volumeProgressNow.style.width = String(volumeToSet * 100) + "%";
            if (this.audio) {
                this.audio.volume = volumeToSet;
            }
        });
        // 音量条事件
        volumeProgressBar.addEventListener("mousedown", (e) => {
            const moveHandler = (e: MouseEvent) => {
                const width = e.clientX - volumeProgressBar.offsetLeft - 15;
                if (width > 50) {
                    this.options.volume = width > 100 ? 1 : width / 100;
                    this.options.mute = false;
                    hide(mediumVolumeSvg);
                    hide(muteSvg);
                    show(highVolumeSvg);
                } else if (width <= 0) {
                    this.options.volume = 0;
                    this.options.mute = true;
                    hide(highVolumeSvg);
                    hide(mediumVolumeSvg);
                    show(muteSvg);
                } else {
                    this.options.volume = width / 100;
                    this.options.mute = false;
                    hide(muteSvg);
                    hide(highVolumeSvg);
                    show(mediumVolumeSvg);
                }
                PlayerStorage.setOptions(this.options);
                volumeProgressNow.style.width = String(width) + "px";
                if (this.audio) {
                    this.audio.volume = this.options.volume;
                }
            };
            const upHandler = () => {
                // localStorage.setItem("lim_player_volume", String(this.options.volume!));
                document.removeEventListener("mousemove", moveHandler);
                document.removeEventListener("mouseup", upHandler);
                removeClass(volumePointer, "pointer-active");
                removeClass(volumeProgressNow, "now-active");
            };
            // console.log(volumeProgressBar.offsetLeft);
            moveHandler(e);
            addClass(volumePointer, "pointer-active");
            addClass(volumeProgressNow, "now-active");
            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", upHandler);
        });
        // 播放/暂停按钮
        this.elements.playButton.addEventListener("click", () => {
            this.playOrPause();
        });
        // TODO: 方向键快进和后退,音量增减
        // 空格播放和暂停
        document.addEventListener("keypress", (e) => {
            const element = e.target! as HTMLElement;
            if (element.nodeName == 'TEXTAREA' || element.nodeName == 'INPUT' || element.nodeName == 'BUTTON') {
                return;
            } else {
                e.preventDefault();
                this.playOrPause();
            }
        });
        // 播放进度条事件
        playbackProgressBar.addEventListener("mousedown", (e) => {
            if (!this.audio) return;
            this.progressMoveLock = true;
            let second: number;
            const moveHandler = (e: MouseEvent) => {
                const widthDifference = e.clientX - playbackProgressBar.offsetLeft - 15;
                const precent = widthDifference / playbackProgressBar.offsetWidth;
                if (precent > 1 || precent < 0) { return; }
                if (isNaN(this.audio!.duration)) { return; }
                const current = percentToSecond(precent, this.audio!.duration);
                second = current.second;
                this.elements.nowText.innerText = current.time;
                playbackProgressNow.style.width = (precent * 100).toString() + "%";
            };
            const upHandler = () => {
                this.progressMoveLock = false;
                document.removeEventListener("mousemove", moveHandler);
                document.removeEventListener("mouseup", upHandler);
                if (!second) { return; }
                removeClass(playbackPointer, "pointer-active");
                removeClass(playbackProgressNow, "now-active");
                if (this.audio) {
                    this.audio.currentTime = second;
                }
            };
            moveHandler(e);
            addClass(playbackPointer, "pointer-active");
            addClass(playbackProgressNow, "now-active");
            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", upHandler);
        });
        // 上一曲
        this.elements.preButton.addEventListener("click", () => {
            this.preAndNextHandler();
        });
        // 下一曲
        this.elements.nextButton.addEventListener("click", () => {
            this.preAndNextHandler(true);
        });
    }

    private autoplayHelper() {
        if (!this.audio!.autoplay) {
            if (this.controlTimer) {
                clearTimeout(this.controlTimer);
            }
            this.controlTimer = window.setTimeout(() => {
                this.play();
            }, 500);
        }
    }

    private preAndNextHandler(nextFlag = false) {
        if (!this.playing) return;
        this.pause();
        if (!this.audio!.loop && this.playList.length > 1) {
            const index = this.playing.index as number;
            const length = this.playList.length;
            if (this.options.shuffle) {
                let random = index;
                while (random === index) {
                    random = Math.floor(Math.random() * length);
                }
                this.playing = this.playList[random];
            } else {
                if (nextFlag) {
                    if (index === length - 1) {
                        this.playing = this.playList[0];
                    } else {
                        this.playing = this.playList[index + 1];
                    }
                } else {
                    if (index === 0) {
                        this.playing = this.playList[length - 1];
                    } else {
                        this.playing = this.playList[index - 1];
                    }
                }
            }
        }

        this.initAudio();
    }

    private nextHandlerWithoutLoop() {
        if (!this.playing) return;
        const index = this.playing.index as number;
        const length = this.playList.length;

        this.elements.nowText.innerText = "0:00";
        this.elements.playbackProgressNow.style.width = "0";
        // 没有循环，所以到了最后一首，停止播放
        if (index === length - 1 || length === 1) {
            return;
        } else {
            if (this.options.shuffle) {
                let random = index;
                while (random === index) {
                    random = Math.floor(Math.random() * length);
                }
                this.playing = this.playList[random];
            } else {
                this.playing = this.playList[index + 1];
            }
        }
        this.initAudio();
    }

    // TODO: 连续暂停/播放，时间精度问题
    private playOrPause() {
        if (!this.audio || !this.playing || isNaN(this.audio.duration)) return;
        // TODO: 使用worker
        if (this.audio.paused) {
            addClass(this.elements.pauseSvg, "animate_small_beat");
            this.play();
        } else {
            addClass(this.elements.playSvg, "animate_small_beat");
            this.pause();
        }
    }

    play() {
        if (!this.audio) return;
        this.audio.play().then(() => {
            if (this.audio!.autoplay) return;
            this.playHandler();
        }).catch((err) => {
            throw err;
        });
    }

    pause() {
        if (!this.audio) return;
        this.audio.pause();
        hide(this.elements.pauseSvg);
        show(this.elements.playSvg);
    }

    next() {
        if (!this.audio) return;
        this.preAndNextHandler(true);
    }

    pre() {
        if (!this.audio) return;
        this.preAndNextHandler();
    }

    // setOptions()

    private playHandler() {
        hide(this.elements.playSvg);
        show(this.elements.pauseSvg);
        if (this.playbackTimer) return;

        const endHnadler = () => {
            if (this.ended) {
                this.ended();
            }
            hide(this.elements.pauseSvg);
            show(this.elements.playSvg);
            if (this.playbackTimer) {

                clearInterval(this.playbackTimer);
                this.playbackTimer = undefined;

                this.elements.nowText.innerText = secondToTime(this.audio!.duration);
                this.elements.playbackProgressNow.style.width = "100%";
            }

            switch (this.options.loopType) {
                case "list":
                case "single":
                    this.preAndNextHandler(true);
                    break;
                case "none":
                    this.nextHandlerWithoutLoop();
                    break;
                default:
                    break;
            }
            this.audio!.removeEventListener("ended", endHnadler);
        };

        // It seems like you are using node typings which override setInterval() as something that returns NodeJS.Timer.
        // If you're running in the browser, it doesn't make a whole lot of sense to use these
        this.playbackTimer = window.setInterval(() => {
            if (this.audio!.paused) return;
            const currentTime = this.audio!.currentTime;

            if (!this.progressMoveLock) {
                this.elements.nowText.innerText = secondToTime(currentTime);
                this.elements.playbackProgressNow.style.width = (currentTime / this.audio!.duration * 100).toString() + "%";
            }

            if (currentTime === this.audio!.duration) {
                clearInterval(this.playbackTimer);
                this.playbackTimer = undefined;
            }
        }, 1000);

        this.audio!.addEventListener("ended", endHnadler);
    }

    // eslint-disable-next-line no-unused-vars
    // onLikeChanged(callback: (value: "liked" | "unlike", audio: AudioConfig) => void) {
    //     this.likeChanged = callback;
    // }
    on(event: 'liked', handler: (audio: AudioConfig) => void): void
    on(event: 'unliked', handler: (audio: AudioConfig) => void): void
    on(event: 'ended', handler: () => void): void
    on(event: PlayerEvents, handler: (...args: AudioConfig[]) => void) {
        switch (event) {
            case "liked":
                this.liked = handler;
                break;
            case "unliked":
                this.unliked = handler;
                break;
            case "ended":
                this.ended = handler;
                break;
            default:
                break;
        }
    }

    // onEnded(callback: () => void) {
    //     this.ended = callback;
    // }

    // onDownload(callback: (audio: AudioConfig) => void) {
    //     this.likeChanged = callback;
    // }

    // onOptionsChanged()
}

export { PlayerOptions, AudioConfig };
export default LimPlayer;