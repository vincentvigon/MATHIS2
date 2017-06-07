/**
 * Created by vigon on 21/11/2016.
 */
module mathis{

    export module appli{


        export class ReseauDocu implements OnePage{

            pageIdAndTitle="Reseaux (=nets)"
            severalParts:SeveralParts


            constructor(private mathisFrame:MathisFrame){
                let severalParts=new SeveralParts()

                severalParts.addPart(new RegularReseau2dPlusDocu(this.mathisFrame))

                severalParts.addPart(new Regular2dPlusWithLinesDocu(this.mathisFrame))
                //severalParts.addPart(new Regular2dTopo(this.mathisFrame))

                severalParts.addPart(new PolygonalResauDocu(this.mathisFrame))
                severalParts.addPart(new Regular3dReseauDocu(this.mathisFrame))


                severalParts.addPart(new RegularReseauDocu(this.mathisFrame))


                this.severalParts=severalParts
            }

            go(){
                return this.severalParts.go()
            }


        }

        class RegularReseau2dPlusDocu implements PieceOfCode{
            NAME="RegularReseau2dPlusDocu"
            TITLE="We draw a reseau (= net) which is contained in a predefined rectangle (drawn in black) "

            nbI = 5
            $$$nbI=new Choices([3,5,7,10,11,20,21,40])

            nbJ = 11
            $$$nbJ=new Choices([3,5,7,10,11,20,21,40])


            end=new XYZ(0.7,0.7,0)
            $$$end=new Choices([new XYZ(0.7,0.7,0),new XYZ(0,0,0),new XYZ(0.5,1,0)],{"before":"new mathis.XYZ"})

            setNBJ=false
            $$$setNBJ=[true,false]

            _nbVertices

            nbHorizontalDecays=0
            $$$nbHorizontalDecays=[0,1,2,3,4]

            nbVerticalDecays=0
            $$$nbVerticalDecays=[0,1,2,3,4]


            bend="flatFront"
            $$$bend=["flatFront","flatTurned","curved"]

            maille=reseau.Maille.quad
            $$$maille=new Choices(allIntegerValueOfEnume(reseau.Maille),{visualValues:allStringValueOfEnume(reseau.Maille)})

            oneMoreVertexForOddLine=false
            $$$oneMoreVertexForOddLine=[true,false]

            constructor(private mathisFrame:MathisFrame) {}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let creator = new reseau.Regular2dPlus()

                creator.nbU=this.nbI
                creator.nbV=this.nbJ
                /**if true: nbJ (or nbI) is computed to obtain regular triangle/square
                 * In particular, the reseau does not fit to the black rectangle*/
                creator.adaptUVForRegularReseau=this.setNBJ
                creator.origin=new XYZ(-0.7,-0.7,0)
                creator.end=this.end
                creator.maille=this.maille
                /**to get moresymetries when the  maille is triangle*/
                creator.oneMoreVertexForOddLine=this.oneMoreVertexForOddLine
                //n
                /**with some decays, the reseau is no more contains in the black rectangle*/
                creator.nbHorizontalDecays=this.nbHorizontalDecays
                creator.nbVerticalDecays=this.nbVerticalDecays



                //n
                let mamesh = creator.go()



                /** Reseaux are made to be bend */
                switch (this.bend){
                    case "flatFront":{}
                        break
                    case "flatTurned":{
                        for (var i=0;i<mamesh.vertices.length;i++){
                            let vertex=mamesh.vertices[i]
                            let u=vertex.position.x
                            let v=vertex.position.y
                            vertex.position.x=u
                            vertex.position.y=u+v
                            vertex.position.z=v
                        }
                    }
                        break
                    case "curved":{
                        for (var i=0;i<mamesh.vertices.length;i++){
                            let vertex=mamesh.vertices[i]
                            let u=vertex.position.x
                            let v=vertex.position.y
                            vertex.position.x=u
                            vertex.position.y=v
                            vertex.position.z=-(u*u+v*v)
                        }
                    }
                        break

                }




                //$$$end

                //$$$bt
                this._nbVertices=mamesh.vertices.length
                //$$$et

                //$$$bh visualization


                let cadreCrea=new reseau.Regular2d()
                cadreCrea.origine=creator.origin
                cadreCrea.dirU=new XYZ(0,creator.end.y-creator.origin.y,0)
                cadreCrea.dirV=new XYZ(creator.end.x-creator.origin.x,0,0)
                cadreCrea.nbU=2
                cadreCrea.nbV=2
                let cadreMamesh=cadreCrea.go()
                let cadreViewer=new visu3d.LinksViewer(cadreMamesh,this.mathisFrame.scene)
                cadreViewer.color=new Color(Color.names.black)
                cadreViewer.radiusProp=0.02
                cadreViewer.go()


                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }

        }


        class Regular2dPlusWithLinesDocu implements PieceOfCode{
            NAME="Regular2dPlusWithLinesDocu"
            TITLE="The class Regular2dPlus can also generate regularly spaced lines."

            nbI = 3
            $$$nbI=new Choices([2,3,5,10])

            nbJ = 3
            $$$nbJ=new Choices([2,3,5,10])


            end=new XYZ(0.7,0.7,0)
            $$$end=new Choices([new XYZ(0.7,0.7,0),new XYZ(0,0,0),new XYZ(0.5,1,0)],{"before":"new mathis.XYZ"})

            setNBJ=false
            $$$setNBJ=[true,false]


            nbSubinterval_I=3
            $$$nbSubinterval_I=[1,2,3,5,6,8,10]

            nbSubinterval_J=3
            $$$nbSubinterval_J=[1,2,3,5,6,8,10]

            nbHorizontalDecays=0
            $$$nbHorizontalDecays=[0,1,2,3,4]

            nbVerticalDecays=0
            $$$nbVerticalDecays=[0,1,2,3,4]

            makeLine=true
            $$$makeLine=[true,false]


            maille=reseau.Maille.quad
            $$$maille=new Choices(allIntegerValueOfEnume(reseau.Maille),{visualValues:allStringValueOfEnume(reseau.Maille)})


            _nbVertices
            _nbLines


            constructor(private mathisFrame:MathisFrame) {}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let creator = new reseau.Regular2dPlus()


                creator.nbU=this.nbI
                creator.nbV=this.nbJ
                creator.nbSubInterval_U=this.nbSubinterval_I
                creator.nbSubInterval_V=this.nbSubinterval_J

                creator.makeLine=this.makeLine

                creator.maille=this.maille

                //$$$end

                //$$$bh some hidden options
                creator.origin=new XYZ(-0.7,-0.7,0)
                creator.end=this.end
                /**if true: nbJ is computed to obtain regular triangle/square*/
                creator.adaptUVForRegularReseau=this.setNBJ
                creator.nbHorizontalDecays=this.nbHorizontalDecays
                creator.nbVerticalDecays=this.nbVerticalDecays
                //$$$eh

                //$$$begin
                let mamesh = creator.go()

                //$$$end


                //$$$bh visualization


                var mainVertices=[]
                var secondaryVertices=[]
                for (var i=0;i<mamesh.vertices.length;i++){
                    var vert=mamesh.vertices[i]
                    if (vert.dichoLevel==0) mainVertices.push(vert)
                    else secondaryVertices.push(vert)
                }




                var viewerMainVertices=  new visu3d.VerticesViewer(mainVertices, this.mathisFrame.scene)
                viewerMainVertices.go()
                var viewerSecondaryVertices=  new visu3d.VerticesViewer(secondaryVertices, this.mathisFrame.scene)
                viewerSecondaryVertices.color=new Color(Color.names.blanchedalmond)
                viewerSecondaryVertices.go()

                if(mamesh.lines!=null) new visu3d.LinesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh



                //$$$bt
                this._nbVertices=mamesh.vertices.length
                this._nbLines=(mamesh.lines==null)? 0 : mamesh.lines.length
                //$$$et

            }

        }


        class Regular2dTopo implements PieceOfCode{
            NAME="Regular2dTopo"
            TITLE="The class Regular2dPlus allows to create surface with non-flat topology."

            nbI = 20
            $$$nbI=new Choices([4,5,10,11,20,21,40,41,60,61])

            nbJ = 20
            $$$nbJ=new Choices([4,5,10,11,20,21,40,41,60,61])



            shape="a bit curved"
            $$$shape=["a bit curved","flat","natural"]


            topology=reseau.Topology.flat
            $$$topology=new Choices(allIntegerValueOfEnume(reseau.Topology),{visualValues:allStringValueOfEnume(reseau.Topology)})


            maille=reseau.Maille.quad
            $$$maille=new Choices(allIntegerValueOfEnume(reseau.Maille),{visualValues:allStringValueOfEnume(reseau.Maille)})

            _nbVertices
            _nbLines


            constructor(private mathisFrame:MathisFrame) {}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let creator = new reseau.Regular2dPlus()


                creator.nbU=this.nbI
                creator.nbV=this.nbJ
                creator.maille=this.maille
                creator.origin=new XYZ(-0.5,-0.5,0)
                creator.end=new XYZ(0.5,0.5,0)
                //$$$end



                //$$$begin


                creator.topology=this.topology


                switch (this.shape){
                    case "a bit curved":
                        var mamesh = creator.go()
                        for (var i = 0; i < mamesh.vertices.length; i++) {
                            var vertex = mamesh.vertices[i]
                            vertex.position.z = -(vertex.position.x ** 2 + vertex.position.y ** 2)
                        }
                        break
                    case "flat":
                        var mamesh = creator.go()
                        break
                    case "natural":
                        creator.flatVersusNaturalShape=false
                        var mamesh = creator.go()
                        break
                }
                /**NB: when maille are non-quad and when topology is non-flat :
                 * to stick together triangles, you have to be careful of the parity of nbI/nbJ,
                 * moreover sometimes, lines are very strange*/




                //$$$end










                //$$$bh visualization



                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                let lineViewer=new visu3d.LinesViewer(mamesh, this.mathisFrame.scene)
                //lineViewer.constantRadius=0.005

                lineViewer.interpolationOption.interpolationStyle=geometry.InterpolationStyle.hermite
                lineViewer.go()


                let  surfaceViewer=new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene)
                surfaceViewer.normalDuplication=visu3d.NormalDuplication.none
                surfaceViewer.go()

                //$$$eh



                //$$$bt
                this._nbVertices=mamesh.vertices.length
                this._nbLines=(mamesh.lines==null)? 0 : mamesh.lines.length
                //$$$et

            }

        }


        class RegularReseauDocu implements PieceOfCode{
            NAME="RegularReseauDocu"
            TITLE="This more elementary class is used to build the RegularReseau2dPlus. But " +
                "it can also be useful."

            nbI = 3
            $$$nbI=[3,5,7]

            oneMoreVertexForOddLine=false
            $$$oneMoreVertexForOddLine=[true,false]

            squareMaille=true
            $$$squareMaille=[true,false]


            Vj=new XYZ(0,0.2,0)
            $$$Vj=new Choices([new XYZ(0,0.2,0),new XYZ(0.05,0.2,0)],{"before":"new mathis.XYZ"})

            _nbVertices:number
            _nbTriangles:number
            _nbSquares:number


            constructor(private mathisFrame:MathisFrame) {

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let creator = new reseau.Regular2d()
                /** Vi and Vj form the basis of the reseau.
                 * For square net, points are i*Vi + j*Vj
                 * For triangular net, points are :
                 *  i*Vi + (j+decay)*Vj where decay=0.5 when j is odd*/
                creator.nbU = this.nbI
                creator.nbV = 4
                creator.dirU = new XYZ(0.2, 0, 0)
                creator.dirV = this.Vj
                creator.origine = new XYZ(-0.7, -0.7, 0)
                //n
                creator.squareVersusTriangleMaille = this.squareMaille
                /**true-> square net, false->triangular net*/
                creator.oneMoreVertexForOddLine = this.oneMoreVertexForOddLine

                //n
                let mamesh = creator.go()
                //$$$end


                //$$$bh visualization
                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh


                //$$$bt
                this._nbVertices=mamesh.vertices.length
                this._nbSquares=mamesh.smallestSquares.length
                this._nbTriangles=mamesh.smallestTriangles.length
                //$$$et
            }

        }






        //TODO
        //
        // class Regular2dTopo implements PieceOfCode{
        //     NAME="Regular2dTopo"
        //     TITLE="The class Regular2dPlus allow to create surface with non-flat topology."
        //
        //     nbI = 20
        //     $$$nbI=new Choices([5,10,20,40,60])
        //
        //     nbJ = 20
        //     $$$nbJ=new Choices([5,10,20,40,60])
        //
        //     squareMaille=true
        //     $$$squareMaille=new Choices([true,false])
        //
        //
        //
        //     setNBJ=true
        //     $$$setNBJ=[true,false]
        //
        //
        //     nbIBands=5
        //     $$$nbIBands=[0,1,2,3,5,6,8,10]
        //
        //     nbJBands=5
        //     $$$nbJBands=[0,1,2,3,5,6,8,10]
        //
        //     nbHorizontalDecays=0
        //     $$$nbHorizontalDecays=[0,1,2,3,4]
        //
        //     nbVerticalDecays=0
        //     $$$nbVerticalDecays=[0,1,2,3,4]
        //
        //
        //
        //     drawOnlyVerticesAtLineIntersection=false
        //     $$$drawOnlyVerticesAtLineIntersection=[false,true]
        //
        //
        //     adapt_nbInbJ_forBandRegularity=true
        //     $$$adapt_nbInbJ_forBandRegularity=[true,false]
        //
        //
        //
        //
        //     bend="flat topology"
        //     $$$bend=["flat topology","cylinder topology","moebius topology","torus topology","klein topology"]
        //
        //     shape=0
        //     $$$shape=[0,1,2]
        //
        //     shapeCyl="a bit curved"
        //     $$$shapeCyl=["a bit curved","cylinder","double twist"]
        //
        //     shapeMoeb="a bit curved"
        //     $$$shapeMoeb=["a bit curved","moebius band","tripple twist"]
        //
        //     shapeTorus="a bit curved"
        //     $$$shapeTorus=["a bit curved","torus"]
        //
        //     shapeKlein="a bit curved"
        //     $$$shapeKlein=["a bit curved","klein bagel","klein bottle"]
        //
        //
        //     _nbVertices
        //     _nbLines
        //
        //
        //     constructor(private mathisFrame:MathisFrame) {}
        //
        //     goForTheFirstTime(){
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //         this.go()
        //     }
        //
        //     go() {
        //
        //         this.mathisFrame.clearScene(false,false)
        //
        //         //$$$begin
        //         let creator = new reseau.Regular2dPlus()
        //
        //
        //         creator.nbI=this.nbI
        //         creator.nbJ=this.nbJ
        //
        //         creator.squareMailleInsteadOfTriangle=this.squareMaille
        //
        //         //$$$end
        //
        //         //$$$bh some hidden options
        //         creator.origin=new XYZ(-0.5,-0.5,0)
        //         creator.end=new XYZ(0.5,0.5,0)
        //         /**if true: nbJ is computed to obtain regular triangle/square*/
        //         creator.set_nbJ_toHaveRegularReseau=this.setNBJ
        //         creator.nbHorizontalDecays=this.nbHorizontalDecays
        //         creator.nbVerticalDecays=this.nbVerticalDecays
        //         //$$$eh
        //
        //         //$$$begin
        //
        //
        //
        //
        //
        //         var X
        //         var Y
        //         var Z
        //         var pi=Math.PI
        //         var sin=Math.sin
        //         var cos=Math.cos
        //         /** Reseaux are made to be bend */
        //
        //         switch (this.bend){
        //             case "flat topology":{
        //                 switch (this.shape){
        //                     case 0:
        //                         X=function(u,v){return u}
        //                         Y=function(u,v){return v}
        //                         Z=function(u,v){return -(u*u+v*v)}
        //                         break
        //                     case 1:
        //                         X=function(u,v){return v*Math.cos(pi*u)}
        //                         Y=function(u,v){return u}
        //                         Z=function(u,v){return v*Math.sin(pi*u)}
        //                         break
        //                     case 2:
        //                         X=function(u,v){return u}
        //                         Y=function(u,v){return Math.exp(u)}
        //                         Z=function(u,v){return v}
        //                         break
        //                 }
        //
        //             }
        //                 break
        //
        //
        //             case "cylinder topology":{
        //                 creator.topology=reseau.Topology.cylinder
        //                 switch (this.shapeCyl){
        //                     case "a bit curved":
        //                         X=function(u,v){return u}
        //                         Y=function(u,v){return v}
        //                         Z=function(u,v){return -(u*u+v*v)}
        //
        //                         break
        //                     case "cylinder":
        //                         creator.flatVersusNaturalShape=false
        //                         // X=function(u,v){return Math.cos(2*pi*u)}
        //                         // Y=function(u,v){return v}
        //                         // Z=function(u,v){return Math.sin(2*pi*u)}
        //                         break
        //                     case "double twist":
        //                         X=function(u,v){return (1-1*v*Math.sin(2*pi*u))*Math.sin(2*pi*u)}
        //                         Y=function(u,v){return (1-1*v*Math.sin(2*pi*u))*Math.cos(2*pi*u)}
        //                         Z=function(u,v){return v*Math.cos(2*pi*u)}
        //                         break
        //                 }
        //
        //             }
        //                 break
        //
        //
        //             case "moebius topology":{
        //                 creator.topology=reseau.Topology.moebius
        //
        //                 switch (this.shapeMoeb){
        //                     case "a bit curved":
        //                         X=function(u,v){return u}
        //                         Y=function(u,v){return v}
        //                         Z=function(u,v){return -(u*u+v*v)}
        //                         break
        //                     case "moebius band":
        //                         creator.flatVersusNaturalShape=false
        //
        //                         // X=function(u,v){return (1-1*v*Math.sin(pi*u))*Math.sin(2*pi*u)}
        //                         // Y=function(u,v){return (1-1*v*Math.sin(pi*u))*Math.cos(2*pi*u)}
        //                         // Z=function(u,v){return v*Math.cos(pi*u)}
        //                         break
        //                     case "tripple twist":
        //                         X=function(u,v){return (1-1*v*Math.sin(pi*u))*Math.sin(2*pi*u)}
        //                         Y=function(u,v){return (1-1*v*Math.sin(pi*u))*Math.cos(2*pi*u)}
        //                         Z=function(u,v){return v*Math.cos(pi*u)}
        //                         break
        //                 }
        //
        //             }
        //                 break
        //
        //             case "torus topology":{
        //                 creator.topology=reseau.Topology.torus
        //
        //
        //                 switch (this.shapeTorus){
        //                     case "a bit curved":
        //                         X=function(u,v){return u}
        //                         Y=function(u,v){return v}
        //                         Z=function(u,v){return -(u*u+v*v)}
        //                         break
        //                     case "torus":
        //                         creator.flatVersusNaturalShape=false
        //
        //                         // X=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.sin(2*pi*u)}
        //                         // Y=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.cos(2*pi*u)}
        //                         // Z=function(u,v){return 2*v*Math.cos(pi*u)}
        //                         break
        //                     // case "tripple twist":
        //                     //     X=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.sin(2*pi*u)}
        //                     //     Y=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.cos(2*pi*u)}
        //                     //     Z=function(u,v){return 2*v*Math.cos(pi*u)}
        //                     //     break
        //                 }
        //
        //             }
        //                 break
        //
        //             case "klein topology":{
        //                 creator.topology=reseau.Topology.klein
        //
        //                 switch (this.shapeKlein){
        //                     case "a bit curved":
        //                         X=function(u,v){return u}
        //                         Y=function(u,v){return v}
        //                         Z=function(u,v){return -(u*u+v*v)}
        //                         break
        //                     case "klein bagel":
        //                         creator.flatVersusNaturalShape=false
        //                         // X=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.sin(2*pi*u)}
        //                         // Y=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.cos(2*pi*u)}
        //                         // Z=function(u,v){return 2*v*Math.cos(pi*u)}
        //                         break
        //                     // case "tripple twist":
        //                     //     X=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.sin(2*pi*u)}
        //                     //     Y=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.cos(2*pi*u)}
        //                     //     Z=function(u,v){return 2*v*Math.cos(pi*u)}
        //                     //     break
        //
        //                     case "klein bottle":
        //
        //                         // X= function(u,v){return -2/15*Math.cos(u) * (3 *Math.cos(v) -30*Math.sin(u)+90 *(Math.cos(u))**4 *Math.sin(u)
        //                         //     -60 *Math.cos(u)**6 *Math.sin(u)+5 *Math.cos(u) *Math.cos(v) *Math.sin(u)) }
        //                         //
        //                         // Y= function(u,v){return -1/15  *Math.sin (u) *(3 *Math.cos(v)-3 *Math.cos(u)**2 *Math.cos(v)-48 *Math.cos(u)**4 *Math.cos(v)+ 48 *Math.cos(u)**6
        //                         //     + Math.cos(v)-60 *Math.sin(u)+5 *Math.cos(u) *Math.cos(v) *Math.sin(u)-5 *Math.cos(u)**3 *Math.cos(v) *Math.sin(u)-80
        //                         //     + Math.cos(u)**5 *Math.cos(v) *Math.sin(u)+80 *Math.cos(u)**7 *Math.cos(v) *Math.sin(u)) }
        //                         //
        //                         // Z= function(u,v){return 2/15 *  (3+5 *Math.cos(u) *Math.sin(u)) *Math. sin(v)}
        //
        //
        //                         X= function(u,v){
        //                             u=2*pi*u
        //                             v=2*pi*v
        //                             return -(2/15)*cos(u)*(3*cos(v)-30*sin(u)+90*cos(u)**4.*sin(u)- 60*cos(u)**6.*sin(u)+5*cos(u)*cos(v)*sin(u))}
        //                         Y= function(u,v){
        //                             u=2*pi*u
        //                             v=2*pi*v
        //                             return -(1/15)*sin(u)*(3*cos(v)-3*cos(u)**2.*cos(v)-48*cos(u)**4.*cos(v)+48*cos(u)**6.*cos(v)-60*sin(u)+5*cos(u)*cos(v)*sin(u)
        //                         -5*cos(u)**3.*cos(v)*sin(u) -80*cos(u)**5.*cos(v)*sin(u)+80*cos(u)**7*cos(v)*sin(u))}
        //                         Z= function(u,v){
        //                             u=2*pi*u
        //                             v=2*pi*v
        //                             return (2/15)*(3+5*cos(u)*sin(u))*sin(v)}
        //
        //
        //
        //
        //                         break
        //
        //                 }
        //
        //             }
        //                 break
        //
        //
        //
        //         }
        //
        //
        //         let mamesh = creator.go()
        //         let drawOnlyVerticesAtLineIntersection=this.drawOnlyVerticesAtLineIntersection
        //
        //
        //         if (X!=null) {
        //             for (var i = 0; i < mamesh.vertices.length; i++) {
        //                 let vertex = mamesh.vertices[i]
        //                 let u = vertex.position.x
        //                 let v = vertex.position.y
        //                 vertex.position.x = X(u, v)
        //                 vertex.position.y = Y(u, v)
        //                 vertex.position.z = Z(u, v)
        //             }
        //         }
        //
        //
        //
        //
        //
        //
        //
        //         //$$$end
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //         //$$$bh visualization
        //
        //
        //
        //
        //         new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
        //         let lineViewer=new visu3d.LinesViewer(mamesh, this.mathisFrame.scene)
        //
        //         lineViewer.interpolationOption.interpolationStyle=geometry.InterpolationStyle.hermite
        //         lineViewer.go()
        //
        //
        //         new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
        //         //$$$eh
        //
        //
        //
        //         //$$$bt
        //         this._nbVertices=mamesh.vertices.length
        //         this._nbLines=(mamesh.lines==null)? 0 : mamesh.lines.length
        //         //$$$et
        //
        //     }
        //
        // }
        //







        class PolygonalResauDocu implements PieceOfCode{
            nbSides=7
            $$$nbSides=new Choices([3,4,5,6,7,9,11])

            nbSubdivisionsInARadius=3
            $$$nbSubdivisionsInARadius=new Choices([1,2,3,4,5])

            NAME="PolygonalResauDocu"
            TITLE="Polygonal reseau"

            _nbVertices




            constructor(private mathisFrame:MathisFrame) {

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }


            go() {


                this.mathisFrame.clearScene(false,false)


                //$$$begin
                /**for triangles, with no vertex at the center, use "reseau.TriangulatedTriangle"*/
                let creator = new reseau.TriangulatedPolygone(this.nbSides)
                creator.nbSubdivisionInARadius=this.nbSubdivisionsInARadius
                creator.origin=new XYZ(-1,-1,0)
                creator.end=new XYZ(1,1,0)
                let mamesh = creator.go()
                //$$$end

                //$$$bt
                this._nbVertices=mamesh.vertices.length
                //$$$et

                //$$$bh visualization
                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }

        }


        class Regular3dReseauDocu implements PieceOfCode{

            NAME="Regular3dReseauDocu"
            TITLE="A 3d reseau now"


            Vj=new XYZ(0,0.2,0)
            $$$Vj=new Choices([new XYZ(0,0.2,0),new XYZ(0.05,0.2,0)],{"before":"new mathis.XYZ"})

            nbI=4
            $$$nbI=new Choices([4,6,8])
            decayOddStrates=false
            $$$decayOddStrates=new Choices([true,false])
            interStrateMailleAreSquareVersusTriangle=true
            $$$interStrateMailleAreSquareVersusTriangle=new Choices([true,false])
            strateHaveSquareMailleVersusTriangleMaille=true
            $$$strateHaveSquareMailleVersusTriangleMaille=new Choices([true,false])

            _nbVertices
            _nbLinks

            constructor(private mathisFrame:MathisFrame) {

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false,false)


                //$$$begin
                let creator = new reseau.Regular3D()
                creator.nbU = this.nbI
                creator.nbJ = 4
                creator.nbW = 5
                creator.dirU = new XYZ(0.2, 0,   0)
                creator.dirV = this.Vj
                creator.dirW = new XYZ(0,   0,   0.2)
                creator.origine = new XYZ(-0.7, -0.7, -0.7)
                //n

                creator.decayOddStrates=this.decayOddStrates
                creator.interStrateMailleAreSquareVersusTriangle=this.interStrateMailleAreSquareVersusTriangle
                creator.strateHaveSquareMailleVersusTriangleMaille=this.strateHaveSquareMailleVersusTriangleMaille
                //n

                let mamesh = creator.go()
                //$$$end

                //$$$bt
                this._nbVertices=mamesh.vertices.length
                this._nbLinks=0
                for (let vertex of mamesh.vertices){
                    this._nbLinks+=vertex.links.length
                }
                //$$$et


                //$$$bh visualization
                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }

        }



















    }



}