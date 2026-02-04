const pixelId = import.meta.env.VITE_TIKTOK_PIXEL_ID;

export const initTikTokPixel = () => {
    if (pixelId && typeof window !== 'undefined') {
        // TikTok Pixel Code
        !(function (w, d, t) {
            w.TiktokAnalyticsObject = t;
            var ttq = (w[t] = w[t] || []);
            (ttq.methods = [
                'page',
                'track',
                'identify',
                'instances',
                'debug',
                'on',
                'off',
                'once',
                'ready',
                'alias',
                'group',
                'enableCookie',
                'disableCookie',
            ]),
                (ttq.setAndDefer = function (t, e) {
                    t[e] = function () {
                        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                    };
                });
            for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
            (ttq.instance = function (t) {
                for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
                    ttq.setAndDefer(e, ttq.methods[n]);
                return e;
            }),
                (ttq.load = function (e, n) {
                    var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
                    (ttq._i = ttq._i || {}),
                        (ttq._i[e] = []),
                        (ttq._i[e]._u = i),
                        (ttq._t = ttq._t || {}),
                        (ttq._t[e] = +new Date()),
                        (ttq._o = ttq._o || {}),
                        (ttq._o[e] = n || {});
                    var o = document.createElement('script');
                    (o.type = 'text/javascript'), (o.async = !0), (o.src = i + '?sdkid=' + e + '&lib=' + t);
                    var a = document.getElementsByTagName('script')[0];
                    a.parentNode.insertBefore(o, a);
                });

            ttq.load(pixelId);
            ttq.page();
        })(window, document, 'ttq');
    }
};

export const trackTikTokPageView = () => {
    if (pixelId && window.ttq) {
        window.ttq.page();
    }
};

export const trackTikTokViewContent = (contentName, contentId, value, currency = 'DZD') => {
    if (pixelId && window.ttq) {
        window.ttq.track('ViewContent', {
            content_name: contentName,
            content_id: contentId,
            content_type: 'product',
            value: value,
            currency: currency,
        });
    }
};

export const trackTikTokAddToCart = (contentName, contentId, value, currency = 'DZD') => {
    if (pixelId && window.ttq) {
        window.ttq.track('AddToCart', {
            content_name: contentName,
            content_id: contentId,
            content_type: 'product',
            value: value,
            currency: currency,
        });
    }
};

export const trackTikTokInitiateCheckout = (value, currency = 'DZD') => {
    if (pixelId && window.ttq) {
        window.ttq.track('InitiateCheckout', {
            value: value,
            currency: currency,
        });
    }
};

export const trackTikTokPurchase = (value, currency = 'DZD') => {
    if (pixelId && window.ttq) {
        window.ttq.track('CompletePayment', {
            value: value,
            currency: currency,
        });
    }
};
