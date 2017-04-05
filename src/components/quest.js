import ko from 'knockout';
import sailplay from 'sailplay-hub';
import 'sailplay-hub-actions';

export default function(messager) {
    return function (params) {
        this.actions = ko.observableArray([])
        this.isAction = (action, name) => {
            if (action.action) return action.action == name
            else return action.type == name
        }

        this.perform = action => {
            sailplay.send('actions.perform', action)
        }

        sailplay.on('actions.perform.complete', data => {
            setTimeout(() => {
                messager.publish(this.config, 'init');            
            }, 500)
        })  
      

        messager.subscribe('init', config => {
            this.config = config;
            sailplay.send('load.actions.list')
            sailplay.on('load.actions.list.success', data => {
                this.actions(data.actions)
            })
        })
    }
}