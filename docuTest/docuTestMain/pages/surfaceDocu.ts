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

                severalParts.addPart(new ManyOtherSurfacesDocu(this.mathisFrame))

                this.severalParts=severalParts
            }

            go(){
                return this.severalParts.go()
            }


        }

        //
        // class DeformedReseau implements PieceOfCode{
        //
        //     NO_TEST=true
        //
        //     NAME="DeformedReseau"
        //     TITLE="Pushing up a reseau to make a surface"
        //
        //     linesVersusLinks=true
        //     $$$linesVersusLinks=[true,false]
        //
        //     functionChoice=0
        //     $$$functionChoice=[0,1,2]
        //
        //     _toto=3
        //
        //     // func=(v)=>new XYZ(v.x,v.x*v.y,v.y)
        //     // $$$func=new Choices([
        //     //     (v)=>new XYZ(v.x,v.x*v.y,v.y),
        //     //     (v)=>new XYZ(v.x,0.5*Math.sin(5*v.x),v.y)
        //     // ])
        //
        //     constructor(private mathisFrame:MathisFrame){}
        //
        //     goForTheFirstTime(){
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //
        //         this.go()
        //     }
        //
        //     go(){
        //
        //         this.mathisFrame.clearScene(false,false)
        //
        //         //$$$begin
        //         let creator = new reseau.TriangulatedPolygone(10)
        //         creator.nbSubdivisionInARadius=5
        //         creator.origin=new XYZ(-1,-1,0)
        //         creator.end=new XYZ(1,1,0)
        //         let mamesh = creator.go()
        //
        //         var functionChoice=this.functionChoice
        //         if (functionChoice==0) var func=function(vec){return new XYZ(vec.x,vec.x*vec.y,vec.y)}
        //         else if (functionChoice==1) var func=function(vec){return new XYZ(vec.x,0.5*Math.sin(5*vec.x),vec.y)}
        //         else if (functionChoice==2) var func=function(vec){return new XYZ(Math.cos(vec.x)-1,0.5*Math.sin(5*vec.x),vec.y)}
        //
        //
        //         for (let i=0;i<mamesh.vertices.length;i++){
        //             let vertex=mamesh.vertices[i]
        //             vertex.position=func(vertex.position)
        //         }
        //
        //         let lineVersusLinks=this.linesVersusLinks
        //         if (lineVersusLinks){
        //             /**coloring can be improve (e.g. using symmetries, and better hue variations. see further)*/
        //             new visu3d.LinesViewer(mamesh, this.mathisFrame.scene).go()
        //         }
        //         else{
        //             new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()}
        //
        //         new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
        //         //$$$end
        //
        //
        //
        //
        //     }
        //
        //
        //
        // }



        class HelicoidDocu implements PieceOfCode{

            NO_TEST=true

            NAME="HelicoidDocu"
            TITLE="An helicoid."

            a=0.2
            $$$a=[0.1,0.2,1]
            
            nbI=10
            $$$nbI=[5,10,15]
            nbJ=10
            $$$nbJ=[5,10,15]

            nbSubInterval_I=5
            $$$nbSubInterval_I=[1,5,10]
            nbSubInterval_J=5
            $$$nbSubInterval_J=[1,5,10]

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




                let creator=new reseau.Regular2dPlus()
                creator.makeLine=true
                creator.nbI=this.nbI
                creator.nbJ=this.nbJ
                creator.nbSubInterval_I=this.nbSubInterval_I
                creator.nbSubInterval_J=this.nbSubInterval_J
                creator.origin=new XYZ(-Math.PI,-1,0)
                creator.end=new XYZ(Math.PI,1,0)
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

                let lineViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                lineViewer.radiusAbsolute=0.01
                    lineViewer.go()
                new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene).go()
                new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene).go()
                
                //$$$end

                
            }

        }







        class ManyOtherSurfacesDocu implements PieceOfCode{

            NO_TEST=true

            NAME="ManyOtherSurfacesDocu"
            TITLE="Here is a list of famous surfaces, whose equation are written in the equation-module"

            a=0.2
            $$$a=[0.1,0.2,1]

            nbI=10
            $$$nbI=[5,10,15]
            nbJ=10
            $$$nbJ=[5,10,15]

            nbSubInterval_I=5
            $$$nbSubInterval_I=[1,5,10]
            nbSubInterval_J=5
            $$$nbSubInterval_J=[1,5,10]

            surfaceName=['boyd']

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




                let creator=new reseau.Regular2dPlus()
                creator.makeLine=true
                creator.nbI=this.nbI
                creator.nbJ=this.nbJ
                creator.nbSubInterval_I=this.nbSubInterval_I
                creator.nbSubInterval_J=this.nbSubInterval_J
                creator.origin=new XYZ(-Math.PI,-1,0)
                creator.end=new XYZ(Math.PI,1,0)
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

                let lineViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                lineViewer.radiusAbsolute=0.01
                lineViewer.go()
                new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene).go()
                new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene).go()

                //$$$end


            }

        }





























    }



}