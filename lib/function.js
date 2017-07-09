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