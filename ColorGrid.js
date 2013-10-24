function ColorGrid() {
    var self = this;

    var variantId = 0;

    self.variants = ko.observableArray();
    self.colors   = ko.observableArray();

    function mkColorVariant(name) {
        return new ColorVariant(name, variantId++);
    }

    function mkColor(name) {
        return new Color(name);
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
        self.variants.push(mkColorVariant('variant'));
        self.updateColorsForVariants();
    }

    self.removeVariant = function(variant) {
        self.variants.remove(variant);
        self.updateColorsForVariants();
    }

    self.addColor = function() {
        var c = mkColor('color');
        self.colors.push(c);
        c.updateForVariants(self.variants());
    }

    self.removeColor = function(color) {
        self.colors.remove(color);
    }

    self.initializeWithSamples = function() {
        self.variants.push(mkColorVariant('base'));
        self.variants.push(mkColorVariant('lighter'));
        self.colors.push(mkColor('color1'));
        self.colors.push(mkColor('color2'));
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
