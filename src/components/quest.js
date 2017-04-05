import ko from 'knockout';
import sailplay from 'sailplay-hub';
import 'sailplay-hub-actions';

export default function(messager) {
    return function (params) {
        messager.subscribe('init', config => {
            sailplay.send('load.actions.list')
            sailplay.on('load.actions.list.success', data => {
                // sailplay.send('actions.perform', data.actions[0])
            })
            sailplay.on('actions.perform.success', data => {
                console.log(data)
            })
        })
    }
}