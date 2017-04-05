import ko from 'knockout';
import sailplay from 'sailplay-hub';

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

export default function(messager) {
    return function (params) {
        this.history = ko.observableArray([]);
        
        this.formatDate = date_string => {
            let date = new Date(date_string);
            return `${pad(date.getDate(), 2)}.${pad(date.getMonth(), 2)}.${date.getFullYear()}`
        }

        this.checkPoints = points => {
            let point = parseInt(points);
            if (point > 0) return `+${points}`;
            return points
        }

        this.update = config => {
            if (!config) config = this.config
            sailplay.jsonp.get(config.DOMAIN + config.urls.users.history, {
                auth_hash: config.auth_hash,
            }, result => {
                this.history(result.history);
            })
        }

        messager.subscribe('init', config => {
            this.config = config;
            this.update(config);
        })

        messager.subscribe('history_update', this.update)

        this.popupVm = {
            opened: ko.observable(false),
            history: this.history,
            pages: ko.computed(() => {
                return Math.ceil(this.history().length / 6.0)
            }),
            setPage: index => {
                this.popupVm.current_page(index())
            },
            nextPage: () => {
                this.popupVm.current_page(this.popupVm.current_page() + 1)
            },
            formatDate: this.formatDate,
            checkPoints: this.checkPoints,
            width: ko.observable('488px'),
            current_page: ko.observable(0),
            openHistory: () => {
                document.body.className += ' no_scrol';
                this.popupVm.current_page(0);
                this.popupVm.opened(true)                    
            }        
        }
    }
}