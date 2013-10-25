function ColorGrid() {
    var self = this;

    var variantId = 0;

    self.variants = ko.observableArray();
    self.colors   = ko.observableArray();

    function mkColorVariant(name, changes) {
        return _(new ColorVariant(name, variantId++)).tap(function (v) {
            if (changes && changes.h) v.change.hue_delta(changes.h);
            if (changes && changes.s) v.change.sat_delta(changes.s);
            if (changes && changes.v) v.change.val_delta(changes.v);
        });
    }

    function mkColor(name, baseColor) {
        return _(new Color(name)).tap(function(c) {
            if (baseColor) c.baseColor(baseColor);
        });
    }

    self.updateColorsForVariants = function() {
        _(self.colors()).each(function(color) {
            color.updateForVariants(self.variants());
        });
    }

    self.toJSON = function() {
        return {
            vs: _(self.variants()).map(function(x) { return x.toJSON(); }),
            cs: _(self.colors()).map(function(x) { return x.toJSON(); })
        }
    }

    self.getVariant = function(variantid) {
        return _(self.variants).findWhere({ variantid: variantid });
    }

    self.addVariant = function() {
        self.variants.push(mkColorVariant('Lighter', { v: '+' + (20 + 5 * self.variants().length) }));
        self.updateColorsForVariants();
    }

    self.removeVariant = function(variant) {
        self.variants.remove(variant);
        self.updateColorsForVariants();
    }

    self.addColor = function() {
        var c = mkColor('Color');
        self.colors.push(c);
        c.updateForVariants(self.variants());
    }

    self.removeColor = function(color) {
        self.colors.remove(color);
    }

    self.initializeWithSamples = function() {
        self.variants.push(mkColorVariant('Base'));
        self.variants.push(mkColorVariant('Light', { v: '+25' }));
        self.colors.push(mkColor('Normal', '#3574E8'));
        self.colors.push(mkColor('Stock', '#ED5AF2'));
        self.colors.push(mkColor('Grass', '#37BD28'));
        self.updateColorsForVariants();
    }

    self.forEachSwatch = function(fn) {
        _(self.colors()).each(function(color) {
            _(self.variants()).each(function(variant) {
                fn(color.swatchForVariant(variant), color, variant);
            });
        });
    }
}

ColorGrid.fromJSON = function(json) {
    var grid = new ColorGrid();
    grid.variants(_(json.vs).map(ColorVariant.fromJSON));
    grid.colors(_(json.cs).map(function(cjs) {
        return Color.fromJSON(cjs, grid.variants());
    }));
    return grid;
}
