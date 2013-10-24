/*
$('.cp-full').colorpicker({
});
*/

ko.bindingHandlers.colorPicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        //initialize datepicker with some optional options
        var options = allBindingsAccessor().colorPickerOptions || {};
        var observable = valueAccessor();

        $(element).colorpicker({
            showOn: 'button',
            buttonColorize: true,
            alpha: false,
            colorFormat: '#HEX',
            buttonImage: 'bower_components/jquery.colorpicker/images/ui-colorpicker.png',
            select: function(e, color) {
                observable(color.formatted)
            }
        });

        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            observable($(element).val());
        });

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).colorpicker("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).colorpicker("setColor", value);
    }
};
