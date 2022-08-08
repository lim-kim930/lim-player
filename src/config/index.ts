import { AudioConfig, PlayerOptions } from "../types";

const defaultOptions: PlayerOptions = {
    autoplay: true,
    preload: "metadata",
    mutex: false,
    lrcType: "lrc",
    loopType: "none",
    shuffle: false,
    theme: "default",
    volume: 0.3
};

const defaultSongConfig: AudioConfig = {
    name: "ALIEN",
    artist: "LEE SUHYUN",
    src: "https://limkim.cn/limiii/singer/music/LEE%20SUHYUN%20-%20ALIEN.mp3",
    cover: "https://limkim.cn/limiii/singer/assets/albumimage/ALIEN.jpg",
    liked: true
};

export { defaultOptions, defaultSongConfig };