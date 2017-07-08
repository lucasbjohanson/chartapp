var HoverConnection = draw2d.Connection.extend({

    init: function ( sourcePort, targetPort) {
        var self = this;
        this._super({
            router: new draw2d.layout.connection.InteractiveManhattanConnectionRouter(),
            radius: 5,
            source: sourcePort,
            target: targetPort,
            stroke: 2
        });

        this.on("dragEnter", function (emitter, event) {
            self.attr({
                outlineColor: "#303030",
                outlineStroke: 2,
                color: "#00a8f0"
            });
        });
        this.on("dragLeave", function (emitter, event) {
            self.attr({
                outlineColor: "#303030",
                outlineStroke: 0,
                color: "#000000"
            });
        });
    },

    /**
     * required to receive dragEnter/dragLeave request.
     * This figure ignores drag/drop events if it is not a valid target
     * for the draggedFigure
     *
     * @param draggedFigure
     * @returns {HoverConnection}
     */
    delegateTarget: function(draggedFigure)
    {
        return this;
    },

    onMouseEnter: function () {
        var canvas = this.getCanvas();
        canvas.addSelection(this);
    },

    onMouseLeave: function () {
        this.unselect();
    },

    repaint: function (attributes) {
        if (this.repaintBlocked === true || this.shape === null) {
            return;      
        }

        attributes = attributes || {};

        // if (typeof attributes.fill === "undefined") {
        //   attributes.fill = "aed581";
        // }

        this._super(attributes);
    }
});

var ArrowConnection = draw2d.Connection.extend({
    init: function (attr, setter, getter) {
        this._super($.extend({
            color: "#33691e",
            stroke: 3,
            outlineStroke: 2,
            outlineColor: null
        }, attr),
        setter,
        getter);

        this.setRouter(new draw2d.layout.connection.ManhattanBridgedConnectionRouter());
    }, 

    repaint: function (attributes) {
        if (this.repaintBlocked === true || this.shape === null) {
            return;      
        }

        attributes = attributes || {};

        // if (typeof attributes.fill === "undefined") {
        //   attributes.fill = "aed581";
        // }

        this._super(attributes);
    },

    onMouseEnter: function () {
        var canvas = this.getCanvas();
        canvas.addSelection(this);
    },

    onMouseLeave: function () {
        this.unselect();
    }
});

