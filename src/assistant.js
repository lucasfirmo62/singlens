export function removeQuote(item){
    return item.slice(1, item.length - 1); 
}


export function exitAccount() {
    var token;
    localStorage.setItem('user', JSON.stringify(null));
    localStorage.setItem('IdUser', JSON.stringify(null));
    localStorage.setItem('nameUser', JSON.stringify(null));

    window.location.replace("/login");
    return token = null;
}
