import { PlayerOptions, AudioConfig } from "../types";

export default class PlayerTemplete {
    id: string;
    content: string;
    constructor(options: PlayerOptions, audio: AudioConfig | null) {
        // 每个player有一个以时间戳为区分的id
        const date = new Date().getTime();
        this.id = "player-" + date.toString();

        // 通过options初始渲染的按钮
        if (audio === null) {
            audio = {
                name: "暂无",
                artist: "",
                src: "",
                cover: "",
                liked: false
            };
        }

        this.content = `<div class="limplayer-info">
        <div class="container">
            <div class="cover">
                <img src="${audio.cover || ''}" alt="">
            </div>
            <div class="info">
                <div class="name">
                    <a href="">${audio.name}</a>
                </div>
                <div class="artist">
                    <a href="">${audio.artist}</a>
                </div>
            </div>
            <div class="like">
                <button>
                    <svg class="liked" style="display: ${audio.liked ? 'block' : 'none'};" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="71661" width="23" height="23"><path d="M669.781333 130.752c71.637333-11.093333 138.901333 11.477333 193.344 64.533333 55.317333 53.930667 81.834667 124.992 74.282667 199.530667-7.466667 73.642667-46.549333 146.368-112.32 210.474667-18.346667 17.898667-67.669333 66.218667-138.453333 135.637333-31.829333 31.232-65.706667 64.448-99.84 97.984L553.6 871.466667l-13.184 12.949333a40.554667 40.554667 0 0 1-56.832 0l-114.602667-112.64-24.213333-23.722667a677626.346667 677626.346667 0 0 0-145.856-142.762666C133.141333 541.184 94.08 468.48 86.613333 394.816c-7.552-74.538667 18.944-145.6 74.282667-199.530667 54.442667-53.056 121.706667-75.605333 193.344-64.533333 53.162667 8.213333 107.093333 34.688 157.781333 76.949333 50.709333-42.24 104.618667-68.736 157.781334-76.949333z" fill="#8680df" p-id="71662"></path></svg>
                    <svg class="unliked" style="display: ${audio.liked ? 'none' : 'block'};" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15497" width="25" height="25"><path d="M797.184 518.496L512.8 812.512l-284.16-292A162.752 162.752 0 0 1 192 417.6c0-89.088 71.808-161.6 160-161.6a159.36 159.36 0 0 1 133.28 72.16L512 368.64l26.72-40.48A159.488 159.488 0 0 1 672 256c88.224 0 160 72.512 160 161.6 0 37.536-12.992 74.08-34.816 100.896M672 192a222.72 222.72 0 0 0-160 67.712A222.624 222.624 0 0 0 352 192c-123.52 0-224 101.216-224 225.6 0 52.288 18.176 103.232 52.96 145.536L466.912 857.12A62.4 62.4 0 0 0 512 876.288c17.12 0 33.12-6.816 45.12-19.136l287.744-296.064A226.816 226.816 0 0 0 896 417.6C896 293.216 795.52 192 672 192" p-id="15498" fill="#707070"></path></svg>
                </button>
            </div>
        </div>
        </div>
        <div class="limplayer-main-controller">
        <div class="container">
            <div class="controls">
                <div class="controls-left">
                    <button class="shuffle">
                        <svg viewBox="0 0 1024 1024" class="${options.shuffle ? 'checked' : ''}" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4015" width="25" height="25"><path d="M500.6 599.8c19.7 24.5 41.5 47.7 67.1 67.9 56.4 44.5 122.9 67.1 203.1 69.1L744 763.5c-14.1 14.1-14.1 36.9 0 50.9 7 7 16.2 10.5 25.5 10.5s18.4-3.5 25.5-10.5l84-84c7.4-7.4 10.9-17.2 10.5-26.9 2.9-11.8-0.3-24.8-9.5-34l-84-84c-14.1-14.1-36.9-14.1-50.9 0s-14.1 36.9 0 50.9l28.4 28.4c-117.4-2.6-177.1-56.5-230-127.1-7.2 10.2-14.4 20.8-21.9 31.6-6.9 10.2-13.9 20.3-21 30.5zM382.8 339.6C323.4 292.8 252.6 270 166.5 270c-19.9 0-36 16.1-36 36s16.1 36 36 36c145.4 0 205.2 75 267.8 165.5 14.2-20.7 28.7-41.8 44.3-62.2-27.2-38.1-57.2-75.3-95.8-105.7z" p-id="4016" fill="#707070"></path><path d="M891.5 338.4c0.4-9.7-3.1-19.5-10.5-26.9l-84-84c-14.1-14.1-36.9-14.1-50.9 0-14.1 14.1-14.1 36.9 0 50.9l26.7 26.7c-80.2 2-146.7 24.7-203.1 69.1-51.1 40.3-87.1 92.7-121.8 143.4C380.7 615.5 322.8 700 168.5 700c-19.9 0-36 16.1-36 36s16.1 36 36 36c86.1 0 156.9-22.8 216.3-69.6 51.4-40.5 87.5-93.1 122.4-144 65.5-95.4 122.2-178.1 268.2-181.3L747 405.5c-14.1 14.1-14.1 36.9 0 50.9 7 7 16.2 10.5 25.5 10.5s18.4-3.5 25.5-10.5l84-84c9.2-9.2 12.4-22.2 9.5-34z" p-id="4017" fill="#707070"></path></svg>
                        <span class="pointer" style="display: ${options.shuffle ? 'block' : 'none'};"></span>
                    </button>
                    <button class="pre">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4687" width="25" height="25"><path d="M206 865h-38c-30.928 0-56-25.072-56-56V216c0-30.928 25.072-56 56-56h38c30.928 0 56 25.072 56 56v593c0 30.928-25.072 56-56 56z m168.686-386.191l422.304-303.4c32.294-23.201 77.282-15.83 100.484 16.464A72 72 0 0 1 911 233.883v559.053c0 39.764-32.235 72-72 72a72 72 0 0 1-39.95-12.1L376.288 570.877c-25.73-17.16-32.677-51.93-15.517-77.66a56 56 0 0 1 13.915-14.408z" p-id="4688" fill="#707070"></path></svg>
                    </button>
                </div>
                <div class="controls-playpause">
                    <button>
                        <svg class="play" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14100" width="36" height="36"><path d="M512 42.666667C252.793333 42.666667 42.666667 252.793333 42.666667 512s210.126667 469.333333 469.333333 469.333333 469.333333-210.126667 469.333333-469.333333S771.206667 42.666667 512 42.666667z m196.546667 500.493333l-266.666667 176A37.333333 37.333333 0 0 1 384 688V336.033333a37.333333 37.333333 0 0 1 57.893333-31.16l266.666667 176a37.333333 37.333333 0 0 1 0 62.32z" fill="#707070" p-id="14101"></path></svg>
                        <svg style="display: none;" class="pause" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14531" width="36" height="36"><path d="M512 42.666667a469.333333 469.333333 0 1 0 469.333333 469.333333A469.333333 469.333333 0 0 0 512 42.666667z m-47.466667 611.893333a37.333333 37.333333 0 0 1-74.666666 0V369.44a37.333333 37.333333 0 0 1 74.666666 0z m169.6 0a37.333333 37.333333 0 1 1-74.666666 0V369.44a37.333333 37.333333 0 0 1 74.666666 0z" p-id="14532" fill="#707070"></path></svg>
                    </button>
                </div>
                <div class="controls-right">
                    <button class="next">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5513" width="25" height="25"><path d="M817 160h38c30.928 0 56 25.072 56 56v593c0 30.928-25.072 56-56 56h-38c-30.928 0-56-25.072-56-56V216c0-30.928 25.072-56 56-56zM648.314 546.191l-422.304 303.4c-32.294 23.201-77.282 15.83-100.484-16.464A72 72 0 0 1 112 791.117V232.064c0-39.764 32.235-72 72-72a72 72 0 0 1 39.95 12.1l422.762 281.959c25.73 17.16 32.677 51.93 15.517 77.66a56 56 0 0 1-13.915 14.408z" p-id="5514" fill="#707070"></path></svg>
                    </button>
                    <button class="loop">
                        <svg style="display: ${options.loopType === 'single' ? 'block' : 'none'};" class="single ${options.loopType === 'single' ? 'checked' : ''}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10426" width="25" height="25"><path d="M361.5 727.8c-119.1 0-215.9-96.9-215.9-215.9 0-119.1 96.9-215.9 215.9-215.9 2.3 0 4.6-0.2 6.8-0.6v58.3c0 12.3 14 19.4 23.9 12.1l132.6-97.6c8.1-6 8.1-18.2 0-24.2l-132.6-97.6c-9.9-7.3-23.9-0.2-23.9 12.1v58.1c-2.2-0.4-4.5-0.6-6.8-0.6-39.8 0-78.5 7.9-115 23.4-35.2 15-66.8 36.3-94 63.5s-48.6 58.8-63.5 94c-15.5 36.5-23.4 75.2-23.4 115s7.9 78.5 23.4 115c15 35.2 36.3 66.8 63.5 94s58.8 48.6 94 63.5c36.5 15.5 75.2 23.4 115 23.4 22.1 0 40-17.9 40-40s-17.9-40-40-40zM938.2 396.9c-15-35.2-36.3-66.8-63.5-94s-58.8-48.6-94-63.5c-36.5-15.5-75.2-23.4-115-23.4-22.1 0-40 17.9-40 40s17.9 40 40 40c119.1 0 215.9 96.9 215.9 215.9 0 119.1-96.9 215.9-215.9 215.9-4.1 0-8.1 0.6-11.8 1.8v-60.8c0-12.3-14-19.4-23.9-12.1l-132.6 97.6c-8.1 6-8.1 18.2 0 24.2L629.9 876c9.9 7.3 23.9 0.2 23.9-12.1V806c3.7 1.2 7.7 1.8 11.8 1.8 39.8 0 78.5-7.9 115-23.4 35.2-15 66.8-36.3 94-63.5s48.6-58.8 63.5-94c15.5-36.5 23.4-75.2 23.4-115s-7.8-78.5-23.3-115z" p-id="10427" fill="#707070"></path><path d="M512.8 660.6c22.1-0.1 39.9-18.1 39.8-40.2l-1.2-214.1c-0.1-22-18-39.8-40-39.8h-0.2c-22.1 0.1-39.9 18.1-39.8 40.2l1.2 214.1c0.1 22 18 39.8 40 39.8h0.2z" p-id="10428" fill="#707070"></path></svg>
                        <svg style="display: ${options.loopType === 'single' ? 'none' : 'block'};" class="list ${options.loopType === 'list' ? 'checked' : ''}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10049" width="25" height="25"><path d="M361.5 727.8c-119.1 0-215.9-96.9-215.9-215.9 0-119.1 96.9-215.9 215.9-215.9 2.3 0 4.6-0.2 6.8-0.6v58.3c0 12.3 14 19.4 23.9 12.1l132.6-97.6c8.1-6 8.1-18.2 0-24.2l-132.6-97.6c-9.9-7.3-23.9-0.2-23.9 12.1v58.1c-2.2-0.4-4.5-0.6-6.8-0.6-39.8 0-78.5 7.9-115 23.4-35.2 15-66.8 36.3-94 63.5s-48.6 58.8-63.5 94c-15.5 36.5-23.4 75.2-23.4 115s7.9 78.5 23.4 115c15 35.2 36.3 66.8 63.5 94s58.8 48.6 94 63.5c36.5 15.5 75.2 23.4 115 23.4 22.1 0 40-17.9 40-40s-17.9-40-40-40zM938.2 396.9c-15-35.2-36.3-66.8-63.5-94s-58.8-48.6-94-63.5c-36.5-15.5-75.2-23.4-115-23.4-22.1 0-40 17.9-40 40s17.9 40 40 40c119.1 0 215.9 96.9 215.9 215.9 0 119.1-96.9 215.9-215.9 215.9-4.1 0-8.1 0.6-11.8 1.8v-60.8c0-12.3-14-19.4-23.9-12.1l-132.6 97.6c-8.1 6-8.1 18.2 0 24.2L629.9 876c9.9 7.3 23.9 0.2 23.9-12.1V806c3.7 1.2 7.7 1.8 11.8 1.8 39.8 0 78.5-7.9 115-23.4 35.2-15 66.8-36.3 94-63.5s48.6-58.8 63.5-94c15.5-36.5 23.4-75.2 23.4-115s-7.8-78.5-23.3-115z" p-id="10050" fill="#707070"></path></svg>
                        <span class="pointer" style="display: ${options.loopType === 'none' ? 'none' : 'block'};"></span>
                    </button>
                </div>
            </div>
            <div class="playback">
                <div class="now-position">
                    <span>0:00</span>
                </div>
                <div class="progressbar">
                    <span class="total">
                        <span class="now">
                            <span class="pointer"></span>
                        </span>
                    </span>
                </div>
                <div class="duration">
                    <span>0:00</span>
                </div>
            </div>
        </div>
        </div>
        <div class="limplayer-side-controller">
        <div class="container">
            <div class="other">
                <button>
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17962" width="20" height="20"><path d="M977.55 140.13c25.71 0 46.55 20.82 46.55 46.5s-20.84 46.5-46.55 46.5h-512c-25.71 0-46.55-20.82-46.55-46.5s20.84-46.5 46.55-46.5h512z m0 325.5c25.71 0 46.55 20.82 46.55 46.5s-20.84 46.5-46.55 46.5H651.74c-25.71 0-46.55-20.82-46.55-46.5s20.84-46.5 46.55-46.5h325.81zM87.69 241.68c12.26 7.26 242.97 144.96 257.53 153.69 16.97 10.11 27.14 27.58 27.24 46.72 0.1 19.24-9.96 36.9-26.93 47.21-5.5 3.36-58.86 35.31-115.82 69.34l-22.87 13.66c-57.13 34.12-111.95 66.78-120.2 71.47-9.22 5.2-19.49 7.85-29.76 7.85-9.43 0-18.86-2.26-27.35-6.67C11.1 635.24 0.1 617.18 0.1 596.57V288.69c0-20.71 11.63-39.55 30.28-49.17 17.91-9.22 39.39-8.44 57.31 2.16z m889.86 549.45c25.71 0 46.55 20.82 46.55 46.5s-20.84 46.5-46.55 46.5H46.64c-25.71 0-46.55-20.82-46.55-46.5s20.84-46.5 46.55-46.5h930.91z" p-id="17963" fill="#707070"></path></svg>
                </button>
                <!-- <button>
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23235" width="22" height="22"><path d="M256 128h640a96 96 0 0 1 96 96v448a96 96 0 0 1-96 96h-288v-64h288a32 32 0 0 0 32-32V224a32 32 0 0 0-32-32H256a32 32 0 0 0-32 32v224H160V224a96 96 0 0 1 96-96zM128 512h320a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96H128a96 96 0 0 1-96-96v-192a96 96 0 0 1 96-96z m0 64h320a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H128a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32z" p-id="23236" fill="#707070"></path></svg>
                </button> -->
                <button>
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="70512" width="22" height="22"><path d="M443.624727 162.909091c84.177455 0 162.932364 36.072727 218.437818 98.909091 15.918545-2.536727 32.093091-4.189091 48.709819-4.189091C883.479273 257.629091 1024 398.103273 1024 570.810182s-140.520727 313.250909-313.227636 313.250909h-477.090909C104.820364 884.061091 0 779.194182 0 650.333091c0-94.114909 56.017455-178.641455 142.708364-215.319273 0.046545 0 0.116364 0 0.186181-0.046545l0.186182-0.116364 9.611637-3.909818C164.840727 281.134545 290.676364 162.909091 443.624727 162.909091z m0 69.818182c-122.461091 0-222.091636 99.607273-222.091636 222.068363a34.909091 34.909091 0 0 1-21.690182 32.302546l-29.998545 12.288A163.653818 163.653818 0 0 0 69.818182 650.356364c0 90.368 73.518545 163.886545 163.863273 163.886545h477.090909c134.213818 0 243.409455-109.149091 243.409454-243.409454 0-134.237091-109.195636-243.409455-243.409454-243.409455-134.213818 0-243.386182 109.172364-243.386182 243.432727v26.856728l24.645818-24.645819a34.909091 34.909091 0 1 1 49.361455 49.361455l-84.247273 84.247273a34.746182 34.746182 0 0 1-24.669091 10.24c-8.936727 0-17.896727-3.421091-24.692364-10.24l-84.247272-84.247273a34.909091 34.909091 0 1 1 49.361454-49.338182l24.669091 24.622546v-26.88c0-128.069818 77.335273-238.266182 187.694545-286.766546A220.974545 220.974545 0 0 0 443.624727 232.727273z m267.147637 136.401454c111.220364 0 201.704727 90.484364 201.704727 201.704728a34.909091 34.909091 0 0 1-69.818182 0 132.026182 132.026182 0 0 0-131.886545-131.886546 34.909091 34.909091 0 1 1 0-69.818182z" p-id="70513" fill="#707070"></path></svg>
                </button>
            </div>
            <div class="volume">
                <button>
                    <svg style="display: ${(options.volume === 0 || options.mute) ? 'block' : 'none'};" class="mute" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29461" width="20" height="20"><path d="M315.861333 245.546667c83.328-100.053333 97.408-112.896 145.493334-95.488l4.266666 1.578666c41.216 16 45.909333 35.968 46.336 142.464v435.797334c-0.426667 110.037333-5.418667 127.658667-50.602666 144.042666l-4.437334 1.536c-41.728 13.994667-58.154667 1.706667-126.250666-79.274666l-97.834667-117.333334-64.085333-12.8a106.666667 106.666667 0 0 1-66.133334-42.922666l-4.437333-6.826667a203.264 203.264 0 0 1-5.461333-198.954667l5.461333-9.685333a106.666667 106.666667 0 0 1 70.570667-49.749333l64.085333-12.842667z m109.824 2.901333l-11.52 12.885333c-3.413333 3.925333-7.253333 8.448-11.648 13.653334L293.12 406.101333a61.866667 61.866667 0 0 1-35.413333 21.077334l-72.234667 14.421333a20.906667 20.906667 0 0 0-13.482667 8.832l-4.181333 7.424c-18.773333 36.138667-17.493333 79.530667 3.541333 114.56a21.333333 21.333333 0 0 0 14.122667 9.984l72.277333 14.421333c13.824 2.773333 26.325333 10.24 35.370667 21.077334l94.250667 113.066666c11.434667 13.696 20.010667 23.850667 26.837333 31.701334l11.477333 12.842666 0.554667-13.482666c0.128-5.461333 0.256-11.776 0.298667-19.2L426.666667 298.666667c0-13.610667-0.128-24.277333-0.298667-32.938667l-0.64-17.28z m240.469334 101.845333l4.010666 3.541334L768 451.626667l97.834667-97.792a42.666667 42.666667 0 0 1 63.872 56.32l-3.541334 4.010666L828.330667 512l97.834666 97.877333a42.666667 42.666667 0 0 1-56.32 63.872l-4.010666-3.541333L768 572.288l-97.834667 97.877333a42.666667 42.666667 0 0 1-63.872-56.32l3.541334-4.010666 97.834666-97.877334-97.834666-97.792a42.666667 42.666667 0 0 1 56.32-63.872z" p-id="29462" fill="#707070"></path></svg>
                    <svg style="display: ${(!options.mute && options.volume! > 0 && options.volume! <= 0.5) ? 'block' : 'none'};" viewBox="0 0 1024 1024" class="medium" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29104" width="20" height="20"><path d="M401.194667 245.546667c83.328-100.053333 97.408-112.896 145.493333-95.488l4.266667 1.578666c41.216 16 45.909333 35.968 46.336 142.464v435.797334c-0.426667 110.037333-5.418667 127.658667-50.602667 144.042666l-4.437333 1.536c-41.728 13.994667-58.154667 1.706667-126.250667-79.274666l-97.834667-117.333334-64.085333-12.8a106.666667 106.666667 0 0 1-66.133333-42.922666l-4.437334-6.826667a203.264 203.264 0 0 1-5.461333-198.954667l5.461333-9.685333a106.666667 106.666667 0 0 1 70.570667-49.749333l64.085333-12.842667z m109.824 2.901333l-11.52 12.885333c-3.413333 3.925333-7.253333 8.448-11.648 13.653334L378.453333 406.101333a61.866667 61.866667 0 0 1-35.413333 21.077334l-72.234667 14.421333a20.906667 20.906667 0 0 0-13.482666 8.832l-4.181334 7.424c-18.773333 36.138667-17.493333 79.530667 3.541334 114.56a21.333333 21.333333 0 0 0 14.122666 9.984l72.277334 14.421333c13.824 2.773333 26.325333 10.24 35.370666 21.077334l94.250667 113.066666c11.434667 13.696 20.010667 23.850667 26.837333 31.701334l11.477334 12.842666 0.554666-13.482666c0.128-5.461333 0.256-11.776 0.298667-19.2L512 298.666667c0-13.610667-0.128-24.277333-0.298667-32.938667l-0.64-17.28z m267.349333 82.517333a256 256 0 0 1 1.408 360.618667 42.666667 42.666667 0 0 1-60.8-59.861333 170.666667 170.666667 0 0 0-0.981333-240.384 42.666667 42.666667 0 1 1 60.373333-60.373334z" p-id="29105" fill="#707070"></path></svg>
                    <svg style="display: ${!options.mute && options.volume! > 0.5 ? 'block' : 'none'};" class="high" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29818" width="20" height="20"><path d="M315.861333 245.546667c83.328-100.053333 97.408-112.896 145.493334-95.488l4.266666 1.578666c41.216 16 45.909333 35.968 46.336 142.464v435.797334c-0.426667 110.037333-5.418667 127.658667-50.602666 144.042666l-4.437334 1.536c-41.728 13.994667-58.154667 1.706667-126.250666-79.274666l-97.834667-117.333334-64.085333-12.8a106.666667 106.666667 0 0 1-66.133334-42.922666l-4.437333-6.826667a203.264 203.264 0 0 1-5.461333-198.954667l5.461333-9.685333a106.666667 106.666667 0 0 1 70.570667-49.749333l64.085333-12.842667z m553.002667-5.077334a384 384 0 0 1 2.133333 540.928 42.666667 42.666667 0 1 1-60.8-59.861333 298.666667 298.666667 0 0 0-1.706666-420.693333 42.666667 42.666667 0 1 1 60.373333-60.373334z m-443.178667 7.978667l-11.52 12.885333c-3.413333 3.925333-7.253333 8.448-11.648 13.653334L293.12 406.101333a61.866667 61.866667 0 0 1-35.413333 21.077334l-72.234667 14.421333a20.906667 20.906667 0 0 0-13.482667 8.832l-4.181333 7.424c-18.773333 36.138667-17.493333 79.530667 3.541333 114.56a21.333333 21.333333 0 0 0 14.122667 9.984l72.277333 14.421333c13.824 2.773333 26.325333 10.24 35.370667 21.077334l94.250667 113.066666c11.434667 13.696 20.010667 23.850667 26.837333 31.701334l11.477333 12.842666 0.554667-13.482666c0.128-5.461333 0.256-11.776 0.298667-19.2L426.666667 298.666667c0-13.610667-0.128-24.277333-0.298667-32.938667l-0.64-17.28z m267.349334 82.517333a256 256 0 0 1 1.408 360.618667 42.666667 42.666667 0 0 1-60.8-59.861333 170.666667 170.666667 0 0 0-0.981334-240.384 42.666667 42.666667 0 1 1 60.373334-60.373334z" p-id="29819" fill="#707070"></path></svg>
                </button>
                <div class="progressbar">
                    <span class="total">
                        <span class="now" style="width: ${options.mute ? 0 : options.volume! * 100}%;">
                            <span class="pointer"></span>
                        </span>
                    </span>
                </div>
            </div>
        </div>
        </div>`;
    }
}
