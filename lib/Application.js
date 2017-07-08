// declare the namespace for this chart
var chart = {};

/**
 * 
 * The **GraphicalEditor** is responsible for layout and dialog handling.
 * 
 * @author Andreas Herz
 * @extends draw2d.ui.parts.GraphicalEditor
 */
chart.Application = Class.extend(
{
    NAME : "chart.Application", 

    rootScope: {
    	currentMousePosition: null,
    	keyPressPosition: null,
    	originMovePoint: null,
    	currentKeyCode: 0
    },

    viewScope: {
    	labelEditor: null
    },

    /**
     * @constructor
     * 
     * @param {String} canvasId the id of the DOM element to use as paint container
     */
    init : function()
    {
			this.view    = new chart.View("canvas");
			this.toolbar = new chart.Toolbar("toolbar",  this.view );

			this.rootScope.currentMousePosition = new draw2d.geo.Point(0, 0);
			this.rootScope.keyPressPosition = new draw2d.geo.Point(0, 0);
			this.rootScope.originMovePoint = new draw2d.geo.Point(0, 0);

			this.viewScope.labelEditor = new draw2d.ui.LabelInplaceEditor();

	       
	       // layout FIRST the body
	       this.appLayout = $('#container').layout({
	   	     west: {
	              resizable:true,
	              closable:true,
	              resizeWhileDragging:true,
	              paneSelector: "#navigation"
	            },
	            center: {
	              resizable:true,
	              closable:true,
	              resizeWhileDragging:true,
	              paneSelector: "#content"
	            }
	       });
	      
	       //
	       this.contentLayout = $('#content').layout({
	   	     north: {
	              resizable:false,
	              closable:false,
                  spacing_open:0,
                  spacing_closed:0,
                  size:50,
	              paneSelector: "#toolbar"
	            },
	            center: {
	              resizable:false,
	              closable:false,
                  spacing_open:0,
                  spacing_closed:0,
	              paneSelector: "#canvas"
	            }
	       });
	},

	labelInplaceEditorCommit: function (labelInplaceEditor, parent) {
		labelInplaceEditor.commit = function () {
		    this.html.unbind("blur",this.commitCallback);
		    $("body").unbind("click",this.commitCallback);
		    var label = this.html.val();
		    var cmd =new draw2d.command.CommandAttr(this.label, {text:label});
		    this.label.getCanvas().getCommandStack().execute(cmd);
		    this.html.fadeOut($.proxy(function(){
		        this.html.remove();
		        this.html = null;
		        this.listener.onCommit(this.label.getText());
		    }, this));

		    var labelWidth = this.label.getWidth() + 45;
		    parent.setWidth(labelWidth);
		};
	}
});
