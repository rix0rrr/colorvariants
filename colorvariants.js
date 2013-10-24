/**
 * ColorVariants main entry point
 */

function AppModel() {
    var self = this;
    self.colorGrid = ko.observable(new ColorGrid());

    self.stateblob = ko.observable('');
    self.renderer  = new RenderDelphi();

    self.render = ko.computed(function() {
        var blob =  btoa(JSON.stringify(self.colorGrid().toJSON()));
        return self.renderer.render(self.colorGrid(), blob);
    });

    self.loadStateBlob = function() {
        var str = JSON.parse(atob(self.stateblob()));
        self.colorGrid(ColorGrid.fromJSON(str));
    }

    self.colorGrid().initializeWithSamples();
}

var model = new AppModel();
ko.applyBindings(model);
