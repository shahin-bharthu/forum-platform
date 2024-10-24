// export default function deleteCookie() {    
//     console.log(document.cookie);
    
//     const date = new Date();
//     date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
//     document.cookie = "token"+"=; expires="+date.toUTCString()+";";
//     console.log(document.cookie);
    
// }

export default function deleteCookie() {    
    console.log("Before Deleting Cookie:", document.cookie);
    const date = new Date();
    date.setTime(date.getTime() - (24 * 60 * 60 * 1000));
    document.cookie = "token=; expires=" + date.toUTCString() + "; path=/;";
    console.log("After Deleting Cookie:", document.cookie);
}
