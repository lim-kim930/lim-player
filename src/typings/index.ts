export type CustomRequired<T, K extends keyof T> = {
    [P in K]-?: T[P];
} & Omit<T, K>

export interface AudioConfig {
    id?: string;
    name: string;
    artist: string;
    src: string;
    lrc?: string;
    lrcType?: "lrc" | "srt" | "string";
    cover?: string;
    theme?: "auto" | string;
    // id?: string;
    index?: number;
    liked?: boolean;
}

export interface PlayerOptions {
    /**
    * @param {boolean} autoplay 是否自动播放
    * 
    * 
    * 
    * 
    */
    // 自动播放
    autoplay: boolean;
    // 预加载
    preload: "none" | "metadata" | "auto";
    // 同一时间只允许一个播放器在播放
    mutex: boolean;
    // 歌词格式
    lrcType: "lrc" | "srt" | "string";
    // 循环模式
    loopType: "list" | "single" | "none";
    // 是否启用随机播放
    shuffle: boolean;
    // 播放器主题
    theme: string;
    // 音量, 1-100的整数
    volume: number;
    // 存储信息localstorage的字段名
    // 静音
    mute: boolean;
    // Local configuration takes precedence
    lotp: boolean;
    // 设备类型
    device: "auto" | "mobile" | "desktop";
}

export type PlayerEvents = "likeChanged" | "ended" | "error"