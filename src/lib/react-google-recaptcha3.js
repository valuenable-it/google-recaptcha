function getRecaptcha3() {
    const data = {
        baseUrl: 'https://www.google.com/recaptcha/api.js',
        siteKey: '',
        isLoaded: false,
        isPending: false,
        scriptId: '',
    }

    return {
        init: (siteKey) => {
            window['reactRecaptcha3Loaded'] = () => {
                data.isLoaded = true;
                data.isPending = false;
            };
            data.scriptId = +(new Date());

            return new Promise((resolve, reject) => {
                if (data.isLoaded || data.isPending) {
                    resolve('success');
                    return;
                } else {
                    data.isPending = true;
                    data.siteKey = siteKey;
                    const script = document.createElement('script');
                    script.innerHTML = '';
                    script.src = data.baseUrl + `?render=${data.siteKey}&onload=reactRecaptcha3Loaded`;
                    script.id = `recapthcha-${data.scriptId}`;
                    script.async = true;
                    script.defer = true;
                    script.onload = () => {
                        resolve('success');
                    }
                    script.onerror = () => {
                        reject('error');
                    };
                    (document.head || document.boby).appendChild(script);
                }

            });

        },
        getToken: (action) => {
            try {
                return window['grecaptcha'] ? window['grecaptcha'].execute(data.siteKey, action) : Promise.reject("grecaptcha is not initialized: Use ReactRecaptcha3.init(...)");
            } catch (e) {
                return new Promise((resolve, reject) => {
                    reject(e);
                });
            }
        },
        destroy: () => {
            data.isLoaded = false;
            const script = document.getElementById(`recapthcha-${data.scriptId}`);
            if (script) {
                script.remove();
            }
            const badge = document.getElementsByClassName('grecaptcha-badge')[0];
            if (badge) {
                badge.remove();
            }
            window['grecaptcha'] = undefined;

        }
    }
}



const ReactRecaptcha3 = getRecaptcha3();
export default ReactRecaptcha3;