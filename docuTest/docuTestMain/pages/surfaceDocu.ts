/**
 * Created by vigon on 22/12/2016.
 */


/**
 * Created by vigon on 21/11/2016.
 */
module mathis{

    export module appli{


        export class SurfaceDocu implements OnePage{
            
            pageIdAndTitle="Surfaces from reseaux"
            severalParts:SeveralParts


            constructor(private mathisFrame:MathisFrame){
                let severalParts=new SeveralParts()

                severalParts.addPart(new HelicoidDocu(this.mathisFrame))

                severalParts.addPart(new DeformedReseau(this.mathisFrame))

                this.severalParts=severalParts
            }

            go(){
                return this.severalParts.go()
            }


        }


        class DeformedReseau implements PieceOfCode{

            NO_TEST=true

            NAME="DeformedReseau"
            TITLE="Pushing up a reseau to make a surface"

            linesVersusLinks=true
            $$$linesVersusLinks=[true,false]

            functionChoice=0
            $$$functionChoice=[0,1,2]

            _toto=3

            // func=(v)=>new XYZ(v.x,v.x*v.y,v.y)
            // $$$func=new Choices([
            //     (v)=>new XYZ(v.x,v.x*v.y,v.y),
            //     (v)=>new XYZ(v.x,0.5*Math.sin(5*v.x),v.y)
            // ])

            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let creator = new reseau.TriangulatedPolygone(10)
                creator.nbSubdivisionInARadius=5
                creator.origin=new XYZ(-1,-1,0)
                creator.end=new XYZ(1,1,0)
                let mamesh = creator.go()

                var functionChoice=this.functionChoice
                if (functionChoice==0) var func=function(vec){return new XYZ(vec.x,vec.x*vec.y,vec.y)}
                else if (functionChoice==1) var func=function(vec){return new XYZ(vec.x,0.5*Math.sin(5*vec.x),vec.y)}
                else if (functionChoice==2) var func=function(vec){return new XYZ(Math.cos(vec.x)-1,0.5*Math.sin(5*vec.x),vec.y)}


                for (let i=0;i<mamesh.vertices.length;i++){
                    let vertex=mamesh.vertices[i]
                    vertex.position=func(vertex.position)
                }

                let lineVersusLinks=this.linesVersusLinks
                if (lineVersusLinks){
                    /**coloring can be improve (e.g. using symmetries, and better hue variations. see further)*/
                    new visu3d.LinesViewer(mamesh, this.mathisFrame.scene).go()
                }
                else{
                    new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()}

                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$end




            }



        }



        class HelicoidDocu implements PieceOfCode{

            NO_TEST=true

            NAME="HelicoidDocu"
            TITLE="We create an helicoid. Best representation can de done with more vertices, but in this case, " +
                "to be esthetic, do not draw all the lines (see section in line visualization for line selection)"

            a=0.2
            $$$a=[0.1,0.2,1]
            
            nbI=10
            $$$nbI=[5,10,20]
            nbJ=20
            $$$nbJ=[10,20,40]

            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)

                //$$$begin


                let basis=new reseau.BasisForRegularReseau()
                basis.nbI=this.nbI
                basis.nbJ=this.nbJ
                basis.origin=new XYZ(-Math.PI,-1,0)
                basis.end=new XYZ(Math.PI,1,0)

                let creator=new reseau.Regular(basis)
                let mamesh=creator.go()

                let a=this.a
                for (let  i=0;i<mamesh.vertices.length;i++){
                    let vertex=mamesh.vertices[i]
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=v*Math.cos(u)
                    vertex.position.y=a*u
                    vertex.position.z=v*Math.sin(u)
                }

                new visu3d.LinesViewer(mamesh,this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene).go()
                
                //$$$end

                
            }



        }















    }



}