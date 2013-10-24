function Color(name) {
    var self = this;

    self.name      = ko.observable(name);
    self.swatches  = ko.observableArray();
    self.baseColor = ko.observable('#EEFF00');

    self.swatchForVariant = function(variant) {
        return _(self.swatches()).findWhere({ variantid: variant.variantid });
    }

    self.updateForVariants = function(variants) {
        // Add for new variants
        _(variants).each(function(variant) {
            if (self.swatchForVariant(variant)) return;
            self.swatches.push(new Swatch(self.baseColor, variant));
        });

        // Remove unused variants
        self.swatches.remove(function(swatch) {
            return !_(variants).findWhere({ variantid: swatch.variantid });
        });
    }

    self.toJSON = function() {
        return {
            n: self.name(),
            c: self.baseColor(),
            s: _(self.swatches()).map(function(x) { return x.toJSON(); })
        }
    }
}
Color.fromJSON = function(js, variants) {
    var c = new Color(js.n);
    c.baseColor(js.c);
    c.swatches(_(js.s).map(function(swjs) {
        return Swatch.fromJSON(swjs, c.baseColor, variants);
    }));
    return c;
}