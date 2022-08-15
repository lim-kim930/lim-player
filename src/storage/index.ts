import { PlayerOptions } from "../types";

export default class PlayerStorage {

    public static getOptions() {
        const options = localStorage.getItem("lim_player_options");
        return options ? JSON.parse(options) as PlayerOptions : null;
    }

    public static setOptions(options: PlayerOptions) {
        localStorage.setItem("lim_player_options", JSON.stringify(options));     
    }
    
}