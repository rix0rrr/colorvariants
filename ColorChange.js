function ColorChange() {
    var self = this;

    self.hue_delta = ko.observable(0);
    self.sat_delta = ko.observable(0);
    self.val_delta = ko.observable(0);

    self.apply = function(color) {
        return jQuery.Color({
            hue:        color.hue() +        (parseFloat(self.hue_delta()) || 0),
            saturation: color.saturation() + (parseFloat(self.sat_delta()) || 0) / 100,
            lightness:  color.lightness() +  (parseFloat(self.val_delta()) || 0) / 100
        });
    }

    self.toJSON = function() {
        return {
            h: self.hue_delta(),
            s: self.sat_delta(),
            v: self.val_delta()
        }
    }
}
ColorChange.fromJSON = function(js) {
    var c = new ColorChange();
    c.hue_delta(js.h);
    c.sat_delta(js.s);
    c.val_delta(js.v);
    return c;
}
