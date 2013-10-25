/**
 * ColorVariants main entry point
 */

function AppModel() {
    var self = this;
    self.colorGrid = ko.observable(new ColorGrid());

    self.stateblob = ko.observable('');
    self.renderer  = new RenderDelphi();

    var jsonifiedGrid = ko.computed(function() {
        return JSON.stringify(self.colorGrid().toJSON());
    });

    /**
     * Convert array to string, for interfacing with the LZMA library
     */
    var arrayToStr = function(arr) {
        var binary = '';
        var bytes  = new Uint8Array(arr);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return binary;
    }

    var strToArray = function(str) {
        var bytes = [];
        var len = str.length;
        for (var i = 0; i < len; i++) {
            bytes.push(str.charCodeAt(i));
        }
        return bytes;
    }

    jsonifiedGrid.subscribe(function(jsonString) {
        LZMA.compress(jsonString, 1, function(compressed) {
            var blob = btoa(arrayToStr(compressed));
            var rendered = self.renderer.render(self.colorGrid(), blob);
            $('#rendered').text(rendered);
        });
    });


    self.loadStateBlob = function() {
        var compressed = atob(self.stateblob().trim());
        LZMA.decompress(strToArray(compressed), function(json) {
            var str = JSON.parse(json);
            self.colorGrid(ColorGrid.fromJSON(str));
        });
    }

    self.colorGrid().initializeWithSamples();
}

var model = new AppModel();
ko.applyBindings(model);
