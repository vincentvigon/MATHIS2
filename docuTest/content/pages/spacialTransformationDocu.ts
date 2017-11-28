/**
 * Created by vigon on 11/09/2017.
 */


/**
 * Created by vigon on 05/06/2017.
 */



module mathis {
    export module appli {

        export class SpacialTransformation implements OnePage {

            pageIdAndTitle = "Spacial transformations "
            severalParts: SeveralParts

            constructor(private mathisFrame: MathisFrame) {
                let several = new SeveralParts()
                several.addPart(new AffineTransformationTetrahedron(this.mathisFrame))

                several.addPart(new AffineTransformationOfTriangle(this.mathisFrame))
                several.addPart(new SkewTransformOfQuad(this.mathisFrame))



                this.severalParts = several
            }
            go() {
                return this.severalParts.go()
            }
        }




        class AffineTransformationTetrahedron implements PieceOfCode{
            NAME="AffineTransformationTetrahedron"
            TITLE="Affine transformation for tetrahedron: determined by 4 starting points and 4 arrival points (first ones are origin)"


            viaVerticesVersusPositions="via_vertices"
            $$$viaVerticesVersusPositions=["via_vertices","via_positions"]


            doTransform=true
            $$$doTransform=[true,false]

            constructor(private mathisFrame:MathisFrame) {}

            /**This method is fired when we enter  in this piece of code (eg. when play button is pushed)*/
            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }
            /**This method is fired each time one of the configuration parameters change */
            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin

                /**Mamesh that we will transform*/

                let creator=new reseau.Regular3D()
                creator.nbU=3
                creator.nbV=3
                creator.nbW=3
                creator.origine=new XYZ(-0.75,0,0.2)//new XYZ(-0.5,0,-0.2)
                creator.dirU=new XYZ(0.5,0,0)
                creator.dirV=new XYZ(0,0.5,0)
                creator.dirW=new XYZ(0,0.,0.5)


                let mamesh=creator.go()

                /**the three starting points of the transformation*/
                let v0=XYZ.newFrom(creator.origine)
                let v1=XYZ.newFrom(creator.dirU).scale(creator.nbU-1).add(creator.origine)
                let v2=XYZ.newFrom(creator.dirV).scale(creator.nbV-1).add(creator.origine)
                let v3=XYZ.newFrom(creator.dirW).scale(creator.nbW-1).add(creator.origine)


                /**the three arrival points of the transformation*/
                let w0=new XYZ(0.5,0,0)
                let w1=new XYZ(1,0,0.3)
                let w2=new XYZ(1,1.5,0)
                let w3=new XYZ(0,0.5,1)

                //$$$end



                //$$$bc

                let doTransform=this.doTransform
                switch (this.viaVerticesVersusPositions) {
                    case "via_vertices": {
                        if(doTransform)spacialTransformations.affineTransformation_4vec(mamesh.vertices, v0, v1, v2,v3, w0, w1, w2,w3)
                    }
                        break
                    case "via_positions":{
                        let positions:XYZ[]=[]
                        for (let vert of mamesh.vertices) positions.push(vert.position)
                        if(doTransform) spacialTransformations.affineTransformation_4vec(positions,v0, v1, v2,v3, w0, w1, w2,w3)

                    }
                }
                //$$$ec



                //$$$bh visualization
                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()


                let pointsViewer=(a0,a1,a2,a3,color:string)=>{
                    let arrivalPoints=new Mamesh()
                    arrivalPoints.newVertex(a0)
                    arrivalPoints.newVertex(a1)
                    arrivalPoints.newVertex(a2)
                    arrivalPoints.newVertex(a3)

                    let arrivalPointsViewer=new visu3d.VerticesViewer(arrivalPoints,this.mathisFrame.scene)
                    arrivalPointsViewer.radiusAbsolute=0.07
                    arrivalPointsViewer.color=new Color(color)
                    arrivalPointsViewer.go()
                }
                pointsViewer(v0,v1,v2,v3,Color.names.black)
                pointsViewer(w0,w1,w2,w3,Color.names.blue)




                new creation3D.TwoOrTreeAxis(this.mathisFrame.scene).go()



                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }
        }



        class AffineTransformationOfTriangle implements PieceOfCode{
            NAME="AffineTransformationOfTriangle"
            TITLE="Affine transformation of a triangle: determined by 3 starting points and 3 arrival points (first ones are origins)"

            nbI = 3
            $$$nbI=[3,5,7]

            viaVerticesVersusPositions="via_vertices"
            $$$viaVerticesVersusPositions=["via_vertices","via_positions"]

            squareVersusTriangle="triangle"
            $$$squareVersusTriangle=["triangle","square"]

            doTransform=true
            $$$doTransform=[true,false]

            constructor(private mathisFrame:MathisFrame) {}

            /**This method is fired when we enter  in this piece of code (eg. when play button is pushed)*/
            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }
            /**This method is fired each time one of the configuration parameters change */
            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin

                /**Mamesh that we will transform*/
                let mamesh:Mamesh

                /**the three starting points of the transformation.*/
                let v0, v1, v2:XYZ

                //$$$end


                //$$$bc


                switch (this.squareVersusTriangle) {
                    case "triangle": {
                        /**we create a triangle, then v0,v1,v2 will be the corners of this triangle.*/
                        let creator=new reseau.TriangulatedTriangle()
                        mamesh=creator.go()
                        let corner=[]
                        for (let vert of mamesh.vertices) if (vert.hasMark(Vertex.Markers.corner)) corner.push(vert)
                        v0=XYZ.newFrom(corner[0].position)
                        v1=XYZ.newFrom(corner[1].position)
                        v2=XYZ.newFrom(corner[2].position)

                    }
                        break
                    case "square":{

                        v0=new XYZ(-1,0,0)
                        v1=new XYZ(1,0,0)
                        v2=new XYZ(1,1,0)
                        /**We create a square having three of its cornes in v0,v1,v2*/
                        let creator = new reseau.Regular2dPlus()
                        creator.nbU = this.nbI
                        creator.nbV = 4
                        creator.origin = v0
                        creator.end=v2


                        mamesh = creator.go()

                    }
                }
                //$$$ec


                //$$$b
                /**the three arrival points of the transformation*/
                let w0=new XYZ(0.5,0,0)
                let w1=new XYZ(1,0.5,0)
                let w2=new XYZ(0,0.5,1)
                let doTransform=this.doTransform
                //$$$e



                //$$$bc

                switch (this.viaVerticesVersusPositions) {
                    case "via_vertices": {
                        if(doTransform)spacialTransformations.affineTransformation_3vec(mamesh.vertices, v0, v1, v2, w0, w1, w2)
                    }
                        break
                    case "via_positions":{
                        let positions:XYZ[]=[]
                        for (let vert of mamesh.vertices) positions.push(vert.position)
                        if(doTransform)spacialTransformations.affineTransformation_3vec(positions, v0, v1, v2, w0, w1, w2)

                    }
                }
                //$$$ec



                //$$$bh visualization
                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()


                let pointsViewer=(a0,a1,a2,color:string)=>{
                    let arrivalPoints=new Mamesh()
                    arrivalPoints.newVertex(a0)
                    arrivalPoints.newVertex(a1)
                    arrivalPoints.newVertex(a2)

                    let arrivalPointsViewer=new visu3d.VerticesViewer(arrivalPoints,this.mathisFrame.scene)
                    arrivalPointsViewer.radiusAbsolute=0.07
                    arrivalPointsViewer.color=new Color(color)
                    arrivalPointsViewer.go()
                }
                pointsViewer(v0,v1,v2,Color.names.black)
                pointsViewer(w0,w1,w2,Color.names.blue)


                new creation3D.TwoOrTreeAxis(this.mathisFrame.scene).go()



                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }
        }




        class SkewTransformOfQuad implements PieceOfCode{
            NAME="SkewTransformOfQuad"
            TITLE="skew transformation of a quand: When we split a quand in two parts, we get two triangles, which determines two affine transforms." +
                "The skewTransformation is an interpolation between these two affine transformations. "

            nbI = 7
            $$$nbI=[3,5,7]

            viaVerticesVersusPositions="via_vertices"
            $$$viaVerticesVersusPositions=["via_vertices","via_positions"]

            doTransform=true
            $$$doTransform=[true,false]


            constructor(private mathisFrame:MathisFrame) {}

            /**This method is fired when we enter  in this piece of code (eg. when play button is pushed)*/
            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }
            /**This method is fired each time one of the configuration parameters change */
            go() {

                this.mathisFrame.clearScene(false,false)



                //$$$b

                let v0=new XYZ(-1,0,0)
                let v1=new XYZ(1,0,0)
                let v2=new XYZ(1,1,0)
                let v3=new XYZ(-1,1,0)

                let creator = new reseau.Regular2dPlus()

                creator.nbU = this.nbI
                creator.nbV = 4
                creator.origin = v0
                creator.end=v2

                //n
                /**Mamesh that we will transform*/
                let mamesh = creator.go()


                let corner=[]
                for (let vert of mamesh.vertices) if (vert.hasMark(Vertex.Markers.corner)) corner.push(vert)

                /**the three starting points of the transformation*/


                //$$$e



                /**the three arrival points of the transformation*/

                let w0=new XYZ(0.5,0,-0.5)
                let w1=new XYZ(1.5,0.5,0)
                let w2=new XYZ(1,2.5,0)
                let w3=new XYZ(0.5,2,0)
                //$$$b



                //$$$e



                //$$$bc

                let doTransform=this.doTransform
                switch (this.viaVerticesVersusPositions) {
                    case "via_vertices": {
                        if(doTransform) spacialTransformations.quadTransformation_4vec(mamesh.vertices, v0, v1, v2,v3, w0, w1, w2,w3)
                    }
                        break
                    case "via_positions":{
                        let positions:XYZ[]=[]
                        for (let vert of mamesh.vertices) positions.push(vert.position)
                        if(doTransform) spacialTransformations.quadTransformation_4vec(positions, v0, v1, v2,v3, w0, w1, w2,w3)
                    }
                }
                //$$$ec



                //$$$bh visualization
                let pointsViewer=(a0,a1,a2,a3,color:string)=>{
                    let arrivalPoints=new Mamesh()
                    arrivalPoints.newVertex(a0)
                    arrivalPoints.newVertex(a1)
                    arrivalPoints.newVertex(a2)
                    arrivalPoints.newVertex(a3)

                    let arrivalPointsViewer=new visu3d.VerticesViewer(arrivalPoints,this.mathisFrame.scene)
                    arrivalPointsViewer.radiusAbsolute=0.07
                    arrivalPointsViewer.color=new Color(color)
                    arrivalPointsViewer.go()
                }
                pointsViewer(v0,v1,v2,v3,Color.names.black)
                pointsViewer(w0,w1,w2,w3,Color.names.blue)


                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }
        }





    }
}
