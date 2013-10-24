function Swatch(baseColorObs, variant) {
    var self = this;

    self.variant   = variant;
    self.variantid = variant.variantid;
    self.change    = new ColorChange();

    self.theColor = ko.computed(function() {
        var color = jQuery.Color(baseColorObs());
        color = self.variant.change.apply(color);
        color = self.change.apply(color);
        return color.toHexString();
    });

    self.toJSON = function() {
        return {
            vid: self.variantid,
            c: self.change.toJSON()
        }
    }
}
Swatch.fromJSON = function(js, baseColorObs, variants) {
    var s = new Swatch(baseColorObs, _(variants).findWhere({ variantid: js.vid }));
    s.change = ColorChange.fromJSON(js.c);
    return s;
}