import { AudioConfig, PlayerOptions } from "../typings/index.js";

const defaultPlayerOptions: PlayerOptions = {
    autoplay: true,
    preload: "metadata",
    mutex: false,
    lrcType: "lrc",
    loopType: "none",
    shuffle: false,
    theme: "default",
    volume: 0.3,
    mute: false,
    lotp: true,
    device: "auto",
    hls: false
};
const defaultAudioConfig: Required<AudioConfig> = {
    // TODO: 考虑是否可以不传name,artist字段
    id: '',
    name: 'unknown',
    artist: 'unknown',
    src: '',
    lrc: '',
    lrcType: "lrc",
    cover: '',
    theme: "auto",
    index: 0,
    liked: false
};

// const defaultSongConfig: AudioConfig = {
//     name: "ALIEN",
//     artist: "LEE SUHYUN",
//     src: "https://limkim.cn/limiii/singer/music/LEE%20SUHYUN%20-%20ALIEN.mp3",
//     cover: "https://limkim.cn/limiii/singer/assets/albumimage/ALIEN.jpg",
//     liked: true
// };

export { defaultPlayerOptions, defaultAudioConfig };