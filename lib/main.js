$(window).load(function () {

	var app  = new chart.Application();

	app.view.installEditPolicy(  new draw2d.policy.connection.DragConnectionCreatePolicy({
		createConnection: function(){
			return new HoverConnection();
		}
	}));

	app.view.installEditPolicy(new draw2d.policy.canvas.KeyboardPolicy({
		onKeyDown: function (canvas, keycode, shiftKey, ctrlKey) {
			switch (keycode) {
				case 68: // D key pressed
					var selectedFigures = getSelectFigureOnCanvas(canvas, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY());

					if (selectedFigures == null || app.rootScope.currentKeyCode > 0)
						return;

					canvas.editPolicy.each(function (i, policy) {
						if (policy instanceof draw2d.policy.canvas.BoundingboxSelectionPolicy) {
							canvas.mouseDown = true;
							canvas.mouseDownX = canvas.getAbsoluteX() + app.rootScope.currentMousePosition.getX();
							canvas.mouseDownY = canvas.getAbsoluteY() + app.rootScope.currentMousePosition.getY();

							policy.onMouseDown(canvas, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY(), shiftKey, ctrlKey);
						}
					});

					app.rootScope.keyPressPosition.setX(app.rootScope.currentMousePosition.getX());
					app.rootScope.keyPressPosition.setY(app.rootScope.currentMousePosition.getY());

					break;

				case 70: // F key pressed
					if (app.rootScope.currentKeyCode > 0)
						return;

					canvas.setCurrentSelection(null);

					canvas.editPolicy.each(function (i, policy) {
						if (policy instanceof draw2d.policy.connection.DragConnectionCreatePolicy) {
							canvas.mouseDown = true;
							canvas.mouseDownX = canvas.getAbsoluteX() + app.rootScope.currentMousePosition.getX();
							canvas.mouseDownY = canvas.getAbsoluteY() + app.rootScope.currentMousePosition.getY();

							policy.onMouseDown(canvas, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY(), shiftKey, ctrlKey);
						} else if (policy instanceof draw2d.policy.canvas.BoundingboxSelectionPolicy) {
							policy.onUninstall(canvas);
						}
					});

                    app.rootScope.keyPressPosition.setX(app.rootScope.currentMousePosition.getX());
					app.rootScope.keyPressPosition.setY(app.rootScope.currentMousePosition.getY());

					break;

				case 83:
					app.rootScope.keyPressPosition.setX(app.rootScope.currentMousePosition.getX());
					app.rootScope.keyPressPosition.setY(app.rootScope.currentMousePosition.getY());

					break;

				case 84: // T key pressed
					var selectedFigure = getSelectFigureOnCanvas(canvas, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY());

					if (selectedFigure == null)
						return;

					var children = selectedFigure.getChildren();
	                var child = null;

	                if (children != null && children != undefined && children.data.length > 0)
	                    child = children.data[0];
	                else {
	                    child = selectedFigure;
	                }

	                if (child == null)
	                    return;

	                app.viewScope.labelEditor.start(child);
					app.labelInplaceEditorCommit(app.viewScope.labelEditor, selectedFigure);

					break;
			}

			app.rootScope.currentKeyCode = keycode;
		},

		onKeyUp: function (canvas, keycode, shiftKey, ctrlKey) {
			switch (keycode) {
				case 66: // B key UP
					var figure = createFigure(canvas, 'process', app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY());

					var children = figure.getChildren();
					var child = null;

					if (children != null && children != undefined && children.data.length > 0)
						child = children.data[0];
					else {
						child = figure;
					}

					if (child == null)
						return;


					var command = new draw2d.command.CommandAdd(canvas, figure, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY());
					canvas.getCommandStack().execute(command);

					canvas.add(figure, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY());
					app.viewScope.labelEditor.start(child);
					app.labelInplaceEditorCommit(app.viewScope.labelEditor, figure);

					break;

				case 67: // C key UP

					break;

				case 68: // D key UP
					canvas.mouseDownX = canvas.getAbsoluteX() + app.rootScope.currentMousePosition.getX();
					canvas.mouseDownY = canvas.getAbsoluteY() + app.rootScope.currentMousePosition.getY();
					canvas.mouseDown = false;

					canvas.editPolicy.each(function (i, policy) {
						if (policy instanceof draw2d.policy.canvas.BoundingboxSelectionPolicy) {
							policy.onMouseUp(canvas, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY(), shiftKey, ctrlKey);

							return;
						}
					});

					canvas.mouseDragDiffX = 0;
            		canvas.mouseDragDiffY = 0;
					break;

				case 69: // E key UP

					break;

				case 70: // F key UP
					canvas.mouseDownX = canvas.getAbsoluteX() + app.rootScope.currentMousePosition.getX();
					canvas.mouseDownY = canvas.getAbsoluteY() + app.rootScope.currentMousePosition.getY();
					canvas.mouseDown = false;

					canvas.editPolicy.each(function (i, policy) {
						if (policy instanceof draw2d.policy.connection.DragConnectionCreatePolicy) {
							policy.onMouseUp(canvas, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY(), shiftKey, ctrlKey);
						}
					});
					
					canvas.installEditPolicy(new draw2d.policy.canvas.BoundingboxSelectionPolicy());

					canvas.mouseDragDiffX = 0;
            		canvas.mouseDragDiffY = 0;
					break;

			}

			app.rootScope.currentKeyCode = 0;
			canvas.mouseDown = false;
		},

		onMouseMove: function (canvas, x, y, shiftKey, ctrlKey) {
			app.rootScope.currentMousePosition.setX(x);
			app.rootScope.currentMousePosition.setY(y);

			var diffX1 = x - app.rootScope.keyPressPosition.getX();
            var diffY1 = y - app.rootScope.keyPressPosition.getY();

			switch (app.rootScope.currentKeyCode) {
				case 68: // D key drag
					if (getSelectFigureOnCanvas(canvas, x, y) == null)
                    	return;

                	canvas.editPolicy.each(function (i, policy) {
							policy.onMouseDrag(canvas, diffX1, diffY1, diffX1 - app.rootScope.originMovePoint.getX(), diffY1 - app.rootScope.originMovePoint.getY(), shiftKey, ctrlKey);
					});

					break;

				case 70: // F key drag
	    			canvas.editPolicy.each(function (i, policy) {
	    				if (policy instanceof draw2d.policy.connection.DragConnectionCreatePolicy)
							policy.onMouseDrag(canvas, diffX1, diffY1, diffX1 - app.rootScope.originMovePoint.getX(), diffY1 - app.rootScope.originMovePoint.getY(), shiftKey, ctrlKey);
					});

					break;
			}

			app.rootScope.originMovePoint.setX(diffX1);
            app.rootScope.originMovePoint.setY(diffY1);
		}
	}));
});