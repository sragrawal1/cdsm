cdsmApp.directive('c', function () {
    return {
        template: 'rsr: {{volte.rsr}}<br /> scr: {{volte.scr}}',
        link: function ($scope, element, attrs) {
            element.bind('click', function () {
                element.html('You clicked me!');
            });
            element.bind('mouseenter', function () {
                element.css('background-color', 'yellow');
            });
            element.bind('mouseleave', function () {
                element.css('background-color', 'white');
            });

            element.append('sanjayTest');
        }
    };
});