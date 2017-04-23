

module mathis{

    export module documentation{


        export class ArchimedeDocu implements OnePage{
            pageIdAndTitle="remarkable solids"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame){
                let several=new SeveralParts()
                several.addPart(new ArchimedePieceDocu(this.mathisFrame))
                this.severalParts=several
            }

            go(){
                return this.severalParts.go()
            }

        }

        class ArchimedePieceDocu implements PieceOfCode{

            $$$name="WhatAreArchimedianSolids"
            $$$title="Several ways to create an Archedian Solid !"

            polyhedronType=creation3D.ArchimedeanSolidType.TruncatedIcosidodecahedron
            $$$polyhedronType=new Choices(allIntegerValueOfEnume(creation3D.ArchimedeanSolidType),{visualValues:allStringValueOfEnume(creation3D.ArchimedeanSolidType)})

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

                /**NE PAS TOUCHER*/
                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let polyArch = new creation3D.ArchimedeanSolid(this.polyhedronType);
                let mamesh = polyArch.go();
                //$$$end


                //$$$bh visualization

                let verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.go();

                let linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.go();

                let surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.go();
                //$$$eh

            }
        }
    }
}

