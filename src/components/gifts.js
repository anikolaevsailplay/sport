import ko from 'knockout';
import sailplay from 'sailplay-hub';

export default function(messager) {
    return function (params) {
        this.gifts = ko.observableArray([]);
        this.getNoun = (number, one, two, five) => {
            number = Math.abs(parseInt(number));
            number %= 100;
            if (number >= 5 && number <= 20) {
                return five;
            }
            number %= 10;
            if (number == 1) {
                return one;
            }
            if (number >= 2 && number <= 4) {
                return two;
            }
            return five;
        }

        this.gift_purchase = gift => {
            sailplay.send('gifts.purchase', { gift });
            sailplay.on('gifts.purchase.success', result => {
                if (result.status == 'ok') {
                    setTimeout(() => {
                        messager.publish(null, 'profile_update')
                        messager.publish(null, 'history_update')    
                    }, 500)
                }                
            })
        }
        
        messager.subscribe('init', config => {
            this.config = config;
            sailplay.jsonp.get(config.DOMAIN + config.urls.gifts.list, {
                auth_hash: config.auth_hash,
                lang: 'ru'
            }, result => {
                this.gifts(result.gifts)
            })
        })
    }
}