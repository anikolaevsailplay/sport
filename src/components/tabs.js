import ko from 'knockout';

export default function () {
    return function (params) {
        this.tabs = ko.observableArray(params.tabs);
        this.currentTabIndex = ko.observable(0);
        this.setTab = index => {
            this.currentTabIndex(index())
        }
    }
}