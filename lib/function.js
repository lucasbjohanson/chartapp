var getSelectFigureOnCanvas = function (canvas, x ,y) {
    var overMouseFigureParent = null;
    var overMouseFigure = canvas.getBestFigure(x, y);

    if (overMouseFigure == undefined)
        return null;

    if (overMouseFigure instanceof draw2d.ResizeHandle)
        return null;

    if (overMouseFigure instanceof draw2d.Port)
        return null;

    if (!(overMouseFigure instanceof draw2d.Figure))
        return null;

    if (overMouseFigure != null)
        overMouseFigureParent = overMouseFigure.getRoot();

    if (overMouseFigureParent != null)
        overMouseFigure = overMouseFigureParent;

    return overMouseFigure;
};

var getAllSelectedFigures = function (canvas) {
    if (canvas == null) {
        console.log('Canvas is NULL!!!!!');
        return null;
    }

    var selection = canvas.getSelection();

    if (selection == null)
        return null;

    var figureList = selection.getAll();

    return figureList;
}

var removeAllFromSelection = function (canvas) {
    if (canvas == null)
        return false;

    var selection = canvas.getSelection();
    var allFigures = selection.getAll();

    if (allFigures == null)
        return false;

    allFigures.each(function (i, figure) {
        figure.unselect();
        selection.remove(figure);
    });

    return true;
}

var replaceFigure = function (canvas, oldFigure, type) {
    var newFigure = createFigure(canvas, type, oldFigure.getPosition().getX(), oldFigure.getPosition().getY(), false);

    newFigure.setHeight(oldFigure.getHeight());
    newFigure.setWidth(oldFigure.getWidth());

    var title = oldFigure.getChildren().data[0].getText();
    newFigure.getChildren().data[0].setText(title);

    // var ports = oldFigure.getPorts();
    // newFigure.addPort(ports.data[0], new draw2d.layout.locator.LeftLocator(newFigure));
    // newFigure.addPort(ports.data[1], new draw2d.layout.locator.RightLocator(newFigure));
    // newFigure.addPort(ports.data[2], new draw2d.layout.locator.TopLocator(newFigure));
    // newFigure.addPort(ports.data[3], new draw2d.layout.locator.BottomLocator(newFigure));
    // newFigure.layoutPorts();

    var command = new draw2d.command.CommandDelete(oldFigure);
    canvas.getCommandStack().execute(command);

    var command = new draw2d.command.CommandAdd(canvas, newFigure, oldFigure.getPosition().getX(), oldFigure.getPosition().getY());
    canvas.getCommandStack().execute(command);
}

var destroyClickedElement = function (event) {
    console.log('event.target : ', event.target);
    document.body.removeChild(event.target);
}

var exportJsonData = function (json) {
    var textToSaveAsBlob = new Blob([json], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = 'exportJsonData.json';
    console.log(textToSaveAsURL);

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
}

var hideContextMenu = function () {
    $('body').removeClass('context-menu-active');
    $('body .context-menu-list.virtual-menu-root').hide();
}