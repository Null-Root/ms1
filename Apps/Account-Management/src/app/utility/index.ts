function sleep(milliseconds: number): Promise<object> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function redirectWithParams(url: string, params: any) {
    const queryParams = Object.keys(params)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');

    const redirect_url = `${url}?${queryParams}`;

    window.location.href = redirect_url;
}

export {
    sleep,
    redirectWithParams
};