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
                creator.nbU=this.nbI
                creator.nbV=this.nbJ
                creator.nbSubInterval_U=this.nbSubInterval_I
                creator.nbSubInterval_V=this.nbSubInterval_J
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
            TITLE="Here is a list (to be increase) of famous surfaces. Some equations are memorized in the equation-module of Mathis."


            nbI=10
            $$$nbI=[5,10,15]
            nbJ=10
            $$$nbJ=[5,10,15]

            nbSubInterval_I=10
            $$$nbSubInterval_I=[1,5,10]
            nbSubInterval_J=10
            $$$nbSubInterval_J=[1,5,10]

            surfaceName='twist'
            $$$surfaceName=['twist','Klein bottle','Cross Capped Disk']

            nbTwist=2
            $$$nbTwist=[1,2,3,4]


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
                creator.nbU=this.nbI
                creator.nbV=this.nbJ
                creator.nbSubInterval_U=this.nbSubInterval_I
                creator.nbSubInterval_V=this.nbSubInterval_J



                let X,Y,Z
                var sin=Math.sin,cos=Math.cos,PI=Math.PI
                let rangeU,rangeV

                switch (this.surfaceName){

                    case ('twist'):{
                        rangeU=[-PI,PI]
                        rangeV=[-0.5,0.5]
                        var nbTwists=this.nbTwist
                        X=function(u,v){return (1-1*v*sin(u/2*nbTwists))*sin(u)}
                        Y=function(u,v){return (1-1*v*sin(u/2*nbTwists))*cos(u)}
                        Z=function(u,v){return 1*v*cos(u/2*nbTwists)}
                    }
                    break

                    case ('Klein bottle'):{
                        rangeU=[-PI,PI]
                        rangeV=[-PI,PI]
                        let eq=new equations.KleinBottle()
                        X=eq.X
                        Y=eq.Y
                        Z=eq.Z
                    }
                    break

                    case ('Cross Capped Disk'):{
                        rangeU=[0,2*PI]
                        rangeV=[0,2*PI]
                        X = (u, v) =>(1+cos(v))*cos(u)
                        Y= (u, v) => (1+cos(v))*sin(u)
                        Z= (u, v) => specialFunctions.tanh(u-PI)*sin(v)
                    }


                }
                creator.origin=new XYZ(rangeU[0],rangeV[0],0)
                creator.end=new XYZ(rangeU[1],rangeV[1],0)
                let mamesh=creator.go()




                for (let  i=0;i<mamesh.vertices.length;i++){
                    let vertex=mamesh.vertices[i]
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=X(u,v)
                    vertex.position.y=Y(u,v)
                    vertex.position.z=Z(u,v)
                }


                //$$$end


                let lineViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                lineViewer.radiusAbsolute=0.01
                lineViewer.go()
                new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene).go()
                //new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene).go()



            }

        }





























    }



}