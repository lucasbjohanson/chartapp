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

				case 83: // S key pressed
					if (app.rootScope.currentKeyCode > 0)
						return;

					app.rootScope.keyPressPosition.setX(app.rootScope.currentMousePosition.getX());
					app.rootScope.keyPressPosition.setY(app.rootScope.currentMousePosition.getY());

					canvas.editPolicy.each(function (i, policy) {
						if (policy instanceof draw2d.policy.canvas.BoundingboxSelectionPolicy) {
							canvas.mouseDown = true;
							canvas.mouseDownX = canvas.getAbsoluteX() + app.rootScope.currentMousePosition.getX() - canvas.getScrollLeft();
							canvas.mouseDownY = canvas.getAbsoluteY() + app.rootScope.currentMousePosition.getY() - canvas.getScrollTop();

							policy.onMouseDown(canvas, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY(), shiftKey, ctrlKey);
						}
					});

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
			console.log(keycode);
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
						break;


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
					var selectedFigure = getSelectFigureOnCanvas(canvas, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY());

					if (selectedFigure == null) 
						break;

					if (!removeAllFromSelection(canvas))
						break;

					selectedFigure.select();
					canvas.setCurrentSelection(selectedFigure);

					$('body').addClass('context-menu-active');
					var menu = $('body .context-menu-list.virtual-menu-root');
					var menuItem = $('body  .context-menu-list.virtual-menu-root .context-menu-item');

					menu.show();
					menu.css('position', 'absolute');
					menu.css('cursor', 'pointer');
					var pos = canvas.fromCanvasToDocumentCoordinate(app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY());
					menu.css('left', pos.x);
					menu.css('top', pos.y);

					menuItem.hover(
						function () {
							if ($(this).hasClass('not-selectable'))
								return;

							$(this).addClass('hover');
						}, function () {
							if ($(this).hasClass('not-selectable'))
								return;

							$(this).removeClass('hover');
						}
					);

					menuItem.on('click', function () {
						var type = $(this).attr('data-type');

						replaceFigure(canvas, selectedFigure, type);
						hideContextMenu();
					});

					app.rootScope.lastUpKeycode = keycode;

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

				case 72: // H key UP

					selectedFigure = getSelectFigureOnCanvas(canvas, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY());

					if (selectedFigure != null) {
						selectedFigure.showTooltip();
					}

					break;

				case 81: // Q key UP

					var figureList = getAllSelectedFigures(canvas);

					if (figureList == null)
						break;

					figureList.each(function(i, figure) {
						var command = new draw2d.command.CommandDelete(figure);
						canvas.getCommandStack().execute(command);
					});

					break;

				case 83: // S key UP
					canvas.editPolicy.each(function (i, policy) {
						if (policy instanceof draw2d.policy.canvas.BoundingboxSelectionPolicy) {
							canvas.mouseDown = false;
							canvas.mouseDownX = canvas.getAbsoluteX() + app.rootScope.currentMousePosition.getX() - canvas.getScrollLeft();
							canvas.mouseDownY = canvas.getAbsoluteY() + app.rootScope.currentMousePosition.getY() - canvas.getScrollTop();

							policy.onMouseUp(canvas, app.rootScope.currentMousePosition.getX(), app.rootScope.currentMousePosition.getY(), shiftKey, ctrlKey);
						}
					});
					break;

				case 86: // V key UP

					break;

				case 88: // X key UP
					app.rootScope.lastUpKeycode = keycode;



					break;

				case 90:

					if (!shiftKey) {
						canvas.getCommandStack().undo();
					} else {
						canvas.getCommandStack().redo();
					}

					break;

				case 27: // ESC key UP

					hideContextMenu();

					break;

				case 38: // Arrow UP key UP
					if (app.rootScope.lastUpKeycode === 69) {
						// E key UP status
						var menu = $('body .context-menu-list.virtual-menu-root');
						var menuItem = $('body .context-menu-list.virtual-menu-root .context-menu-item');

						if (!menuItem.hasClass('hover')) {
							$('.context-menu-item:last-child').addClass('hover');
						} else {
							$('.context-menu-item.hover').removeClass('hover').prev().prev().addClass('hover');
						}
					}
					break;

				case 40: // Arrow Down Key UP
					if (app.rootScope.lastUpKeycode === 69) {
						// E key UP status
						var menu = $('body .context-menu-list.virtual-menu-root');
						var menuItem = $('body .context-menu-list.virtual-menu-root .context-menu-item');

						if (!menuItem.hasClass('hover')) {
							$('.context-menu-item:nth-child(1)').addClass('hover');
						} else {
							$('.context-menu-item.hover').removeClass('hover').next().next().addClass('hover');
						}
					}
					break;

				case 13: // Return Key UP
					if (app.rootScope.lastUpKeycode === 69) {
						// E key UP status
						var type = $('.context-menu-item.hover').attr('data-type');

						if (type != undefined) {
							var oldFigure = canvas.getPrimarySelection();
							replaceFigure(canvas, oldFigure, type);
						}

						hideContextMenu();
					}
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