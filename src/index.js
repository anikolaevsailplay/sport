import templates from './templates/main.html';
import components from './templates/components.html';

import ko from 'knockout';
import './less/main.less';

ko.components.register('ko-slider', {
    viewModel: function(params) {
        this.slides = params.slides;
        this.currentSlide = ko.observable(0);
    },
    template: components.koSlider()
});

ko.bindingHandlers.cssVisible = {
    update: function(element, valueAccessor) {
        var value = valueAccessor();

        if (ko.unwrap(value)) element.className += ' show'
        else element.className = element.className.replace(' show', '')
    }
};

class SailplaySportDepot {
    constructor() {
        this.slider_items = [
            { 
                header_html: "Персональное предложение",
                description_html: "Бесплатная доставка<br>в пределах МКАД<br>от 2500 рублей",
                link_text: "Подробнее",
                image: "img/slide1.png"
            },
            { 
                header_html: "Персональное предложение 2",
                description_html: "Бесплатная доставка<br>в пределах МКАД<br>от 25000 рублей",
                link_text: "Подробнее",
                image: "img/slide1.png"
            }
        ]
    }
}

(function() {    
    document.addEventListener('DOMContentLoaded', () => {
        var rootElement = document.createElement('div')
        rootElement.innerHTML = templates.index();

        ko.applyBindings(new SailplaySportDepot, rootElement)
        
        document.body.appendChild(rootElement)
    })
}())