import { redirect } from "react-router-dom";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

export function getTokenDuration() {
    const storedExpirationDate = getCookie('expiration');
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();

    return duration;
}

export function getAuthToken() {
    const token = getCookie('token');

    if (!token) {
        return null;
    }
    
    const tokenDuration = getTokenDuration();

    if (tokenDuration < 0) {
        return 'EXPIRED';
    }

    return token;
}

export function tokenLoader() {
    return getAuthToken();
}

export function checkAuthLoader() {
    const token = getAuthToken();

    if (!token) {
        return redirect('/auth?mode=login');
    }

    return null;
}
