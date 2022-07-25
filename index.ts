/* eslint-disable @typescript-eslint/no-non-null-assertion */
import "./index.css";
import PlayerTemplete from "./html_template";

interface AudioConfig {
    name: string;
    artist: string;
    src: string;
    lrc?: string;
    lrcType?: "lrc" | "srt" | "string";
    cover?: string;
    theme?: "auto" | string;
    id?: string;
}

interface PlayerOptions {
    /**
    * @param {boolean} autoplay 是否自动播放
    * 
    * 
    * 
    * 
    */
    // 自动播放
    autoplay?: boolean;
    // 同一时间只允许一个播放器在播放
    mutex?: boolean;
    // 歌词格式
    lrcType?: "lrc" | "srt" | "string";
    // 循环模式
    loopType?: "list" | "single" | "none";
    // 是否启用随机播放
    shuffle?: boolean;
    // 播放器主题
    theme?: string;
    // 音量, 1-100的整数
    volume?: number;
    // 音频信息
    audio?: AudioConfig[];
    // 存储信息localstorage的字段名

}

class LimPlayer {
    private static playerCount = 0;
    container: HTMLElement;
    options: PlayerOptions;
    playing: AudioConfig | null;
    playerID: string;
    elements: { [key: string]: HTMLElement } | undefined;
    constructor(el: string, options?: PlayerOptions) {
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
        const templete = new PlayerTemplete();
        this.playerID = templete.id;
        element.classList.add("limplayer");
        element.setAttribute("id", this.playerID);
        element.innerHTML = templete.content;
        this.playing = null;
        this.initElements();
        this.initEvents();
    }

    private initOptions(options?: PlayerOptions) {
        const defaultOptions: PlayerOptions = {
            autoplay: true,
            mutex: false,
            lrcType: "lrc",
            loopType: "none",
            shuffle: false,
            theme: "default",
            volume: 50,
            audio: []
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
        this.elements = {
            likedSvg, unlikeSvg, likeButton,
            shuffleSvg, shuffleButton, shufflePointer,
            listLoopSvg, singleLoopSvg, loopButtton, loopPointer,
            muteSvg, mediumVolumeSvg, highVolumeSvg, volumeButton
        };
        console.log(this.elements);
    }

    private initEvents() {
        let oldSvg: HTMLElement;
        let newSvg: HTMLElement;
        let className: string[];
        if (!this.elements) throw new Error("Elements need to be initialized before initializing events");
        const shuffle = this.elements.shuffleSvg;
        const shufflePointer = this.elements.shufflePointer;
        const singleLoopSvg = this.elements.singleLoopSvg;
        const listLoopSvg = this.elements.listLoopSvg;
        const loopPointer = this.elements.loopPointer;
        // 喜欢按钮点击事件
        this.elements.likeButton.addEventListener("click", () => {
            if (this.elements!.likedSvg.classList.contains("animate_beat")) {
                oldSvg = this.elements!.likedSvg;
                newSvg = this.elements!.unlikeSvg;
                className = ["animate_beat", "animate_shake"];
                this.likeChanged("unlike", this.playing!);
            } else {
                oldSvg = this.elements!.unlikeSvg;
                newSvg = this.elements!.likedSvg;
                className = ["animate_shake", "animate_beat"];
                this.likeChanged("liked", this.playing!);
            }
            oldSvg.style.display = "none";
            oldSvg.classList.remove(className[0]);
            newSvg.style.display = "block";
            newSvg.classList.add(className[1]);
        });
        // 随机播放按钮点击事件
        this.elements.shuffleButton.addEventListener("click", () => {
            shuffle.classList.add("animate_beat");
            setTimeout(() => {
                shuffle.classList.remove("animate_beat");
            }, 300);
            if (shuffle.classList.contains("checked")) {
                shuffle.classList.remove("checked");
                shufflePointer.style.display = "none";
            } else {
                shuffle.classList.add("checked");
                shufflePointer.style.display = "block";
            }
        });
        // 循环按钮点击事件
        this.elements.loopButtton.addEventListener("click", () => {
            let noneFlag = false;
            if (singleLoopSvg.classList.contains("checked")) {
                noneFlag = true;
                oldSvg = singleLoopSvg;
                newSvg = listLoopSvg;
            } else if (listLoopSvg.classList.contains("checked")) {
                oldSvg = listLoopSvg;
                newSvg = singleLoopSvg;
            } else {
                listLoopSvg.classList.add("animate_beat", "checked");
                loopPointer.style.display = "block";
                return;
            }
            oldSvg.style.display = "none";
            oldSvg.classList.remove("animate_beat", "checked");
            newSvg.style.display = "block";
            if (noneFlag) {
                listLoopSvg.classList.add("animate_beat");
                setTimeout(() => {
                    listLoopSvg.classList.remove("animate_beat");
                }, 300);
                loopPointer.style.display = "none";
                return;
            }
            singleLoopSvg.classList.add("animate_beat", "checked");
        });
        // 音量按钮点击事件
        this.elements.volumeButton.addEventListener("click", () => {
           console.log(6);
           
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private likeChanged(value: "liked" | "unlike", audio: AudioConfig) { }

    onLikeChanged(callback: (value: "liked" | "unlike", audio: AudioConfig) => void) {
        this.likeChanged = callback;
    }

}



export default LimPlayer;