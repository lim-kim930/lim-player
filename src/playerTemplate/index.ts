/* eslint-disable @typescript-eslint/no-non-null-assertion */
// TODO: 优化模板,缩小打包体积
// TODO: title在切换歌曲时需要更改
import { defaultAudioConfig } from "../config";
import { PlayerOptions, AudioConfig } from "../typings/index.js";
import { downloadSvg, likeAndUnlikeSvg, listSvg, loadingSvg, loopSvg, nextSvg, playAndPauseSvg, preSvg, shuffleSvg, volumeSvg } from "./svgs";

export default class PlayerTemplete {
    id: string;
    content: string;
    constructor(options: PlayerOptions, audio: AudioConfig | null) {
        // if (options.device === "auto") {

        // }
        // 每个player有一个以时间戳为区分的id
        const date = new Date().getTime();
        this.id = "player-" + date.toString();

        // 通过options初始渲染的按钮
        if (audio === null) {
            audio = defaultAudioConfig;
        }
        this.content = `<div class="limplayer-info"><div class="container"><div class="cover"><img src="${audio.cover ? audio.cover : 'https://limkim.cn/pic/unknown.svg'}"></div><div class="flex-helper"><div class="info"><div class="name"><a href="" title="${audio.name}">${audio.name}</a></div><div class="artist"><a href="" title="${audio.artist}">${audio.artist}</a></div></div></div><div class="like"><button>${likeAndUnlikeSvg(audio.liked)}</button></div></div></div><div class="limplayer-main-controller"><div class="container"><div class="controls"><div class="controls-left"><button class="shuffle">${shuffleSvg(options.shuffle)}<span class="pointer" style="display: ${options.shuffle ? 'block' : 'none'};"></span></button><button class="pre">${preSvg}</button></div><div class="controls-playpause"><button>${playAndPauseSvg}${loadingSvg}</button></div><div class="controls-right"><button class="next">${nextSvg}</button><button class="loop">${loopSvg(options.loopType)}<span class="pointer" style="display: ${options.loopType === 'none' ? 'none' : 'block'};"></span></button></div></div><div class="playback"><div class="now-position"><span>0:00</span></div><div class="progressbar"><span class="total"><span class="now"><span class="pointer"></span></span><span class="buffered"></span></span></div><div class="duration"><span>0:00</span></div></div></div></div><div class="limplayer-side-controller"><div class="container"><div class="other"><button>${listSvg}</button><button>${downloadSvg}</button></div><div class="volume"><button>${volumeSvg(options.volume, options.mute)}</button><div class="progressbar"><span class="total"><span class="now" style="width: ${options.mute ? 0 : options.volume * 100}%;"><span class="pointer"></span></span></span></div></div></div></div>`;

    }
}
// <button>
//     <svg viewBox="0 0 1024 1024"width="22" height="22"><path d="M256 128h640a96 96 0 0 1 96 96v448a96 96 0 0 1-96 96h-288v-64h288a32 32 0 0 0 32-32V224a32 32 0 0 0-32-32H256a32 32 0 0 0-32 32v224H160V224a96 96 0 0 1 96-96zM128 512h320a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96H128a96 96 0 0 1-96-96v-192a96 96 0 0 1 96-96z m0 64h320a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H128a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32z"></path></svg>
// </button>
