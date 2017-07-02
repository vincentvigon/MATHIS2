/**
 * Created by Gwenael on 03/04/2017.
 */

module mathis {

    export module fractionalBrownian {
        // import MathisFrame = mathis.MathisFrame;
        // import Color = mathis.Color;
        // import XYZ = mathis.XYZ;
        // import Mamesh = mathis.Mamesh;
        // import Vertex = mathis.Vertex;
        // import logger = mathis.logger;
        // import SurfacesFromHexahedrons = mathis.mameshModification.SurfacesFromHexahedrons;
        // import HexahedronSubdivider = mathis.mameshModification.HexahedronSubdivider;
        // import NormalDuplication = mathis.visu3d.NormalDuplication;

        export function fractionalBrownianGo() {

            let size = 256;
            let h = 0.5;
            let r = 2;
            let id = 1;
            let online = true;


            let mathisFrame = new MathisFrame("mathis_canvas");

            let basis = new mathis.reseau.BasisForRegularReseau();
            basis.nbU = size;
            basis.nbV = size;
            basis.set_nbV_toHaveRegularReseau = true;
            basis.origin = new mathis.XYZ(0, 0, 0);
            basis.end = new mathis.XYZ(1, 1, 0);
            let creator = new mathis.reseau.Regular2d(basis);
            creator.makeLinks = false;
            creator.markCorner = false;
            creator.markBorder = false;
            creator.markCenter = false;
            creator.makeLinks=false
            let mamesh = creator.go();

            function drawingBrownian() {
                let surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, mathisFrame.scene);
                surfaceViewer.backFaceCulling = true;
                surfaceViewer.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                surfaceViewer.normalDuplication = visu3d.NormalDuplication.none;

                let material = new mathis.materials.FuncMapperShader("1 - z / 0.3", mathisFrame.scene);
                material.gradient = new mathis.materials.GradientColor(
                    [new mathis.Color("#ff3333"),
                        new mathis.Color("#FFFF00"),
                        new mathis.Color("#00FF00"),
                        new mathis.Color("#00FFFF"),
                        new mathis.Color("#3333ff"),
                        new mathis.Color("#FF00FF")]
                );
                surfaceViewer.material = material.go();

                let mesh = surfaceViewer.go();

                let positioning = new mathis.Positioning();
                positioning.position = new XYZ(-0.5, -0.5, -0.5);
                positioning.applyToMeshes([mesh]);
            }

            if (!online) {
                let field = exports.genBrownian(size, r, h);

                let field_min = Infinity;
                let field_max = -Infinity;

                for (let i = 0; i < field.length; i++) {
                    let el = field[i];
                    if (field_min > el)
                        field_min = el;
                    if (field_max < el)
                        field_max = el;
                }

                for (let i = 0; i < mamesh.vertices.length; i++) {
                    let vertex = mamesh.vertices[i];
                    let u = Math.round(vertex.position.x * (size - 1));
                    let v = Math.round(vertex.position.y * (size - 1));
                    vertex.position.z = (field[u * size + v] - field_min) / (field_max - field_min) * 0.3;
                }

                drawingBrownian();
            } else {
                let host = "http://localhost:9615/brownian/" + size + "_" + r + "_" + h + "_" + id + ".png";
                // const host = "../nodejs/brownian/256_2_0.5_0.png";

                let canvas = document.createElement("canvas");
                canvas.width = size;
                canvas.height = size;
                let context = canvas.getContext('2d');

                let myImg = new Image();
                myImg.crossOrigin = "http://localhost:9615";
                myImg.onload = function () {
                    context.drawImage(myImg, 0, 0);

                    let data = context.getImageData(0, 0, size, size).data;
                    for (let i = 0; i < mamesh.vertices.length; i++) {
                        let vertex = mamesh.vertices[i];
                        let u = Math.round(vertex.position.x * (size - 1));
                        let v = Math.round(vertex.position.y * (size - 1));
                        vertex.position.z = data[4 * (u * size + v)] / 256 * 0.3;
                    }

                    drawingBrownian();
                };
                myImg.src = host;
            }
        }
    }
}


