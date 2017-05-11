/**
 * Created by vigon on 25/02/2016.
 */
var mathis;
(function (mathis) {
    var creationFlat;
    (function (creationFlat) {
        var SingleSquareWithOneDiag = (function () {
            function SingleSquareWithOneDiag(mamesh) {
                this.makeLinks = true;
                this.markCorners = true;
                this.addALoopLineAround = false;
                this.mamesh = mamesh;
            }
            SingleSquareWithOneDiag.prototype.go = function () {
                var vert0 = this.mamesh.newVertex(new mathis.XYZ(0, 0, 0));
                var vert1 = this.mamesh.newVertex(new mathis.XYZ(1, 0, 0));
                var vert2 = this.mamesh.newVertex(new mathis.XYZ(1, 1, 0));
                var vert3 = this.mamesh.newVertex(new mathis.XYZ(0, 1, 0));
                //let triangulatedRect=new Polygone([vert1,vert2,vert3])
                //this.IN_mamesh.polygones.push(triangulatedRect)
                this.mamesh.addATriangle(vert0, vert1, vert3);
                this.mamesh.addATriangle(vert1, vert2, vert3);
                if (this.markCorners) {
                    vert0.markers.push(mathis.Vertex.Markers.corner);
                    vert1.markers.push(mathis.Vertex.Markers.corner);
                    vert2.markers.push(mathis.Vertex.Markers.corner);
                    vert3.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.makeLinks) {
                    vert1.setOneLink(vert3);
                    vert3.setOneLink(vert1);
                    if (!this.addALoopLineAround) {
                        vert0.setOneLink(vert1);
                        vert0.setOneLink(vert3);
                        vert1.setOneLink(vert0);
                        vert1.setOneLink(vert2);
                        vert2.setOneLink(vert1);
                        vert2.setOneLink(vert3);
                        vert3.setOneLink(vert0);
                        vert3.setOneLink(vert2);
                    }
                    else {
                        vert0.setTwoOppositeLinks(vert1, vert3);
                        vert1.setTwoOppositeLinks(vert2, vert0);
                        vert2.setTwoOppositeLinks(vert3, vert1);
                        vert3.setTwoOppositeLinks(vert0, vert2);
                    }
                }
                //else this.mamesh.linksOK = false
            };
            return SingleSquareWithOneDiag;
        }());
        creationFlat.SingleSquareWithOneDiag = SingleSquareWithOneDiag;
        var SingleSquareWithTwoDiag = (function () {
            function SingleSquareWithTwoDiag(mamesh) {
                this.makeLinks = true;
                this.markCorners = true;
                this.addALoopLineAround = false;
                this.mamesh = mamesh;
            }
            SingleSquareWithTwoDiag.prototype.go = function () {
                var vert0 = this.mamesh.newVertex(new mathis.XYZ(0, 0, 0));
                var vert1 = this.mamesh.newVertex(new mathis.XYZ(1, 0, 0));
                var vert2 = this.mamesh.newVertex(new mathis.XYZ(1, 1, 0));
                var vert3 = this.mamesh.newVertex(new mathis.XYZ(0, 1, 0));
                var vert4 = this.mamesh.newVertex(new mathis.XYZ(0.5, 0.5, 0));
                //let triangulatedRect=new Polygone([vert1,vert2,vert3])
                //this.IN_mamesh.polygones.push(triangulatedRect)
                this.mamesh.addATriangle(vert0, vert1, vert4);
                this.mamesh.addATriangle(vert1, vert2, vert4);
                this.mamesh.addATriangle(vert2, vert3, vert4);
                this.mamesh.addATriangle(vert4, vert3, vert0);
                if (this.markCorners) {
                    vert0.markers.push(mathis.Vertex.Markers.corner);
                    vert1.markers.push(mathis.Vertex.Markers.corner);
                    vert2.markers.push(mathis.Vertex.Markers.corner);
                    vert3.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.makeLinks) {
                    vert0.setOneLink(vert4);
                    vert1.setOneLink(vert4);
                    vert2.setOneLink(vert4);
                    vert3.setOneLink(vert4);
                    vert4.setTwoOppositeLinks(vert0, vert2);
                    vert4.setTwoOppositeLinks(vert1, vert3);
                    if (!this.addALoopLineAround) {
                        vert0.setOneLink(vert1);
                        vert0.setOneLink(vert3);
                        vert1.setOneLink(vert0);
                        vert1.setOneLink(vert2);
                        vert2.setOneLink(vert1);
                        vert2.setOneLink(vert3);
                        vert3.setOneLink(vert0);
                        vert3.setOneLink(vert2);
                    }
                    else {
                        vert0.setTwoOppositeLinks(vert1, vert3);
                        vert1.setTwoOppositeLinks(vert2, vert0);
                        vert2.setTwoOppositeLinks(vert3, vert1);
                        vert3.setTwoOppositeLinks(vert0, vert2);
                    }
                }
                //else this.mamesh.linksOK = false
            };
            return SingleSquareWithTwoDiag;
        }());
        creationFlat.SingleSquareWithTwoDiag = SingleSquareWithTwoDiag;
        var SingleSquare = (function () {
            function SingleSquare(mamesh) {
                this.makeLinks = true;
                this.markCorners = true;
                this.addALoopLineAround = false;
                this.mamesh = mamesh;
            }
            SingleSquare.prototype.go = function () {
                var vert0 = this.mamesh.newVertex(new mathis.XYZ(0, 0, 0));
                var vert1 = this.mamesh.newVertex(new mathis.XYZ(1, 0, 0));
                var vert2 = this.mamesh.newVertex(new mathis.XYZ(1, 1, 0));
                var vert3 = this.mamesh.newVertex(new mathis.XYZ(0, 1, 0));
                //let triangulatedRect=new Polygone([vert1,vert2,vert3])
                //this.IN_mamesh.polygones.push(triangulatedRect)
                this.mamesh.addASquare(vert0, vert1, vert2, vert3);
                if (this.markCorners) {
                    vert0.markers.push(mathis.Vertex.Markers.corner);
                    vert1.markers.push(mathis.Vertex.Markers.corner);
                    vert2.markers.push(mathis.Vertex.Markers.corner);
                    vert3.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.makeLinks) {
                    if (!this.addALoopLineAround) {
                        vert0.setOneLink(vert1);
                        vert1.setOneLink(vert2);
                        vert2.setOneLink(vert3);
                        vert3.setOneLink(vert0);
                        vert0.setOneLink(vert3);
                        vert3.setOneLink(vert2);
                        vert2.setOneLink(vert1);
                        vert1.setOneLink(vert0);
                    }
                    else {
                        vert0.setTwoOppositeLinks(vert1, vert3);
                        vert1.setTwoOppositeLinks(vert2, vert0);
                        vert2.setTwoOppositeLinks(vert3, vert1);
                        vert3.setTwoOppositeLinks(vert0, vert2);
                    }
                }
                //else this.mamesh.linksOK = false
            };
            return SingleSquare;
        }());
        creationFlat.SingleSquare = SingleSquare;
    })(creationFlat = mathis.creationFlat || (mathis.creationFlat = {}));
    function linkerTest() {
        var bilan = new mathis.Bilan();
        {
            var creator = new mathis.reseau.Regular();
            var mamesh = creator.go();
            var linker = new mathis.linkModule.SimpleLinkFromPolygonCreator(mamesh);
            linker.goChanging();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == 'straightLines:["[0,1]","[0,3]","[1,2]","[1,4]","[2,5]","[3,4]","[3,6]","[4,5]","[4,7]","[5,8]","[6,7]","[7,8]"]');
        }
        {
            var creator = new mathis.reseau.Regular();
            creator.squareVersusTriangleMaille = false;
            var mamesh = creator.go();
            var linker = new mathis.linkModule.SimpleLinkFromPolygonCreator(mamesh);
            linker.goChanging();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == 'straightLines:["[0,1]","[0,3]","[0,4]","[1,2]","[1,4]","[2,4]","[2,5]","[3,4]","[3,6]","[3,7]","[4,5]","[4,7]","[5,7]","[5,8]","[6,7]","[7,8]"]');
        }
        {
            var mamesh = new mathis.Mamesh();
            var single = new creationFlat.SingleSquare(mamesh);
            single.makeLinks = false;
            single.go();
            new mathis.mameshModification.SquareDichotomer(mamesh).go();
            new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh).goChanging();
            mamesh.clearOppositeInLinks();
            new mathis.linkModule.OppositeLinkAssocierByAngles(mamesh.vertices).goChanging();
            mathis.debug.checkTheRegularityOfAGraph(mamesh.vertices);
        }
        {
            var generator = new mathis.reseau.BasisForRegularReseau();
            generator.nbVerticalDecays = 1;
            generator.nbHorizontalDecays = 1;
            generator.nbI = 4;
            generator.nbJ = 4;
            var VV = generator.go();
            var meshMaker = new mathis.reseau.Regular();
            meshMaker.makeLinks = true;
            meshMaker.nbI = 4;
            meshMaker.nbJ = 4;
            meshMaker.Vi = VV.Vi;
            meshMaker.Vj = VV.Vj;
            var mamesh = meshMaker.go();
            mamesh.clearOppositeInLinks();
            var oppositeLinkAssocier = new mathis.linkModule.OppositeLinkAssocierByAngles(mamesh.vertices);
            /**un angle trop grand associe les angles*/
            oppositeLinkAssocier.maxAngleToAssociateLinks = Math.PI / 6;
            oppositeLinkAssocier.goChanging();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == 'straightLines:["[0,1,2,3]","[0,4,8,12]","[1,5,9,13]","[12,13,14,15]","[2,6,10,14]","[3,7,11,15]","[4,5,6,7]","[8,9,10,11]"]');
            mathis.debug.checkTheRegularityOfAGraph(mamesh.vertices);
        }
        {
            function torusDecayBySquare(nbX, nbY, nbVerticalDecays, nbHorizontalDecays) {
                var generator = new mathis.reseau.BasisForRegularReseau();
                generator.nbI = nbX;
                generator.nbJ = nbY;
                generator.end = new mathis.XYZ(2 * Math.PI, 2 * Math.PI, 0);
                generator.nbVerticalDecays = nbVerticalDecays;
                generator.nbHorizontalDecays = nbHorizontalDecays;
                var VV = generator.go();
                var r = 0.8;
                var a = 2;
                var meshMaker = new mathis.reseau.Regular();
                meshMaker.makeLinks = false;
                meshMaker.nbI = nbX;
                meshMaker.nbJ = nbY;
                meshMaker.Vi = VV.Vi;
                meshMaker.Vj = VV.Vj;
                var mamesh2 = meshMaker.go();
                mamesh2.vertices.forEach(function (vertex) {
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = (r * Math.cos(u) + a) * Math.cos((v));
                    vertex.position.y = (r * Math.cos(u) + a) * Math.sin((v));
                    vertex.position.z = r * Math.sin(u);
                });
                mamesh2.clearLinksAndLines();
                var merger = new mathis.grateAndGlue.Merger(mamesh2, null, null);
                merger.cleanDoubleLinks = false;
                merger.mergeLink = false;
                merger.goChanging();
                var linkFromPoly = new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh2);
                linkFromPoly.forceOppositeLinksAtCorners = true;
                linkFromPoly.goChanging();
                mamesh2.fillLineCatalogue();
                //cc('mamesh2',mamesh2.toString())
                return mamesh2.allLinesAsASortedString();
            }
            function torusDecayByLinks(nbX, nbY, nbVerticalDecays, nbHorizontalDecays, angleToAssociateOpposite) {
                var generator = new mathis.reseau.BasisForRegularReseau();
                generator.nbI = nbX;
                generator.nbJ = nbY;
                generator.end = new mathis.XYZ(2 * Math.PI, 2 * Math.PI, 0);
                generator.nbVerticalDecays = nbVerticalDecays;
                generator.nbHorizontalDecays = nbHorizontalDecays;
                var VV = generator.go();
                var r = 0.8;
                var a = 2;
                var meshMaker = new mathis.reseau.Regular();
                meshMaker.makeLinks = true;
                meshMaker.nbI = nbX;
                meshMaker.nbJ = nbY;
                meshMaker.Vi = VV.Vi;
                meshMaker.Vj = VV.Vj;
                var mamesh = meshMaker.go();
                mamesh.vertices.forEach(function (vertex) {
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = (r * Math.cos(u) + a) * Math.cos((v));
                    vertex.position.y = (r * Math.cos(u) + a) * Math.sin((v));
                    vertex.position.z = r * Math.sin(u);
                });
                var merger = new mathis.grateAndGlue.Merger(mamesh, null, null);
                merger.cleanDoubleLinks = true;
                merger.mergeLink = true;
                merger.goChanging();
                //new linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(IN_mamesh).goChanging()
                var oppositeAssocier = new mathis.linkModule.OppositeLinkAssocierByAngles(mamesh.vertices);
                oppositeAssocier.maxAngleToAssociateLinks = angleToAssociateOpposite;
                oppositeAssocier.goChanging();
                mamesh.fillLineCatalogue();
                return mamesh.allLinesAsASortedString();
            }
        }
        /**we test that exterior vertex are not taken in count when we use {@link LineComputer.computeAllLinesVersusInnerLines}==false */
        {
            var mamesh = new mathis.Mamesh();
            var v0 = mamesh.newVertex(new mathis.XYZ(1, 0, 0));
            //IN_mamesh.paramToVertex.putValue(v0.param,v0)
            var v1 = mamesh.newVertex(new mathis.XYZ(2, 0, 0));
            //IN_mamesh.paramToVertex.putValue(v1.param,v1)
            v0.setOneLink(v1);
            v1.setOneLink(v0);
            //mamesh.linksOK=true
            var v2 = new mathis.Vertex();
            v2.param = new mathis.XYZ(1, 2, 3);
            v2.setOneLink(v1);
            v1.setOneLink(v2);
            var lineMaker = new mathis.lineModule.LineComputer(mamesh);
            lineMaker.restrictLinesToTheseVertices = mamesh.vertices;
            lineMaker.go();
            bilan.assertTrue(mamesh.getStraightLines().length == 1);
        }
        return bilan;
    }
    mathis.linkerTest = linkerTest;
})(mathis || (mathis = {}));
