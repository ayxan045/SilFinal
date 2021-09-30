import axios from "axios";


export const currency = axios.create({
    baseURL: `https://currencyapi-net.p.rapidapi.com`,
    headers: {
        "Content-Type": "application/json",
        "X-rapidapi-key": "0da47a7b9bmsh48658d2729625a8p148596jsn7d7b0ed33ecb",
        "X-rapidapi-host": "currencyapi-net.p.rapidapi.com",
        "useQueryString": true
    },
});

export default currency;
