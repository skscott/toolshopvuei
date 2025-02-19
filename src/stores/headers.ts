export function get_headers() {
    let token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token,
    };
    return headers;
}
export function get_headers2() {
    let token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Token ' + token,
    };
    return headers;
}
