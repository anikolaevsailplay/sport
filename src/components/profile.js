import ko from 'knockout';
import sailplay from 'sailplay-hub';

// http://stackoverflow.com/questions/1187518/javascript-array-difference
function arr_diff (a1, a2) {
    var a = [], diff = [];
    for (var i = 0; i < a1.length; i++) a[a1[i]] = true;

    for (var i = 0; i < a2.length; i++)
        if (a[a2[i]]) delete a[a2[i]]; 
        else a[a2[i]] = true;

    for (var k in a) diff.push(k);

    return diff;
};

export default function(messager) {
    return function(params) {
        this.data = ko.observable();
        this.games_tags = ['Хоккей', 'Футбол', 'Фигурное катание', 'Легкая атлетика', 'Беговые лыжи', 'Единоборства'];
        this.for_who_tags = ['Покупаю: Себе', 'Покупаю: Ребенку', 'Покупаю: В подарок'];
        this.training_tags = [
            'Тренировка: 1 раз в неделю или реже', 
            'Тренировка: 2-3 раза в неделю', 
            'Тренировка: 4-5 раз в неделю', 
            'Тренировка: 6 и более раз в неделю'
        ]

        this.registration = ['Регистрация завершена'];
        this.is_register = ko.observable(false);
        this.vars = ['city', 'address', 'child_birthdate', 'game_other'];

        this.update = config => {
            if (!config) config = this.config;
            sailplay.jsonp.get(config.DOMAIN + config.urls.users.info, {
                auth_hash: config.auth_hash, 
                all: 1,
            }, result => {
                let value = ko.mapping.fromJS(result);
                ['first_name', 'last_name', 'middle_name'].map(el => {
                    value.user[el].extend({ required: true, minLength: 3 })
                })               

                if (value.user.birth_date()) {
                    let birth_date = value.user.birth_date();
                    value.user.birth_day = ko.observable(birth_date.split('-')[2]).extend({required: true, min: 1, max: 31, pattern: { message: "wrong", params: '^[0-9]{1,2}$' }});
                    value.user.birth_month = ko.observable(birth_date.split('-')[1]).extend({required: true, min: 1, max: 12, pattern: { message: "wrong", params: '^[0-9]{1,2}$' }});
                    value.user.birth_year = ko.observable(birth_date.split('-')[0]).extend({required: true, min: 1863, pattern: { message: "wrong", params: '^[0-9]{4}$' }});              
                }

                this.data(value);
                sailplay.jsonp.get(config.DOMAIN + config.urls.users.custom_variables.batch_get, {
                    names: JSON.stringify(this.vars),
                    auth_hash: config.auth_hash
                }, result => {
                    if (result.vars.length) {
                        ko.utils.arrayForEach(result.vars, item => {
                            if (item.name == 'child_birthdate') {
                                this.data().user['child_bday'](item.value.split('-')[2]);
                                this.data().user['child_bmonth'](item.value.split('-')[1]);
                                this.data().user['child_byear'](item.value.split('-')[0]);
                            } else if (this.data().user[item.name]) this.data().user[item.name](item.value)
                        })
                    }
                })

                let tags = [].concat(this.training_tags, this.games_tags, this.for_who_tags, this.registration),
                    tags_to_process = [];

                while (tags.length) {
                    tags_to_process.push(tags.pop());
                    if (tags_to_process.length == 10 || !tags.length) {
                        sailplay.jsonp.get(config.DOMAIN + config.urls.tags.exist, {
                            auth_hash: config.auth_hash,                            
                            tags: JSON.stringify(tags_to_process)
                        }, result => {
                            this.registration.forEach(item => {
                                let found = result.tags.find(t => t.exist && t.name == item)
                                if (found) this.is_register(true);
                            })                            
                            this.training_tags.forEach(item => {
                                let found = result.tags.find(t => t.exist && t.name == item)
                                if (found) this.data().user['training'](item)
                            })
                            this.for_who_tags.forEach(item => {
                                let found = result.tags.find(t => t.exist && t.name == item)
                                if (found) this.data().user['for_who'](item)
                            })         
                            this.games_tags.forEach(item => {
                                let found = result.tags.find(t => t.exist && t.name == item)
                                if (found) {
                                    if (this.data().user['active_games']) this.data().user['active_games'].push(item)
                                    else this.data().user['active_games'] = [item]
                                }
                            })                                      
                        })

                        tags_to_process = [];
                    }
                }      
            })       
        }

        messager.subscribe('init', config => {
            this.config = config;
            this.update(config)
        })

        messager.subscribe('profile_update', this.update)

        this.popupVm = {
            opened: ko.observable(false),
            step: ko.observable(1),
            games: this.games_tags,
            is_register: ko.observable(false),
            active_games: ko.observableArray([]),
            getField: (field, arr) => {
                if (!this.data()) return '';
                if (!this.data().user[field]) {
                    if (arr) this.data().user[field] = ko.observableArray([])
                    else this.data().user[field] = ko.observable()
                }

                // custom_vars validation
                if (field == 'child_bday') this.data().user[field].extend({min: 1, max: 31, pattern: { message: "wrong", params: '^[0-9]{1,2}$' }})
                if (field == 'child_bmonth') this.data().user[field].extend({min: 1, max: 12, pattern: { message: "wrong", params: '^[0-9]{1,2}$' }})
                if (field == 'child_byear') this.data().user[field].extend({min: 1863, pattern: { message: "wrong", params: '^[0-9]{4}$' }})
                if (field == 'city') this.data().user[field].extend({required: true})
                if (field == 'address') this.data().user[field].extend({required: true})                

                return this.data().user[field]
            },
            width: ko.observable('356px'),
            openProfile: () => {
                document.body.className += ' no_scrol';
                this.popupVm.step(1);
                this.popupVm.width('356px')
                if (this.data().user['active_games'] && this.data().user['active_games'].length)
                    this.popupVm.active_games(this.data().user['active_games']);

                if (this.is_register()) {
                    this.popupVm.is_register(true);
                    this.popupVm.step(2);
                    this.popupVm.width('650px');                 
                }
                this.popupVm.opened(true)                    
            },

            next: () => {
                if (this.popupVm.step() == 1) {
                    if (!this.data().user.first_name.isValid()) return;
                    if (!this.data().user.last_name.isValid()) return;
                    if (!this.data().user.middle_name.isValid()) return;
                    if (!this.data().user.birth_day.isValid()) return;
                    if (!this.data().user.birth_month.isValid()) return;
                    if (!this.data().user.birth_year.isValid()) return;
                }

                if (this.popupVm.step() == 2) {
                    if (!this.data().user.child_bday.isValid()) return;
                    if (!this.data().user.child_bmonth.isValid()) return;
                    if (!this.data().user.child_byear.isValid()) return;                   
                }
                
                this.popupVm.step(this.popupVm.step() + 1);
                if (this.popupVm.step() == 2) this.popupVm.width('650px')
                else this.popupVm.width('356px')
            },

            finish: () => {
                let obj = { auth_hash: this.config.auth_hash };

                let user = ko.toJS(this.data().user),
                    primary = {...obj},
                    secondary = {...obj};

                primary = {
                    ...primary, 
                    firstName: user.first_name,
                    lastName: user.last_name,
                    middleName: user.middle_name
                }

                if (user.birth_day && user.birth_month && user.birth_year)
                    primary['birthDate'] = `${user.birth_year}-${user.birth_month}-${user.birth_day}`

                if (user.child_bday && user.child_bmonth && user.child_byear)
                    secondary['child_birthdate'] = `${user.child_byear}-${user.child_bmonth}-${user.child_bday}`

                let current_tags = [].concat(user.for_who, user.training, this.popupVm.active_games(), this.registration);
                let all_tags = [].concat(this.training_tags, this.games_tags, this.for_who_tags);
                let diff_tags = arr_diff(current_tags, all_tags);

                let thirty = {...obj, lang: 'ru', tags: current_tags.join(',') || []};
                let tags_to_process = [];
                while (diff_tags.length) {
                    tags_to_process.push(diff_tags.pop());
                    if (tags_to_process.length == 10 || !diff_tags.length) {
                        sailplay.jsonp.get(this.config.DOMAIN + this.config.urls.tags.delete, {
                            auth_hash: this.config.auth_hash,
                            lang: 'ru',
                            tags: tags_to_process.join(',') || []
                        })

                        tags_to_process = [];
                    }
                }      

                this.vars.forEach(item => {
                    if (user[item]) secondary[item] = user[item]
                })

                sailplay.jsonp.get(this.config.DOMAIN + '/js-api/' + this.config.partner.id + '/users/update/', primary);
                sailplay.jsonp.get(this.config.DOMAIN + this.config.urls.users.custom_variables.add, secondary)
                sailplay.jsonp.get(this.config.DOMAIN + this.config.urls.tags.add, thirty)

                this.is_register(true);
                this.popupVm.opened(false);
                document.body.className = document.body.className.replace(' no_scrol', ''); 
            }
        }
    };
}