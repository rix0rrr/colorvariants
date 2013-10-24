function RenderDelphi() {
    var self = this;

    function ucFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function doubleHex(num) {
        var r = num.toString(16).toUpperCase();
        if (r.length < 2) return '0' + r;
        return r;
    }

    function delphiColor(hexColor) {
        var c = jQuery.Color(hexColor);

        return '$00' + doubleHex(c.blue()) + doubleHex(c.green()) + doubleHex(c.red());
    }

    self.name = ko.observable('Delphi');

    self.render = function(grid, blob) {
        var lines = [];

        lines.push('{ ----------------------------------------------------------------------');
        lines.push('  These colors can be managed at ' + window.location.href);
        lines.push('');
        lines.push('  State blob:');
        lines.push('  ' + blob);
        lines.push('  ---------------------------------------------------------------------- }');
        lines.push('const');

        grid.forEachSwatch(function(swatch, color, variant) {
            if (!swatch) return;
            lines.push('  ' + ucFirst(color.name()) + ucFirst(variant.name()) + ' = TColor(' + delphiColor(swatch.theColor()) + ');');
        });

        return lines.join('\r\n');
    };
}