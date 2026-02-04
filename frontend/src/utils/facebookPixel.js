import ReactPixel from 'react-facebook-pixel';

const pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID;

export const initFacebookPixel = () => {
    if (pixelId) {
        ReactPixel.init(pixelId, {}, {
            autoConfig: true,
            debug: false,
        });
        ReactPixel.pageView();
    }
};

export const trackPageView = () => {
    if (pixelId) {
        ReactPixel.pageView();
    }
};

export const trackViewContent = (contentName, contentId, value, currency = 'DZD') => {
    if (pixelId) {
        ReactPixel.track('ViewContent', {
            content_name: contentName,
            content_ids: [contentId],
            content_type: 'product',
            value: value,
            currency: currency,
        });
    }
};

export const trackAddToCart = (contentName, contentId, value, currency = 'DZD') => {
    if (pixelId) {
        ReactPixel.track('AddToCart', {
            content_name: contentName,
            content_ids: [contentId],
            content_type: 'product',
            value: value,
            currency: currency,
        });
    }
};

export const trackInitiateCheckout = (value, currency = 'DZD', numItems) => {
    if (pixelId) {
        ReactPixel.track('InitiateCheckout', {
            value: value,
            currency: currency,
            num_items: numItems,
        });
    }
};

export const trackPurchase = (value, currency = 'DZD', orderId) => {
    if (pixelId) {
        ReactPixel.track('Purchase', {
            value: value,
            currency: currency,
            transaction_id: orderId,
        });
    }
};

export const trackSearch = (searchString) => {
    if (pixelId) {
        ReactPixel.track('Search', {
            search_string: searchString,
        });
    }
};
