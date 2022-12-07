import axios from "axios";

export default class HomeService {
    GetAll() {
        axios.get("http://demo7277709.mockable.io/").then(res => {
            console.log(res.data);
        });
    }
}