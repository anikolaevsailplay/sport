import ko from 'knockout';
import sailplay from 'sailplay-hub';

export default function(messager) {
    return function (params) {
        this.achiv = ko.observableArray([]);
        
        this.update = config => {
            if (!config) config = this.config;
            sailplay.send('load.badges.list', {
                lang: 'ru',
                include_rules: 1
            })
        }

        sailplay.on('load.badges.list.success', result => {
        });

        messager.subscribe('init', config => {
            this.config = config;
            this.update(config)
        })


    }
}