import './less/main.less';

import templates from './templates/main.html';
import components from './templates/components.html';
import sailplay from 'sailplay-hub';

import profileTemplate from './components/templates/profile.template.html';
import historyTemplate from './components/templates/history.template.html';
import tabsTemplate from './components/templates/tabs.template.html';
import questTemplate from './components/templates/quest.template.html';
import giftsTemplate from './components/templates/gifts.template.html';
import achivTemplate from './components/templates/achiv.template.html';
import statusTemplate from './components/templates/status.template.html';

import koProfile from './components/profile.js';
import koHistory from './components/history.js';
import koTabs from './components/tabs.js';
import koQuest from './components/quest.js';
import koGifts from './components/gifts.js';
import koAchiv from './components/achiv.js';
import koStatus from './components/status.js';

import ko from 'knockout';
import 'knockout-mapping';
import 'knockout.validation';

var messager = (function(){
    var queue = new ko.subscribable();
    return {
        subscribe(topic, handler) {
            queue.subscribe(handler, null, topic)
        },

        publish(message, topic) {
            queue.notifySubscribers(message, topic)
        }
    }
}())

var register = ko.components.register;

register('ko-slider', {
    viewModel: function (params) {
        this.slides = params.slides;
        this.currentSlide = ko.observable(0);
    },
    template: components.koSlider()
});

register('ko-popup', {
    viewModel: function(params) {
        this.data = params.data;
        this.closePopup = () => {
            this.data.opened(false);
            document.body.className = document.body.className.replace(' no_scrol', '');            
        }
    },
    template: components.koPopup()
});

register('ko-tabs', { viewModel: koTabs(messager), template: tabsTemplate.koTabs() })
register('ko-quest', {viewModel: koQuest(messager), template: questTemplate.koQuest() })
register('ko-profile', { viewModel: koProfile(messager), template: profileTemplate.koProfile() })
register('ko-history', { viewModel: koHistory(messager), template: historyTemplate.koHistory() })
register('ko-gifts', { viewModel: koGifts(messager), template: giftsTemplate.koGifts() })
register('ko-achiv', { viewModel: koAchiv(messager), template: achivTemplate.koAchiv() })
register('ko-status', { viewModel: koStatus(messager), template: statusTemplate.koStatus() })

ko.bindingHandlers.cssVisible = {
    update: function (element, valueAccessor) {
        var value = valueAccessor();

        if (ko.unwrap(value)) element.className += ' show'
        else element.className = element.className.replace(' show', '')
    }
};

class SailplaySportDepot {
    constructor(element, params) {
        this.vm = {
            landing: ko.observable(false),
            toggle_landing: () => {
                this.vm.landing(!this.vm.landing())
            }
        }

        this.auth_hash = params.auth_hash;
        this.options = params.options
        this.vm.slider_items = params.slider_items;

        element.innerHTML = templates.index();
        ko.applyBindings(this.vm, element)

        this.init();
    }

    init() {
        sailplay.send('init', this.options)
        sailplay.on('init.success', config => {
            this.config = config;
            this.config.auth_hash = this.auth_hash;
            messager.publish(config, 'init')
        })
    }
}

(function (window) {
    window.SailPlay = function (element, params) {
        new SailplaySportDepot(element, params)
    }
}(window))