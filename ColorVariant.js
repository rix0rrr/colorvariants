function ColorVariant(name, id) {
    var self = this;

    self.variantid = id;

    self.isBase  = ko.observable(id == 0);
    self.name    = ko.observable(name);
    self.change  = new ColorChange();

    self.toJSON = function() {
        return {
            id: self.variantid,
            n: self.name(),
            c: self.change.toJSON()
        }
    }
}
ColorVariant.fromJSON = function(js) {
    var v = new ColorVariant(js.n, js.id);
    v.change = ColorChange.fromJSON(js.c);
    return v;
}