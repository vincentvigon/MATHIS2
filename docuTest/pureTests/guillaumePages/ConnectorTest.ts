/**
 * Created by Kieffer on 24/03/2017.
 */

module mathis{

    export module appli{


        export class ConnectorTest implements OnePage{
            pageIdAndTitle="Find triangles/square from links"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame){
                let several=new SeveralParts()
                several.addPart(new ConnectorPieceDocu(this.mathisFrame))
                this.severalParts=several
            }

            go(){
                return this.severalParts.go()
            }

        }

        class ConnectorPieceDocu implements PieceOfCode{

            NAME="ConnectorPieceDocu"
            TITLE="How connect surfaces"

            //polyhedronType=creation3D.ArchimedeanSolidType.TruncatedIcosidodecahedron
            //$$$polyhedronType=new Choices(allIntegerValueOfEnume(creation3D.ArchimedeanSolidType),{visualValues:allStringValueOfEnume(creation3D.ArchimedeanSolidType)})

            constructor(private mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                let camera=<macamera.GrabberCamera>this.mathisFrame.scene.activeCamera
                camera.changePosition(new XYZ(0,0,-5))
                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)

                //$$$bh creation of a simple mamesh

                /** Création des points de la surface **/
                let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
                let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
                let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
                let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
                let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
                let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
                let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
                let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
                let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
                let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
                let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
                let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);

                let mamesh = new mathis.Mamesh();
                mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);

                /** Création des liens de la surface **/
                vtx1.setOneLink(vtx2); vtx2.setOneLink(vtx1);
                vtx2.setOneLink(vtx3); vtx3.setOneLink(vtx2);
                vtx3.setOneLink(vtx4); vtx4.setOneLink(vtx3);
                vtx4.setOneLink(vtx5); vtx5.setOneLink(vtx4);
                vtx5.setOneLink(vtx6); vtx6.setOneLink(vtx5);
                vtx6.setOneLink(vtx7); vtx7.setOneLink(vtx6);
                vtx7.setOneLink(vtx8); vtx8.setOneLink(vtx7);
                vtx8.setOneLink(vtx9); vtx9.setOneLink(vtx8);
                vtx9.setOneLink(vtx1); vtx1.setOneLink(vtx9);

                vtx10.setOneLink(vtx1); vtx1.setOneLink(vtx10);
                vtx10.setOneLink(vtx2); vtx2.setOneLink(vtx10);
                vtx10.setOneLink(vtx9); vtx9.setOneLink(vtx10);
                vtx11.setOneLink(vtx4); vtx4.setOneLink(vtx11);
                vtx11.setOneLink(vtx8); vtx8.setOneLink(vtx11);
                vtx11.setOneLink(vtx10); vtx10.setOneLink(vtx11);
                vtx12.setOneLink(vtx6); vtx6.setOneLink(vtx12);
                vtx12.setOneLink(vtx8); vtx8.setOneLink(vtx12);

                //$$$eh


                //$$$begin
                let connect = new surfaceConnection.SurfaceConnectionProcess(mamesh);
                mamesh = connect.go();

                /** visualization **/

                /** visualisation basique **/
                let choiceVertexVizu = 0

                if(choiceVertexVizu == 0)
                {
                    let verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                    verticesViewer.go();
                }

                //$$$end



                // /** visualisation des différentes strates **/
                // if(choiceVertexVizu == 1)
                // {
                //     for (let i=0;i<strates.length;i++){
                //         let verticesViewer0 = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
                //         verticesViewer0.selectedVertices = strates[i]
                //         verticesViewer0.color = new Color(i)
                //         verticesViewer0.go()
                //     }
                // }

                // /** visualisation des normales **/
                // if(choiceVertexVizu == 2)
                // {
                //     var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                //
                //     var twoAxisCreator = new mathis.creation3D.TwoOrTreeAxis(this.mathisFrame.scene);
                //     twoAxisCreator.threeVersusTwoAxis = false;
                //     verticesViewer.meshModels = twoAxisCreator.go();
                //
                //     let positionings=new HashMap<Vertex,Positioning>()
                //     for (let i=0;i<mamesh.vertices.length;i++){
                //         let positioning=new Positioning()
                //         positioning.setOrientation(vertexToNormal.getValue(mamesh.vertices[i]),new XYZ(0,0,0))
                //         positionings.putValue(mamesh.vertices[i],positioning)
                //     }
                //     verticesViewer.positionings = positionings;
                //     verticesViewer.go();
                // }


                //$$$bh visualization

                var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.go();

                var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.go();

                //$$$eh
            }
        }
    }
}

