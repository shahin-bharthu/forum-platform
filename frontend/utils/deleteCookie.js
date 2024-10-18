export default function deleteCookie() {    
    const date = new Date();
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    document.cookie = "token"+"=; expires="+date.toUTCString()+";";
}