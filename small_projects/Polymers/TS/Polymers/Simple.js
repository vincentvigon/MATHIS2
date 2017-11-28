var mathis;
(function (mathis) {
    var alea1 = Math.floor(Math.random() * 3);
    var mathisFrame = new mathis.MathisFrame();
    var makeLoop = false;
    var interpolationStyle = geometry.InterpolationStyle.none;
    var chainSize = 3;
    var mamesh = new mathis.Mamesh();
    for (var i = 0; i < chainSize; i++) {
        var vertex = new mathis.Vertex().setPosition(alea1, alea1, alea1);
        mamesh.vertices.push(vertex);
    }
    for (var i = 1; i < chainSize - 1; i++) {
        mamesh.vertices[i].setTwoOppositeLinks(mamesh.vertices[i - 1], mamesh.vertices[i + 1]);
    }
    if (makeLoop) {
        mamesh.vertices[0].setTwoOppositeLinks(mamesh.vertices[1], mamesh.vertices[chainSize - 1]);
        mamesh.vertices[chainSize - 1].setTwoOppositeLinks(mamesh.vertices[chainSize - 2], mamesh.vertices[0]);
    }
    else {
        mamesh.vertices[0].setOneLink(mamesh.vertices[1]);
        mamesh.vertices[chainSize - 1].setOneLink(mamesh.vertices[chainSize - 2]);
    }
    //distance réelle
    var distances = new mathis.graph.DistancesBetweenAllVertices(mamesh.vertices);
    distances.go();
    mathisFrame.messageDiv.append("distance between origin and end:" + distances.OUT_distance(mamesh.vertices[0], mamesh.vertices[chainSize - 1]));
    //distance absolut ??
    var linesViewer = new mathis.visu3d.LinesViewer(mamesh, mathisFrame.scene);
    linesViewer.interpolationOption.interpolationStyle = interpolationStyle;
    linesViewer.interpolationOption.loopLine = makeLoop;
    linesViewer.go();
    new mathis.visu3d.VerticesViewer(mamesh, mathisFrame.scene).go();
})(mathis || (mathis = {}));
