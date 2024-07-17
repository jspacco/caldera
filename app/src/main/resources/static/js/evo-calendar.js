/*!
 * Evo Calendar - Simple and Modern-looking Event Calendar Plugin
 *
 * Licensed under the MIT License
 * 
 * Version: 1.1.3
 * Author: Edlyn Villegas
 * Docs: https://edlynvillegas.github.com/evo-calendar
 * Repo: https://github.com/edlynvillegas/evo-calendar
 * Issues: https://github.com/edlynvillegas/evo-calendar/issues
 * 
 */

;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var EvoCalendar = window.EvoCalendar || {};
    
    EvoCalendar = (function() {
        var instanceUid = 0;
        function EvoCalendar(element, settings) {
            var _ = this;
            _.defaults = {
                theme: null,
                format: 'mm/dd/yyyy',
                titleFormat: 'MM yyyy',
                eventHeaderFormat: 'MM d, yyyy',
                firstDayOfWeek: 0,
                language: 'en',
                todayHighlight: false,
                sidebarDisplayDefault: true,
                sidebarToggler: true,
                eventDisplayDefault: true,
                eventListToggler: true,
                calendarEvents: null
            };
            _.options = $.extend({}, _.defaults, settings);

            _.initials = {
                default_class: $(element)[0].classList.value,
                validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
                dates: {
                    en: {
                        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        noEventForToday: "No event for today.. so take a rest! :)",
                        noEventForThisDay: "No event for this day.. so take a rest! :)",
                        previousYearText: "Previous year",
                        nextYearText: "Next year",
                        closeSidebarText: "Close sidebar",
                        closeEventListText: "Close event list"
                    },
                    es: {
                        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                        daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                        noEventForToday: "No hay evento para hoy.. ¡así que descanse! :)",
                        noEventForThisDay: "Ningún evento para este día.. ¡así que descanse! :)",
                        previousYearText: "Año anterior",
                        nextYearText: "El próximo año",
                        closeSidebarText: "Cerrar la barra lateral",
                        closeEventListText: "Cerrar la lista de eventos"
                    },
                    de: {
                        days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                        daysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                        daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                        months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                        monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
                        noEventForToday: "Keine Veranstaltung für heute.. also ruhen Sie sich aus! :)",
                        noEventForThisDay: "Keine Veranstaltung für diesen Tag.. also ruhen Sie sich aus! :)",
                        previousYearText: "Vorheriges Jahr",
                        nextYearText: "Nächstes Jahr",
                        closeSidebarText: "Schließen Sie die Seitenleiste",
                        closeEventListText: "Schließen Sie die Ereignisliste"
                    },
                    pt: {
                        days: ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"],
                        daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
                        daysMin: ["Do", "2a", "3a", "4a", "5a", "6a", "Sa"],
                        months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                        monthsShort: ["Jan", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                        noEventForToday: "Nenhum evento para hoje.. então descanse! :)",
                        noEventForThisDay: "Nenhum evento para este dia.. então descanse! :)",
                        previousYearText: "Ano anterior",
                        nextYearText: "Próximo ano",
                        closeSidebarText: "Feche a barra lateral",
                        closeEventListText: "Feche a lista de eventos"
                    },
                    fr: {
                        days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
                        daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
                        daysMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
                        months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
                        monthsShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"],
                        noEventForToday: "Rien pour aujourd'hui... Belle journée :)",
                        noEventForThisDay: "Rien pour ce jour-ci... Profite de te réposer :)",
                        previousYearText: "Année précédente",
                        nextYearText: "L'année prochaine",
                        closeSidebarText: "Fermez la barre latérale",
                        closeEventListText: "Fermer la liste des événements"
                    },
                    nl: {
                        days: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"],
                        daysShort: ["Zon", "Maan", "Din", "Woe", "Don", "Vrij", "Zat"],
                        daysMin: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"],
                        months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
                        monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
                        noEventForToday: "Geen event voor vandaag.. dus rust even uit! :)",
                        noEventForThisDay: "Geen event voor deze dag.. dus rust even uit! :)",
                        previousYearText: "Vorig jaar",
                        nextYearText: "Volgend jaar",
                        closeSidebarText: "Sluit de zijbalk",
                        closeEventListText: "Sluit de event lijst"
                    },
                    id: {
                        days: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
                        daysShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
                        daysMin: ["Mi", "Sn", "Sl", "Ra", "Ka", "Ju", "Sa"],
                        months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                        monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
                        noEventForToday: "Tidak ada Acara untuk Sekarang.. Jadi Beristirahatlah! :)",
                        noEventForThisDay: "Tidak ada Acara untuk Hari Ini.. Jadi Beristirahatlah! :)",
                        previousYearText: "Tahun Sebelumnya",
                        nextYearText: "Tahun Berikutnya",
                        closeSidebarText: "Tutup Sidebar",
                        closeEventListText: "Tutup Daftar Acara"
                    }
                }
            }
            _.initials.weekends = {
                sun: _.initials.dates[_.options.language].daysShort[0],
                sat: _.initials.dates[_.options.language].daysShort[6]
            }


            // Format Calendar Events into selected format
            if(_.options.calendarEvents != null) {
                for(var i=0; i < _.options.calendarEvents.length; i++) {
                    // If event doesn't have an id, throw an error message
                    if(!_.options.calendarEvents[i].id) {
                        console.log("%c Event named: \""+_.options.calendarEvents[i].name+"\" doesn't have a unique ID ", "color:white;font-weight:bold;background-color:#e21d1d;");
                    }
                    if(_.isValidDate(_.options.calendarEvents[i].date)) {
                        const d = _.formatDate(_.options.calendarEvents[i].date, _.options.format);
                        _.options.calendarEvents[i].date = d;
                    }
                }
            }

            // Global variables
            _.startingDay = null;
            _.monthLength = null;
            _.windowW = $(window).width();
            
            // CURRENT
            _.$current = {
                month: (isNaN(this.month) || this.month == null) ? new Date().getMonth() : this.month,
                year: (isNaN(this.year) || this.year == null) ? new Date().getFullYear() : this.year,
                date: _.formatDate(_.initials.dates[_.defaults.language].months[new Date().getMonth()]+' '+new Date().getDate()+' '+ new Date().getFullYear(), _.options.format)
            }

            // ACTIVE
            _.$active = {
                month: _.$current.month,
                year: _.$current.year,
                date: _.$current.date,
                event_date: _.$current.date,
                events: []
            }

            // LABELS
            _.$label = {
                days: [],
                months: _.initials.dates[_.defaults.language].months,
                days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            }

            // HTML Markups (template)
            _.$markups = {
                calendarHTML: '',
                mainHTML: '',
                sidebarHTML: '',
                eventHTML: ''
            }
            // HTML DOM elements
            _.$elements = {
                calendarEl: $(element),
                innerEl: null,
                sidebarEl: null,
                eventEl: null,

                sidebarToggler: null,
                eventListToggler: null,

                activeDayEl: null,
                activeMonthEl: null,
                activeYearEl: null
            }
            _.$breakpoints = {
                tablet: 768,
                mobile: 425
            }
            _.$UI = {
                hasSidebar: true,
                hasEvent: true
            }

            _.formatDate = $.proxy(_.formatDate, _);
            _.selectDate = $.proxy(_.selectDate, _);
            _.selectMonth = $.proxy(_.selectMonth, _);
            _.selectYear = $.proxy(_.selectYear, _);
            _.selectEvent = $.proxy(_.selectEvent, _);
            _.toggleSidebar = $.proxy(_.toggleSidebar, _);
            _.toggleEventList = $.proxy(_.toggleEventList, _);
            
            _.instanceUid = instanceUid++;

            _.init(true);
        }

        return EvoCalendar;

    }());

    // v1.0.0 - Initialize plugin
    EvoCalendar.prototype.init = function(init) {
        var _ = this;
        
        if (!$(_.$elements.calendarEl).hasClass('calendar-initialized')) {
            $(_.$elements.calendarEl).addClass('evo-calendar calendar-initialized');
            if (_.windowW <= _.$breakpoints.tablet) { // tablet/mobile
                _.toggleSidebar(false);
                _.toggleEventList(false);
            } else {
                if (!_.options.sidebarDisplayDefault) _.toggleSidebar(false);
                else _.toggleSidebar(true);

                if (!_.options.eventDisplayDefault) _.toggleEventList(false);
                else _.toggleEventList(true);
            }
            if (_.options.theme) _.setTheme(_.options.theme); // set calendar theme
            _.buildTheBones(); // start building the calendar components
        
            //TODO: this doesn't seem to work
            populateSelectOptions();
    
            $('#digit1, #digit2, #digit3, #digit4').change(function() {
                updateYear();
            });
        }
    };
    // v1.0.0 - Destroy plugin
    EvoCalendar.prototype.destroy = function() {
        var _ = this;
        // code here
        _.destroyEventListener();
        if (_.$elements.calendarEl) {
            _.$elements.calendarEl.removeClass('calendar-initialized');
            _.$elements.calendarEl.removeClass('evo-calendar');
            _.$elements.calendarEl.removeClass('sidebar-hide');
            _.$elements.calendarEl.removeClass('event-hide');
        }
        _.$elements.calendarEl.empty();
        _.$elements.calendarEl.attr('class', _.initials.default_class);
        $(_.$elements.calendarEl).trigger("destroy", [_])
    }

    // v1.0.0 - Limit title (...)
    EvoCalendar.prototype.limitTitle = function(title, limit) {
        var newTitle = [];
        limit = limit === undefined ? 18 : limit;
        if ((title).split(' ').join('').length > limit) {
            var t = title.split(' ');
            for (var i=0; i<t.length; i++) {
                if (t[i].length + newTitle.join('').length <= limit) {
                    newTitle.push(t[i])
                }
            }
            return newTitle.join(' ') + '...'
        }
        return title;
    }

    // v1.1.2 - Check and filter strings
    EvoCalendar.prototype.stringCheck = function(d) {
        //console.log(typeof d);
        return d.replace(/[^\w]/g, '\\$&');
    }
            
    // v1.0.0 - Parse format (date)
    EvoCalendar.prototype.parseFormat = function(format) {
        var _ = this;
        if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
            return format;
        // IE treats \0 as a string end in inputs (truncating the value),
        // so it's a bad format delimiter, anyway
        var separators = format.replace(_.initials.validParts, '\0').split('\0'),
            parts = format.match(_.initials.validParts);
        if (!separators || !separators.length || !parts || parts.length === 0){
            console.log("%c Invalid date format ", "color:white;font-weight:bold;background-color:#e21d1d;");
        }
        return {separators: separators, parts: parts};
    };
    
    // v1.0.0 - Format date
    EvoCalendar.prototype.formatDate = function(date, format, language) {
        var _ = this;
        const origFormat = format;
        if (!date)
            return '';

        language = language ? language : _.defaults.language
        if (typeof format === 'string') {
            format = _.parseFormat(format);
        }
        if (format.toDisplay)
            return format.toDisplay(date, format, language);

        var ndate = new Date(date);
        // FIXME: Workaround because dates in yyyy-mm-dd format are parsed as being in UTC
        // but then converted to local timezone, so we go backwards a day. Ugh.
        if (typeof date == 'string' && date.match(/\d{4}-\d{2}-\d{2}/)) {
            // if the date is string and matches yyyy-mm-dd format, then create it like this
            // apparently this will handle the time zones correctly
            const [year, month, day] = date.split('-').map(Number);
            ndate = new Date(year, month - 1, day);
        }
        
        //console.log(date + ' ' + origFormat + ' ' + ' ' + format.separators + ' ' + format.parts + ' ' + ndate);
        
        // if (!_.isValidDate(ndate)) { // test
        //     ndate = new Date(date.replace(/-/g, '/'))
        // }
        
        var val = {
            d: ndate.getDate(),
            D: _.initials.dates[language].daysShort[ndate.getDay()],
            DD: _.initials.dates[language].days[ndate.getDay()],
            m: ndate.getMonth() + 1,
            M: _.initials.dates[language].monthsShort[ndate.getMonth()],
            MM: _.initials.dates[language].months[ndate.getMonth()],
            yy: ndate.getFullYear().toString().substring(2),
            yyyy: ndate.getFullYear()
        };
        
        val.dd = (val.d < 10 ? '0' : '') + val.d;
        val.mm = (val.m < 10 ? '0' : '') + val.m;
        date = [];
        var seps = $.extend([], format.separators);
        for (var i=0, cnt = format.parts.length; i <= cnt; i++){
            if (seps.length)
                date.push(seps.shift());
            date.push(val[format.parts[i]]);
        }
        return date.join('');
    };

    // v1.0.0 - Get dates between two dates
    EvoCalendar.prototype.getBetweenDates = function(dates) {
        var _ = this, betweenDates = [];
        for (var x = 0; x < _.monthLength; x++) {
            var active_date = _.formatDate(_.$label.months[_.$active.month] +' '+ (x + 1) +' '+ _.$active.year, _.options.format);
            if (_.isBetweenDates(active_date, dates)) {
                betweenDates.push(active_date);
            }
        }
        return betweenDates;
    };

    // v1.0.0 - Check if date is between the passed calendar date 
    EvoCalendar.prototype.isBetweenDates = function(active_date, dates) {
        var sd, ed;
        if (dates instanceof Array) {
            sd = new Date(dates[0]);
            ed = new Date(dates[1]);
        } else {
            sd = new Date(dates);
            ed = new Date(dates);
        }
        if (sd <= new Date(active_date) && ed >= new Date(active_date)) {
            return true;
        }
        return false;
    }
    
    // v1.0.0 - Check if event has the same event type in the same date
    EvoCalendar.prototype.hasSameDayEventType = function(date, type) {
        var _ = this, eventLength = 0;

        for (var i = 0; i < _.options.calendarEvents.length; i++) {
            if (_.options.calendarEvents[i].date instanceof Array) {
                var arr = _.getBetweenDates(_.options.calendarEvents[i].date);
                for (var x = 0; x < arr.length; x++) {
                    if(date === arr[x] && type === _.options.calendarEvents[i].type) {
                        eventLength++;
                    }
                }
            } else {
                if(date === _.options.calendarEvents[i].date && type === _.options.calendarEvents[i].type) {
                    eventLength++;
                }
            }
        }

        if (eventLength > 0) {
            return true;
        }
        return false;
    }
    
    // v1.0.0 - Set calendar theme
    EvoCalendar.prototype.setTheme = function(themeName) {
        var _ = this;
        var prevTheme = _.options.theme;
        _.options.theme = themeName.toLowerCase().split(' ').join('-');

        if (_.options.theme) $(_.$elements.calendarEl).removeClass(prevTheme);
        if (_.options.theme !== 'default') $(_.$elements.calendarEl).addClass(_.options.theme);
    }

    // v1.0.0 - Called in every resize
    EvoCalendar.prototype.resize = function() {
        var _ = this;
        _.windowW = $(window).width();

        if (_.windowW <= _.$breakpoints.tablet) { // tablet
            _.toggleSidebar(false);
            _.toggleEventList(false);

            if (_.windowW <= _.$breakpoints.mobile) { // mobile
                $(window)
                    .off('click.evocalendar.evo-' + _.instanceUid)
            } else {
                $(window)
                    .on('click.evocalendar.evo-' + _.instanceUid, $.proxy(_.toggleOutside, _));
            }
        } else {
            if (!_.options.sidebarDisplayDefault) _.toggleSidebar(false);
            else _.toggleSidebar(true);

            if (!_.options.eventDisplayDefault) _.toggleEventList(false);
            else _.toggleEventList(true);
            
            $(window)
                .off('click.evocalendar.evo-' + _.instanceUid);
        }
    }

    // v1.0.0 - Initialize event listeners
    EvoCalendar.prototype.initEventListener = function() {
        var _ = this;

        // resize
        $(window)
            .off('resize.evocalendar.evo-' + _.instanceUid)
            .on('resize.evocalendar.evo-' + _.instanceUid, $.proxy(_.resize, _));

        // IF sidebarToggler: set event listener: toggleSidebar
        if(_.options.sidebarToggler) {
            _.$elements.sidebarToggler
            .off('click.evocalendar')
            .on('click.evocalendar', _.toggleSidebar);
        }
        
        // IF eventListToggler: set event listener: toggleEventList
        if(_.options.eventListToggler) {
            _.$elements.eventListToggler
            .off('click.evocalendar')
            .on('click.evocalendar', _.toggleEventList);
        }

        // set event listener for each month
        _.$elements.sidebarEl.find('[data-month-val]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectMonth);

        // set event listener for year
        _.$elements.sidebarEl.find('[data-year-val]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectYear);

        // set event listener for every event listed
        _.$elements.eventEl.find('[data-event-index]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectEvent);
    };
    
    // v1.0.0 - Destroy event listeners
    EvoCalendar.prototype.destroyEventListener = function() {
        var _ = this;
        
        $(window).off('resize.evocalendar.evo-' + _.instanceUid);
        $(window).off('click.evocalendar.evo-' + _.instanceUid);
        
        // IF sidebarToggler: remove event listener: toggleSidebar
        if(_.options.sidebarToggler) {
            _.$elements.sidebarToggler
            .off('click.evocalendar');
        }
        
        // IF eventListToggler: remove event listener: toggleEventList
        if(_.options.eventListToggler) {
            _.$elements.eventListToggler
            .off('click.evocalendar');
        }

        // remove event listener for each day
        _.$elements.innerEl.find('.calendar-day').children()
        .off('click.evocalendar')

        // remove event listener for each month
        _.$elements.sidebarEl.find('[data-month-val]')
        .off('click.evocalendar');

        // remove event listener for year
        _.$elements.sidebarEl.find('[data-year-val]')
        .off('click.evocalendar');

        // remove event listener for every event listed
        _.$elements.eventEl.find('[data-event-index]')
        .off('click.evocalendar');
    };
    
    // v1.0.0 - Calculate days (incl. monthLength, startingDays based on :firstDayOfWeekName)
    EvoCalendar.prototype.calculateDays = function() {
        var _ = this, nameDays, weekStart, firstDay;
        _.monthLength = _.$label.days_in_month[_.$active.month]; // find number of days in month
        if (_.$active.month == 1) { // compensate for leap year - february only!
            if((_.$active.year % 4 == 0 && _.$active.year % 100 != 0) || _.$active.year % 400 == 0){
                _.monthLength = 29;
            }
        }
        nameDays = _.initials.dates[_.options.language].daysShort;
        weekStart = _.options.firstDayOfWeek;
        
        while (_.$label.days.length < nameDays.length) {
            if (weekStart == nameDays.length) {
                weekStart=0;
            }
            _.$label.days.push(nameDays[weekStart]);
            weekStart++;
        }
        firstDay = new Date(_.$active.year, _.$active.month).getDay() - weekStart;
        _.startingDay = firstDay < 0 ? (_.$label.days.length + firstDay) : firstDay;
    }

    // v1.0.0 - Build the bones! (incl. sidebar, inner, events), called once in every initialization
    EvoCalendar.prototype.buildTheBones = function() {
        var _ = this;
        _.calculateDays();
        
        if (!_.$elements.calendarEl.html()) {
            var markup;

            // --- BUILDING MARKUP BEGINS --- //
            // for selecting years digit by digit
            markup = `
        <div class="year-selector">
            <select id="digit1" onchange="updateYear()">
                <option value="">1st Digit</option>
                <!-- Generate options dynamically -->
            </select>
    
            <select id="digit2" onchange="updateYear()">
                <option value="">2nd Digit</option>
                <!-- Generate options dynamically -->
            </select>
    
            <select id="digit3" onchange="updateYear()">
                <option value="">3rd Digit</option>
                <!-- Generate options dynamically -->
            </select>
    
            <select id="digit4" onchange="updateYear()">
                <option value="">4th Digit</option>
                <!-- Generate options dynamically -->
            </select>
        </div>`;
    
            // sidebar
            markup += '<div class="calendar-sidebar">'+
                        '<div class="calendar-year">'+
                        '<button class="icon-button" role="button" data-year-val="prev" title="'+_.initials.dates[_.options.language].previousYearText+'">'+
                                '<span class="chevron-arrow-left"></span>'+
                            '</button>'+
                            '&nbsp;<p></p>&nbsp;'+
                            '<button class="icon-button" role="button" data-year-val="next" title="'+_.initials.dates[_.options.language].nextYearText+'">'+
                                '<span class="chevron-arrow-right"></span>'+
                            '</button>'+
                        '</div><div class="month-list">'+
                        '<ul class="calendar-months">';
                            for(var i = 0; i < _.$label.months.length; i++) {
                                markup += '<li class="month" role="button" data-month-val="'+i+'">'+_.initials.dates[_.options.language].months[i]+'</li>';
                            }
                        markup += '</ul>';
            markup += '</div></div>';
        
            // inner
            markup += '<div class="calendar-inner">'+
                            '<table class="calendar-table">'+
                                '<tr><th colspan="7"></th></tr>'+
                                '<tr class="calendar-header">';
                                for(var i = 0; i < _.$label.days.length; i++ ){
                                    var headerClass = "calendar-header-day";
                                    if (_.$label.days[i] === _.initials.weekends.sat || _.$label.days[i] === _.initials.weekends.sun) {
                                        headerClass += ' --weekend';
                                    }
                                    markup += '<td class="'+headerClass+'">'+_.$label.days[i]+'</td>';
                                }
                                markup += '</tr></table>'+
                        '</div>';

            // events
            markup += '<div class="calendar-events">'+
                            '<div class="event-header"><p></p></div>'+
                            '<div class="event-list"></div>'+
                        '</div>';

            // --- Finally, build it now! --- //
            _.$elements.calendarEl.html(markup);

            if (!_.$elements.sidebarEl) _.$elements.sidebarEl = $(_.$elements.calendarEl).find('.calendar-sidebar');
            if (!_.$elements.innerEl) _.$elements.innerEl = $(_.$elements.calendarEl).find('.calendar-inner');
            if (!_.$elements.eventEl) _.$elements.eventEl = $(_.$elements.calendarEl).find('.calendar-events');

            // if: _.options.sidebarToggler
            if(_.options.sidebarToggler) {
                $(_.$elements.sidebarEl).append('<span id="sidebarToggler" role="button" aria-pressed title="'+_.initials.dates[_.options.language].closeSidebarText+'"><button class="icon-button"><span class="bars"></span></button></span>');
                if(!_.$elements.sidebarToggler) _.$elements.sidebarToggler = $(_.$elements.sidebarEl).find('span#sidebarToggler');
            }
            if(_.options.eventListToggler) {
                $(_.$elements.calendarEl).append('<span id="eventListToggler" role="button" aria-pressed title="'+_.initials.dates[_.options.language].closeEventListText+'"><button class="icon-button"><span class="chevron-arrow-right"></span></button></span>');
                if(!_.$elements.eventListToggler) _.$elements.eventListToggler = $(_.$elements.calendarEl).find('span#eventListToggler');
            }
        }

        _.buildSidebarYear();
        _.buildSidebarMonths();
        _.buildCalendar();
        _.buildEventList();
        _.initEventListener(); // test

        _.resize();
    }

    // v1.0.0 - Build Event: Event list
    EvoCalendar.prototype.buildEventList = function() {
        var _ = this, markup, hasEventToday = false;
        
        _.$active.events = [];
        // Event date
        var title = _.formatDate(_.$active.date, _.options.eventHeaderFormat, _.options.language);
        _.$elements.eventEl.find('.event-header > p').text(title);
        // Event list
        var eventListEl = _.$elements.eventEl.find('.event-list');
        // Clear event list item(s)
        if (eventListEl.children().length > 0) eventListEl.empty();
        if (_.options.calendarEvents) {
            for (var i = 0; i < _.options.calendarEvents.length; i++) {
                if(_.isBetweenDates(_.$active.date, _.options.calendarEvents[i].date)) {
                    //console.log(_.options.calendarEvents[i]);
                    eventAdder(_.options.calendarEvents[i])
                }
                else if (_.options.calendarEvents[i].everyYear) {
                    var d = new Date(_.$active.date).getMonth() + 1 + ' ' + new Date(_.$active.date).getDate();
                    var dd = new Date(_.options.calendarEvents[i].date).getMonth() + 1 + ' ' + new Date(_.options.calendarEvents[i].date).getDate();
                    // var dates = [_.formatDate(_.options.calendarEvents[i].date[0], 'mm/dd'), _.formatDate(_.options.calendarEvents[i].date[1], 'mm/dd')];

                    if(d==dd) {
                        eventAdder(_.options.calendarEvents[i])
                    }
                }
            };
        }
        function eventAdder(event) {
            hasEventToday = true;
            _.addEventList(event)
        }
        // IF: no event for the selected date
        if(!hasEventToday) {
            markup = '<div class="event-empty">';
            if (_.$active.date === _.$current.date) {
                markup += '<p>'+_.initials.dates[_.options.language].noEventForToday+'</p>';
            } else {
                markup += '<p>'+_.initials.dates[_.options.language].noEventForThisDay+'</p>';
            }
            markup += '</div>';
        }
        eventListEl.append(markup)
    }

    // v1.0.0 - Add single event to event list
    EvoCalendar.prototype.addEventList = function(event_data) {
        var _ = this, markup;
        var eventListEl = _.$elements.eventEl.find('.event-list');
        if (eventListEl.find('[data-event-index]').length === 0) eventListEl.empty();
        _.$active.events.push(event_data);
        
        // precompute the color, badge, description, location
        var color = event_data.color ? `style="background-color:{$event_data.color}"` : '';
        var badge = `<span>${event_data.type}</span>`;
        var year = new Date(event_data.date).getFullYear();
        var description = event_data.description ? `<p class="event-desc">${event_data.description}</p>` : '';
        
        
        // base64 encoding the image
        // linking to the flaticon site to credit the creator of the icon
        var map_pin = `<a href="https://www.flaticon.com/free-icons/maps-and-location" 
            title="Maps and location icons created by pojok d - Flaticon"
            target="_blank">
<img src="data:image/png;base64,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" 
            width="16px" alt="Maps and location icons created by pojok d - Flaticon"/>
            </a>`;
            
        var location = event_data.location ? `<p class="event-loc">${map_pin} &nbsp;&nbsp; ${event_data.location}</p>` : '';

        var tags = '';
        if (event_data.tags) {
            tags += "<p class='event-tags'>";
            tags += event_data.tags.map((tag) => `#${tag}`).join(' ');
            tags += "</p>";
        }

        markup = `
        <div class="event-container" role="button" data-event-index="${event_data.id}">
            <div class="event-icon">
                <div class="event-bullet-${event_data.type}" ${color}>
                </div>
            </div>
            <div class="event-info">
                <p class="event-title">${event_data.name}
                ${badge}
                </p>
                <p class="event-year">${year}</p>
                ${description}
                ${location}
                <p class="event-username">${event_data.username}</p>
                ${tags}
            </div>
        </div>
        `;

        eventListEl.append(markup);

        _.$elements.eventEl.find('[data-event-index="'+(event_data.id)+'"]')
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectEvent);
    }
    // v1.0.0 - Remove single event to event list
    EvoCalendar.prototype.removeEventList = function(event_data) {
        var _ = this, markup;
        var eventListEl = _.$elements.eventEl.find('.event-list');
        if (eventListEl.find('[data-event-index="'+event_data+'"]').length === 0) return; // event not in active events
        eventListEl.find('[data-event-index="'+event_data+'"]').remove();
        if (eventListEl.find('[data-event-index]').length === 0) {
            eventListEl.empty();
            if (_.$active.date === _.$current.date) {
                markup += '<p>'+_.initials.dates[_.options.language].noEventForToday+'</p>';
            } else {
                markup += '<p>'+_.initials.dates[_.options.language].noEventForThisDay+'</p>';
            }
            eventListEl.append(markup)
        }
    }
    
    // v1.0.0 - Build Sidebar: Year text
    EvoCalendar.prototype.buildSidebarYear = function() {
        var _ = this;
        
        _.$elements.sidebarEl.find('.calendar-year > p').text(_.$active.year);
    }

    // v1.0.0 - Build Sidebar: Months list text
    EvoCalendar.prototype.buildSidebarMonths = function() {
        var _ = this;
        
        _.$elements.sidebarEl.find('.calendar-months > [data-month-val]').removeClass('active-month');
        _.$elements.sidebarEl.find('.calendar-months > [data-month-val="'+_.$active.month+'"]').addClass('active-month');
    }

    // v1.0.0 - Build Calendar: Title, Days
    EvoCalendar.prototype.buildCalendar = function() {
        var _ = this, markup, title;
        
        _.calculateDays();

        title = _.formatDate(new Date(_.$label.months[_.$active.month] +' 1 '+ _.$active.year), _.options.titleFormat, _.options.language);
        _.$elements.innerEl.find('.calendar-table th').text(title);

        _.$elements.innerEl.find('.calendar-body').remove(); // Clear days
        
        markup += '<tr class="calendar-body">';
                    var day = 1;
                    for (var i = 0; i < 9; i++) { // this loop is for is weeks (rows)
                        for (var j = 0; j < _.$label.days.length; j++) { // this loop is for weekdays (cells)
                            if (day <= _.monthLength && (i > 0 || j >= _.startingDay)) {
                                var dayClass = "calendar-day";
                                if (_.$label.days[j] === _.initials.weekends.sat || _.$label.days[j] === _.initials.weekends.sun) {
                                    dayClass += ' --weekend'; // add '--weekend' to sat sun
                                }
                                markup += '<td class="'+dayClass+'">';

                                var thisDay = _.formatDate(_.$label.months[_.$active.month]+' '+day+' '+_.$active.year, _.options.format);
                                markup += '<div class="day" role="button" data-date-val="'+thisDay+'">'+day+'</div>';
                                day++;
                            } else {
                                markup += '<td>';
                            }
                            markup += '</td>';
                        }
                        if (day > _.monthLength) {
                            break; // stop making rows if we've run out of days
                        } else {
                            markup += '</tr><tr class="calendar-body">'; // add if not
                        }
                    }
                    markup += '</tr>';
        _.$elements.innerEl.find('.calendar-table').append(markup);

        if(_.options.todayHighlight) {
            _.$elements.innerEl.find("[data-date-val='" + _.$current.date + "']").addClass('calendar-today');
        }
        
        // set event listener for each day
        _.$elements.innerEl.find('.calendar-day').children()
        .off('click.evocalendar')
        .on('click.evocalendar', _.selectDate)

        var selectedDate = _.$elements.innerEl.find("[data-date-val='" + _.$active.date + "']");
        
        if (selectedDate) {
            // Remove active class to all
            _.$elements.innerEl.children().removeClass('calendar-active');
            // Add active class to selected date
            selectedDate.addClass('calendar-active');
        }
        if(_.options.calendarEvents != null) { // For event indicator (dots)
            _.buildEventIndicator();
        }
    };

    // v1.0.0 - Add event indicator/s (dots)
    EvoCalendar.prototype.addEventIndicator = function(event) {
        var _ = this, htmlToAppend, thisDate;
        var event_date = event.date;
        //console.log(event);
        var type = _.stringCheck(event.type);
        
        if (event_date instanceof Array) {
            if (event.everyYear) {
                for (var x=0; x<event_date.length; x++) {
                    event_date[x] = _.formatDate(new Date(event_date[x]).setFullYear(_.$active.year), _.options.format);
                }
            }
            var active_date = _.getBetweenDates(event_date);
            
            for (var i=0; i<active_date.length; i++) {
                appendDot(active_date[i]);
            }
        } else {
            if (event.everyYear) {
                event_date = _.formatDate(new Date(event_date).setFullYear(_.$active.year), _.options.format);
            }
            appendDot(event_date);
        }

        function appendDot(date) {
            //TODO: fix this method
            thisDate = _.$elements.innerEl.find('[data-date-val="'+date+'"]');

            if (thisDate.find('span.event-indicator').length === 0) {
                thisDate.append('<span class="event-indicator"></span>');
            }
            
            if (thisDate.find('span.event-indicator > .type-bullet > .type-'+type).length === 0) {
                htmlToAppend = '<div class="type-bullet"><div ';
                
                htmlToAppend += 'class="type-'+event.type+'"'
                if (event.color) { htmlToAppend += 'style="background-color:'+event.color+'"' }
                htmlToAppend += '></div></div>';
                thisDate.find('.event-indicator').append(htmlToAppend);
            }
        }      
    };
    
    // v1.0.0 - Remove event indicator/s (dots)
    EvoCalendar.prototype.removeEventIndicator = function(event) {
        var _ = this;
        var event_date = event.date;
        var type = _.stringCheck(event.type);

        if (event_date instanceof Array) {
            var active_date = _.getBetweenDates(event_date);
            
            for (var i=0; i<active_date.length; i++) {
                removeDot(active_date[i]);
            }
        } else {
            removeDot(event_date);
        }

        function removeDot(date) {
            // Check if no '.event-indicator', 'cause nothing to remove
            if (_.$elements.innerEl.find('[data-date-val="'+date+'"] span.event-indicator').length === 0) {
                return;
            }

            // // If has no type of event, then delete 
            if (!_.hasSameDayEventType(date, type)) {
                _.$elements.innerEl.find('[data-date-val="'+date+'"] span.event-indicator > .type-bullet > .type-'+type).parent().remove();
            }
        }
    };
    
    /****************
    *    METHODS    *
    ****************/

    // v1.0.0 - Build event indicator on each date
    EvoCalendar.prototype.buildEventIndicator = function() {
        var _ = this;
        
        // prevent duplication
        _.$elements.innerEl.find('.calendar-day > day > .event-indicator').empty();
        
        for (var i = 0; i < _.options.calendarEvents.length; i++) {
            _.addEventIndicator(_.options.calendarEvents[i]);
        }
    };

    // v1.0.0 - Select event
    EvoCalendar.prototype.selectEvent = function(event) {
        var _ = this;
        var el = $(event.target).closest('.event-container');
        var id = $(el).data('eventIndex').toString();
        var index = _.options.calendarEvents.map(function (event) { return (event.id).toString() }).indexOf(id);
        var modified_event = _.options.calendarEvents[index];
        if (modified_event.date instanceof Array) {
            modified_event.dates_range = _.getBetweenDates(modified_event.date);
        }
        $(_.$elements.calendarEl).trigger("selectEvent", [_.options.calendarEvents[index]])
    }

    // v1.0.0 - Select year
    EvoCalendar.prototype.selectYear = function(event) {
        var _ = this;
        var el, yearVal;

        if (typeof event === 'string' || typeof event === 'number') {
            if ((parseInt(event)).toString().length === 4) {
                yearVal = parseInt(event);
            }
        } else {
            el = $(event.target).closest('[data-year-val]');
            yearVal = $(el).data('yearVal');
        }

        if(yearVal == "prev") {
            --_.$active.year;
        } else if (yearVal == "next") {
            ++_.$active.year;
        } else if (typeof yearVal === 'number') {
            _.$active.year = yearVal;
        }
        
        if (_.windowW <= _.$breakpoints.mobile) {
            if(_.$UI.hasSidebar) _.toggleSidebar(false);
        }
        
        $(_.$elements.calendarEl).trigger("selectYear", [_.$active.year])

        _.buildSidebarYear();
        _.buildCalendar();
    };

    // v1.0.0 - Select month
    EvoCalendar.prototype.selectMonth = function(event) {
        var _ = this;
        
        if (typeof event === 'string' || typeof event === 'number') {
            if (event >= 0 && event <=_.$label.months.length) {
                // if: 0-11
                _.$active.month = (event).toString();
            }
        } else {
            // if month is manually selected
            _.$active.month = $(event.currentTarget).data('monthVal');
        }
        
        _.buildSidebarMonths();
        _.buildCalendar();
        
        if (_.windowW <= _.$breakpoints.tablet) {
            if(_.$UI.hasSidebar) _.toggleSidebar(false);
        }

        // EVENT FIRED: selectMonth
        $(_.$elements.calendarEl).trigger("selectMonth", [_.initials.dates[_.options.language].months[_.$active.month], _.$active.month])
    };

    // v1.0.0 - Select specific date
    EvoCalendar.prototype.selectDate = function(event) {
        var _ = this;
        var oldDate = _.$active.date;
        var date, year, month, activeDayEl, isSameDate;

        if (typeof event === 'string' || typeof event === 'number' || event instanceof Date) {
            date = _.formatDate(new Date(event), _.options.format)
            year = new Date(date).getFullYear();
            month = new Date(date).getMonth();
            
            if (_.$active.year !== year) _.selectYear(year);
            if (_.$active.month !== month) _.selectMonth(month);
            activeDayEl = _.$elements.innerEl.find("[data-date-val='" + date + "']");
        } else {
            activeDayEl = $(event.currentTarget);
            date = activeDayEl.data('dateVal')
        }
        isSameDate = _.$active.date === date;
        // Set new active date
        _.$active.date = date;
        _.$active.event_date = date;
        // Remove active class to all
        _.$elements.innerEl.find('[data-date-val]').removeClass('calendar-active');
        // Add active class to selected date
        activeDayEl.addClass('calendar-active');
        // Build event list if not the same date events built
        if (!isSameDate) _.buildEventList();

        // EVENT FIRED: selectDate
        $(_.$elements.calendarEl).trigger("selectDate", [_.$active.date, oldDate])
    };
    
    // v1.0.0 - Return active date
    EvoCalendar.prototype.getActiveDate = function() {
        var _ = this;
        return _.$active.date;
    }
    
    // v1.0.0 - Return active events
    EvoCalendar.prototype.getActiveEvents = function() {
        var _ = this;
        return _.$active.events;
    }

    // v1.0.0 - Hide Sidebar/Event List if clicked outside
    EvoCalendar.prototype.toggleOutside = function(event) {
        var _ = this, isInnerClicked;
        
        isInnerClicked = event.target === _.$elements.innerEl[0];

        if (_.$UI.hasSidebar && isInnerClicked) _.toggleSidebar(false);
        if (_.$UI.hasEvent && isInnerClicked) _.toggleEventList(false);
    }

    // v1.0.0 - Toggle Sidebar
    EvoCalendar.prototype.toggleSidebar = function(event) {
        var _ = this;

        if (event === undefined || event.originalEvent) {
            $(_.$elements.calendarEl).toggleClass('sidebar-hide');
            _.$UI.hasSidebar = !_.$UI.hasSidebar;
        } else {
            if(event) {
                $(_.$elements.calendarEl).removeClass('sidebar-hide');
                _.$UI.hasSidebar = true;
            } else {
                $(_.$elements.calendarEl).addClass('sidebar-hide');
                _.$UI.hasSidebar = false;
            }
        }

        if (_.windowW <= _.$breakpoints.tablet) {
            if (_.$UI.hasSidebar && _.$UI.hasEvent) _.toggleEventList();
        }
    };

    // v1.0.0 - Toggle Event list
    EvoCalendar.prototype.toggleEventList = function(event) {
        var _ = this;

        if (event === undefined || event.originalEvent) {
            $(_.$elements.calendarEl).toggleClass('event-hide');
            _.$UI.hasEvent = !_.$UI.hasEvent;
        } else {
            if(event) {
                $(_.$elements.calendarEl).removeClass('event-hide');
                _.$UI.hasEvent = true;
            } else {
                $(_.$elements.calendarEl).addClass('event-hide');
                _.$UI.hasEvent = false;
            }
        }

        if (_.windowW <= _.$breakpoints.tablet) {
            if (_.$UI.hasEvent && _.$UI.hasSidebar) _.toggleSidebar();
        }
    };

    // v1.0.0 - Add Calendar Event(s)
    EvoCalendar.prototype.addCalendarEvent = function(arr) {
        var _ = this;

        function addEvent(data) {
            if(!data.id) {
                console.log("%c Event named: \""+data.name+"\" doesn't have a unique ID ", "color:white;font-weight:bold;background-color:#e21d1d;");
            }

            if (data.date instanceof Array) {
                for (var j=0; j < data.date.length; j++) {
                    if(isDateValid(data.date[j])) {
                        data.date[j] = _.formatDate(new Date(data.date[j]), _.options.format);
                    }
                }
            } else {
                if(isDateValid(data.date)) {
                    data.date = _.formatDate(new Date(data.date), _.options.format);
                }
            }
            
            if (!_.options.calendarEvents) _.options.calendarEvents = [];
            _.options.calendarEvents.push(data);
            // add to date's indicator
            _.addEventIndicator(data);
            // add to event list IF active.event_date === data.date
            if (_.$active.event_date === data.date) _.addEventList(data);
            // _.$elements.innerEl.find("[data-date-val='" + data.date + "']")

            function isDateValid(date) {
                if(_.isValidDate(date)) {
                    return true;
                } else {
                    console.log("%c Event named: \""+data.name+"\" has invalid date ", "color:white;font-weight:bold;background-color:#e21d1d;");
                }
                return false;
            }
        }
        if (arr instanceof Array) { // Arrays of events
            for(var i=0; i < arr.length; i++) {
                addEvent(arr[i])
            }
        } else if (typeof arr === 'object') { // Single event
            addEvent(arr)
        }
    };

    // v1.0.0 - Remove Calendar Event(s)
    EvoCalendar.prototype.removeCalendarEvent = function(arr) {
        var _ = this;

        function deleteEvent(data) {
            // Array index
            var index = _.options.calendarEvents.map(function (event) { return event.id }).indexOf(data);
            
            if (index >= 0) {
                var event = _.options.calendarEvents[index];
                // Remove event from calendar events
                _.options.calendarEvents.splice(index, 1);
                // remove to event list
                _.removeEventList(data);
                // remove event indicator
                _.removeEventIndicator(event);
            } else {
                console.log("%c "+data+": ID not found ", "color:white;font-weight:bold;background-color:#e21d1d;");
            }
        }
        if (arr instanceof Array) { // Arrays of index
            for(var i=0; i < arr.length; i++) {
                deleteEvent(arr[i])
            }
        } else { // Single index
            deleteEvent(arr)
        }
    };

    // v1.0.0 - Check if date is valid
    EvoCalendar.prototype.isValidDate = function(d){
        return new Date(d) && !isNaN(new Date(d).getTime());
    }

    $.fn.evoCalendar = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].evoCalendar = new EvoCalendar(_[i], opt);
            else
                ret = _[i].evoCalendar[opt].apply(_[i].evoCalendar, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));

// jspacco adding these functions
function populateSelectOptions() {
    const digit1Select = $('#digit1');
    const digit2Select = $('#digit2');
    const digit3Select = $('#digit3');
    const digit4Select = $('#digit4');

    // digit 1 can only be 0, 1, 2 (no dates in the 3000s yet)
    for (let i = 0; i <= 2; i++) {
        digit1Select.append($('<option>', { value: i, text: i }));
    }
    // Populate options for each other digit with values 0-9
    for (let i = 0; i <= 9; i++) {
        digit2Select.append($('<option>', { value: i, text: i }));
        digit3Select.append($('<option>', { value: i, text: i }));
        digit4Select.append($('<option>', { value: i, text: i }));
    }
    setYearSelector(2024);
}

function setYearSelector(year) {
    const yearString = year.toString();
    $('#digit1').val(yearString[0]);
    $('#digit2').val(yearString[1]);
    $('#digit3').val(yearString[2]);
    $('#digit4').val(yearString[3]);
}

function updateYear() {
    const digit1 = $('#digit1').val();
    const digit2 = $('#digit2').val();
    const digit3 = $('#digit3').val();
    const digit4 = $('#digit4').val();

    if (digit1 && digit2 && digit3 && digit4) {
        const year = `${digit1}${digit2}${digit3}${digit4}`;
        //$('#selected-year').text(`Selected Year: ${year}`);

        if (year[0] == '0') {
            y = parseInt(year);
            console.log(y);
            $('#calendar').evoCalendar('selectYear', parseInt(year));
        } else {
            $('#calendar').evoCalendar('selectYear', year);
        }

    } else {
        $('#selected-year').text('Please select all year components.');
    }
}