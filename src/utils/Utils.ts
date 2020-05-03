export class Utils {

    // convert ts object to json
    public static getJson(data: any){
        return JSON.parse(JSON.stringify(data))
    }
}