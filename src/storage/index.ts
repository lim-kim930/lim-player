
export default class PlayerStorage {
    public static getVolume() {
        const volume = localStorage.getItem("lim_player_volume");
        if(!volume) return false;
        const num_volume = Number(volume);
        if(isNaN(num_volume) || num_volume>1 || num_volume<0) return false;
        return num_volume;
    }

    public static getOptions() {
        const options = localStorage.getItem("lim_player_options");
        
    }
}