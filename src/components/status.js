import ko from 'knockout';
import sailplay from 'sailplay-hub';

export default function(messager) {
    return function (params) {
        this.statuses = ko.observableArray([]);
        this.firstActive = ko.observable(-1);
        this.isActive = (status, index) => {
            if (this.firstActive() == -1)
                if (status.is_received) {
                    this.firstActive(index())
                }

            return this.firstActive() == index()    
        }

        this.update = config => {
            if (!config) config = this.config;
            this.alreadyActive = false;
            sailplay.send('load.badges.list', {
                lang: 'ru'
            })
        }

        sailplay.on('load.badges.list.success', result => {
            result.multilevel_badges.forEach(arr => {
                let temp = [].concat(arr)
                if (arr[0].name == 'Участник')
                    this.statuses(temp.reverse())                
            })
        });

        messager.subscribe('init', config => {
            this.config = config;
            this.update(config)
        })
    }
}