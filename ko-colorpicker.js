/*
$('.cp-full').colorpicker({
});
*/

ko.bindingHandlers.colorPicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        //initialize datepicker with some optional options
        var observable = valueAccessor();

        $(element).minicolors({
            theme: 'bootstrap',
            hide: allBindingsAccessor().onHide,
            show: allBindingsAccessor().onShow,
            change: function(hex) {
                observable(hex)
            }
        });

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).minicolors("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).minicolors("value", value);
    }
};
