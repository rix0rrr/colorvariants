function ColorChange() {
    var self = this;

    self.hue_delta = ko.observable(0);
    self.sat_delta = ko.observable(0);
    self.val_delta = ko.observable(0);

    var applyChange = function(base, input, abs_rescale) {
        var num = parseFloat(input) || 0;
        if (input.toString().match(/%$/)) { // Ends in %, so relative update
            return base * (1 + num / 100);
        } else if (input.toString().match(/A$/i)) { // Ends in A, so absolute update (for numbers that need to end up between 0..1)
            return base + num / abs_rescale;
        } else { // Default, so update based on distance to maximum (gives best results
            if (num > 0)
                return base + (1 - base) * (num / 100);
            else
                return base + base * (num / 100);
        }
    }

    self.apply = function(color) {
        return jQuery.Color({
            hue:        applyChange(color.hue(),        self.hue_delta(), 1),
            saturation: applyChange(color.saturation(), self.sat_delta(), 100),
            lightness:  applyChange(color.lightness(),  self.val_delta(), 100)
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
