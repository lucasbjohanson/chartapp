var svgData = [];

svgData['process'] = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="80"><path d="M0 0h24v18H0z" stroke="#000" stroke-width="0.8" fill="#fff"></path></svg>';

svgData['decision'] = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><path d="M12 0l12 9-12 9-12-9z" stroke="#000" stroke-width="0.8" fill="#fff"></svg>';

svgData['preprocess'] = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><path d="M0 0h24v18H0z" stroke="#000" stroke-width="0.8" fill="#fff"></path><path d="M2.4 0v18M21.6 0v18" stroke="#000" stroke-width="0.8" fill="none"></path></svg>';

svgData['document'] = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><path d="M0 0h24v18c-4-3-6.5-3-8-3-2.4 0-5.6 3-8 3-1.5 0-4 0-8-3z" stroke="#000" stroke-width="0.8" fill="#fff"></path></svg>';

svgData['preparation'] = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><path d="M5 0h14.4l4.8 9-4.8 9H5L0 9z" stroke="#000" stroke-width="0.8" fill="#fff"></path></svg>';

svgData['storage'] = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><path d="M0 0h28v23H0z" stroke="#000" stroke-width="0.8" fill="#fff"></path><path d="M2.4 0v23M2 2.4h26" stroke="#000" stroke-width="0.8" fill="none"></path></svg>';

svgData['paper'] = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><path d="M0 0c4 3 6.5 3 8 3 2.4 0 5.6-3 8-3 1.5 0 4 0 8 3v15c-4-3-6.5-3-8-3-2.4 0-5.6 3-8 3-1.5 0-4 0-8-3z" stroke="#000" stroke-width="0.8" fill="#fff"></path></svg>';

svgData['delay'] = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><path d="M0 0h12c6.627 0 12 5.373 12 12s-5.373 12-12 12H0z" stroke="#000" stroke-width="0.8" fill="#fff"></path></svg>';

svgData['display'] = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><path d="M6.8 0h16.8c1.325 0 2.4 4.03 2.4 9s-1.075 9-2.4 9H6.8L0 9z" stroke="#000" stroke-width="0.8" fill="#fff"></path></svg>';

svgData['offpagelink'] = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><path d="M0 0h24v14.4L12 24 0 14.4z" stroke="#000" stroke-width="0.8" fill="#fff"></path></svg>';

svgData['circle'] = '<svg width="100px" height="100px" version="1.1" xmlns="http://www.w3.org/2000/svg" ><circle cx="40" cy="40" r="40" stroke="black" stroke-width="3" fill="white" /></svg>';

var LabelSvgFigure = draw2d.SVGFigure.extend({
    init:function(attr) {
        this.tooltip = null;

        this._super(attr);

        // Create any Draw2D figure as decoration for the connection
        //
        this.label = new draw2d.shape.basic.Label({
            text:"I'm a SVG", 
            color:"#0d0d0d", 
            fontColor:"#0a0a0a",
            userData: {
                moveKeyStatus: false
            }
        });

        // add the new decoration to the connection with a position locator.
        //
        this.add(this.label, new draw2d.layout.locator.CenterLocator(this));
        this.zoomCallback = $.proxy(this.positionTooltip,this);
        //this.installEditPolicy(figureEditPolicy);

    },

    setCanvas: function(canvas) {
        if(this.canvas !==null) this.canvas.off(this.zoomCallback);
        this._super(canvas);
        if(this.canvas !==null) this.canvas.on("zoom",this.zoomCallback);
    },

    onMouseEnter: function() {
        //this.showTooltip();
    },

    onMouseLeave: function() {
        if (this.tooltip)
            this.hideTooltip();
    },

    setPosition: function(x,y) {
        this._super(x,y);
        this.positionTooltip();
    },

    hideTooltip:function() {
        this.tooltip.fadeOut(500, function() {
            $(this).remove();
        });
        this.tooltip = null;
    },

    showTooltip:function() {
        this.tooltip= $('<div class="figure-tooltip">Tooltip</div>')
        .appendTo('body')
        .hide()
        .fadeIn(1000);
        this.positionTooltip();
    },

    positionTooltip: function()
    {
        if( this.tooltip===null) {
            return;
        }

        var width =  this.tooltip.outerWidth(true);
        var pos = this.canvas.fromCanvasToDocumentCoordinate(
        this.getAbsoluteY() + this.getHeight() + 10, 
        this.getAbsoluteX() + this.getWidth() / 2 - width / 2);

        // remove the scrolling part from the tooltip because the tooltip is placed
        // inside the scrolling container
        pos.x +=this.canvas.getScrollLeft();
        pos.y +=this.canvas.getScrollTop();

        this.tooltip.css({'top': pos.x, 'left': pos.y});
    }, 

    onContextMenu:function(x,y){
        $.contextMenu({
            selector: 'body', 
            events:
            {  
                hide:function(){ $.contextMenu( 'destroy' ); }
            },
            callback: $.proxy(function(key, options) {
                switch(key){
                    case "process":
                        this.setColor('#f3546a');
                        break;
                    case "decision":
                        this.setColor('#b9dd69');
                        break;
                    case "preprocess":
                        this.setColor('#00A8F0');
                        break;
                    case "delete":
                        // without undo/redo support
                        //     this.getCanvas().remove(this);

                        // with undo/redo support
                        var cmd = new draw2d.command.CommandDelete(this);
                        this.getCanvas().getCommandStack().execute(cmd);
                    default:
                        break;
                }

            }, this),
            x:x,
            y:y,
            items: 
            {
                "process": {name: "Process"},
                "sep1": "---------",
                "decision": {name: "Decision"},
                "sep2": "---------",
                "preprocess": {name: "Preprocess"},
                "sep3": "---------",
                "document": {name: "Document"},
                "sep4": "---------",
                "preparation": {name: "Preparation"},
                "sep5": "---------",
                "storage": {name: "Storage"},
                "sep6": "---------",
                "paper": {name: "Paper"},
                "sep7": "---------",
                "delay": {name: "Delay"},
                "sep8": "---------",
                "display": {name: "Display"},
                "sep9": "---------",
                "offlinelink": {name: "Offlinelink"},
                "sep10": "---------",
                "circle": {name: "Circle"},
                "sep11": "---------",
                "delete": {name: "Delete"}
            }
        });
        console.log('here', x, y);
    }
});

var createFigure = function (canvas, type, x, y, ports = false) {
    var figure = new LabelSvgFigure({
        width:100, 
        height:80,
        keepAspectRatio: false,
        userData: {
            moveKeyStatus: false,
            linkKeyStatus: false,
            selected: false,
            mouseOffset: {
                x: 0,
                y: 0
            },
            objectType: {
                type: type
            },
	        originSize: {
	          width: 100,
	          height: 80
	        } 
        }
    });

    figure.setSVG(svgData[type]);

    if (!ports) {
        figure.createPort("hybrid", new draw2d.layout.locator.LeftLocator(figure));
        figure.createPort("hybrid", new draw2d.layout.locator.RightLocator(figure));
        figure.createPort("hybrid", new draw2d.layout.locator.TopLocator(figure));
        figure.createPort("hybrid", new draw2d.layout.locator.BottomLocator(figure));
    }

    return figure;
}