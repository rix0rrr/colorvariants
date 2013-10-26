/**
 * ColorVariants main entry point
 */

function AppModel() {
    var self = this;
    self.colorGrid = ko.observable(new ColorGrid());

    self.stateblob = ko.observable('');
    self.renderer  = new RenderDelphi();
    self.error     = ko.observable('');
    self.undoStack = ko.observableArray();
    self.shareUrl  = ko.observable('');
    self.rendered  = ko.observable('');

    var lastState;
    var stateBeforeOpeningColorPicker;

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

    /**
     * Convert string to array
     */
    var strToArray = function(str) {
        var bytes = [];
        var len = str.length;
        for (var i = 0; i < len; i++) {
            bytes.push(str.charCodeAt(i));
        }
        return bytes;
    }

    /**
     * Return a promise for the stateblob of the current state
     */
    function getStateBlobQ() {
        var ret = Q.defer();
        try {
            LZMA.compress(jsonifiedGrid(), 1, function(compressed) {
                var blob = btoa(arrayToStr(compressed));
                ret.resolve(blob);
            });
        } catch (e) {
            ret.reject('Could not save state blob: ' + e.detailMessage);
        }
        return ret.promise;
    }

    /**
     * Return a promise for the decoded version of the stateblob
     */
    function decodeStateBlobQ(blob) {
        var ret = Q.defer();
        try {
            var compressed = atob(blob.trim());
            LZMA.decompress(strToArray(compressed), function(json) {
                if (json)
                    ret.resolve(JSON.parse(json));
                else
                    ret.reject('Could not load state blob');
            });
        } catch (e) {
            ret.reject('Could not load state blob: ' + e.detailMessage);
        }
        return ret.promise;
    }

    /**
     * Whenever the JSON representation changes, compress and rerender
     */
    jsonifiedGrid.subscribe(function() {
        getStateBlobQ().then(function(blob) {
            lastState = blob;

            self.shareUrl(location.protocol+'//'+location.host+location.pathname + '#' + blob);
            self.rendered(self.renderer.render(self.colorGrid(), blob));
        }).fail(function(err) {
            self.error(err);
        });
    });

    /**
     * Load blob
     */
    self.load = function(blob) {
        decodeStateBlobQ(blob).then(function(json) {
            $(self.colorGrid()).off('significantChange');
            self.colorGrid(ColorGrid.fromJSON(json));
            bindChangeToGrid();
        }).fail(function(err) {
            self.error(err);

        })
    }

    function saveUndo(state) {
        if (self.undoStack().length == 0 || state != self.undoStack()[self.undoStack().length - 1]) {
            self.undoStack.push(state);
        }
    }

    function bindChangeToGrid() {
        $(self.colorGrid()).on('significantChange', function() {
            saveUndo(lastState);
        });
    }
    bindChangeToGrid();

    /**
     * Undo from the state stack
     */
    self.undo = function() {
        var last = self.undoStack.pop();
        if (last) self.load(last);
    }

    /**
     * Load the stateblob input field
     */
    self.loadStateBlob = function() {
        self.load(self.stateblob());
    }

    self.colorPickerOpened = function() {
        getStateBlobQ().then(function(blob) {
            stateBeforeOpeningColorPicker = blob;
        }) ;
    }

    self.colorPickerClosed = function() {
        saveUndo(stateBeforeOpeningColorPicker);
    }

    // Either load from window fragment or start with demo samples
    var loadState = function() {
        var h = window.location.hash.substr(1);
        if (h)
            self.load(h);
        else
            self.colorGrid().initializeWithSamples();
    }
    $(window).on('hashchange', loadState);
    loadState();
}

var model = new AppModel();
ko.applyBindings(model);
