/**
 * Created by vigon on 04/07/2016.
 */

module mathis{


    export module spacialTransformations{

        export class RoundSomeStrates{

            private mamesh:Mamesh
            
            propBeginToRound=0
            propEndToRound=1
            /**if it stays null, this interval is computed from propIntervalToRound*/
            integerBeginToRound:number=null
            integerEndToRound:number=null

            exponentOfRoundingFunction=1


            referenceRadiusIsMinVersusMaxVersusMean=2
            preventStratesCrossings=true


            constructor(mamesh:Mamesh){
                this.mamesh=mamesh
            }




            goChanging(){


                if(isNaN(this.exponentOfRoundingFunction)) throw 'must be a number'


                if (this.propBeginToRound<0||this.propBeginToRound>1) throw 'must be in [0,1]'
                if (this.propEndToRound<0||this.propEndToRound>1) throw 'must be in [0,1]'
                if (this.propBeginToRound>=this.propEndToRound) return



                let border:Vertex[]=[]
                for (let ver of this.mamesh.vertices){
                    if (ver.hasMark(Vertex.Markers.border)) border.push(ver)
                }
                let rings=graph.ringify(border)
                
                
                if(this.integerBeginToRound==null) this.integerBeginToRound=Math.floor(rings.length*this.propBeginToRound)
                if(this.integerEndToRound==null) this.integerEndToRound=Math.ceil(rings.length*this.propEndToRound)
                if(this.integerEndToRound<0) this.integerEndToRound=rings.length+this.integerEndToRound

                if (this.integerBeginToRound>rings.length|| this.integerBeginToRound<0) throw 'problem'
                if (this.integerEndToRound>rings.length|| this.integerEndToRound<0) throw 'problem'

                if (this.integerEndToRound<=this.integerBeginToRound) return



                    let barycenter=new XYZ(0,0,0)
                for (let vertex of this.mamesh.vertices){
                    barycenter.add(vertex.position)
                }
                barycenter.scale(1/this.mamesh.vertices.length)


                let temp=new XYZ(0,0,0)
                let lastReferenceRadius:number=null
                //let i:number
                for (let i=this.integerBeginToRound; i<this.integerEndToRound; i++ ){

                    let maxRadius=-1
                    let minRadius=Number.POSITIVE_INFINITY
                    let meanRadois=0

                    for (let v of rings[i]){
                        let radius=geo.distance(v.position,barycenter)
                        if (radius>maxRadius) maxRadius=radius
                        if (radius<minRadius) minRadius=radius
                        meanRadois+=radius
                    }
                    meanRadois/=rings[i].length

                    /** when the last strate is made of a vertex which position is the barycenter, maxRadius si zero */
                    if (maxRadius>geo.epsilon) {

                        let referenceRadius:number
                        if (this.referenceRadiusIsMinVersusMaxVersusMean==0) referenceRadius=minRadius
                        else if (this.referenceRadiusIsMinVersusMaxVersusMean==1) referenceRadius=maxRadius
                        else if (this.referenceRadiusIsMinVersusMaxVersusMean==2) referenceRadius=meanRadois
                        lastReferenceRadius=referenceRadius


                        for (let v of rings[i]) {
                            let newPosition = temp.copyFrom(v.position).substract(barycenter)
                            let length = newPosition.length()
                            let ratio=Math.pow(referenceRadius / length,this.exponentOfRoundingFunction)
                            newPosition.scale(ratio)
                            v.position.copyFrom(newPosition.add(barycenter))
                        }
                    }
                }

                if(this.preventStratesCrossings){
                    
                    if (this.integerBeginToRound>0){
                        
                        let maxRadiusOfRound=-1
                        for (let v of rings[this.integerBeginToRound]){
                            let radius=geo.distance(v.position,barycenter)
                            if (radius>maxRadiusOfRound) maxRadiusOfRound=radius
                        }

                        let minRadiusOfNonExterior=Number.POSITIVE_INFINITY
                        for (let v of rings[this.integerBeginToRound-1]){
                            let radius=geo.distance(v.position,barycenter)
                            if (radius<minRadiusOfNonExterior) minRadiusOfNonExterior=radius
                        }

                        let factor=null

                        if (1.1*maxRadiusOfRound>minRadiusOfNonExterior) factor= (1.1*maxRadiusOfRound )/minRadiusOfNonExterior

                        if (factor!=null) {

                            for (let j = 0; j < this.integerBeginToRound; j++) {
                                for (let v of rings[j]) {
                                    v.position.copyFrom(temp.copyFrom(v.position).substract(barycenter).scale(factor).add(barycenter))
                                }
                            }
                        }
                        
                        
                        
                    }

                    if (this.integerEndToRound<rings.length){

                        let minRadiusOfRound=Number.POSITIVE_INFINITY
                        for (let v of rings[this.integerEndToRound-1]){
                            let radius=geo.distance(v.position,barycenter)
                            if (radius<minRadiusOfRound) minRadiusOfRound=radius
                        }

                        let maxRadiusOfInterior=-1
                        for (let v of rings[this.integerEndToRound]){
                            let radius=geo.distance(v.position,barycenter)
                            if (radius>maxRadiusOfInterior) maxRadiusOfInterior=radius
                        }

                        let factor=null
                        if (1.1*maxRadiusOfInterior>minRadiusOfRound) factor=minRadiusOfRound/(1.1*maxRadiusOfInterior)


                        if (factor!=null) {

                            for (let j = this.integerEndToRound; j < rings.length; j++) {
                                for (let v of rings[j]) {
                                    v.position.copyFrom(temp.copyFrom(v.position).substract(barycenter).scale(factor).add(barycenter))
                                }
                            }
                        }


                    }








                    //     let factor=null
                    // if (this.roundBorderVersusCenter){
                    //     if (1.1*maxRadiusOfNonRound>minRadiusOfRound) factor=minRadiusOfRound/ (1.1*maxRadiusOfNonRound )
                    //     cc("round center",factor)
                    // }
                    // else{
                    //     if (1.1*maxRadiusOfRound>minRadiusOfNonRound) factor=1.1*maxRadiusOfRound/(minRadiusOfNonRound)
                    // }
                    //
                    // if (factor!=null) {
                    //
                    //     for (let j = i; j < rings.length; j++) {
                    //         for (let v of rings[indices[j]]) {
                    //             v.position.copyFrom(temp.copyFrom(v.position).substract(barycenter).scale(factor).add(barycenter))
                    //         }
                    //     }
                    // }

                }


            }


        }


        export class Similitude{

            axisForRotation=new XYZ(0,0,1)
            /**if null, it is the barycenter*/
            centerForSimilitude:XYZ=null

            private vertices:Vertex[]
            private angle:number
            private vectorForTranslation:XYZ
            private sizesForResize:XYZ

            constructor(vertices:Vertex[],angle:number,vectorForTranslation=new XYZ(0,0,0),sizesForResize=new XYZ(1,1,1)){

                this.vertices=vertices
                this.angle=angle
                this.vectorForTranslation=vectorForTranslation
                this.sizesForResize=sizesForResize

            }

            goChanging():void{


                if (this.centerForSimilitude==null){
                    this.centerForSimilitude=new XYZ(0,0,0)

                    let w=1/this.vertices.length
                    let ws:number[]=[]
                    let positions:XYZ[]=[]

                    this.vertices.forEach(v=>{
                        positions.push(v.position)
                        ws.push(w)
                    })

                    geo.baryCenter(positions,ws,this.centerForSimilitude)

                }

                let mat=new MM()
                geo.axisAngleToMatrix(this.axisForRotation,this.angle,mat)

                this.vertices.forEach(v=>{
                    v.position.substract(this.centerForSimilitude)
                    v.position.resizes(this.sizesForResize)
                    geo.multiplicationVectorMatrix(mat,v.position,v.position)
                    v.position.add(this.centerForSimilitude).add(this.vectorForTranslation)
                })

            }
            
        }

        /**
         * Only to dilate planar map
         * */
        export function adjustInASquare(mamesh:Mamesh,origine:XYZ,end:XYZ):void{
            
            let actualEnd=XYZ.newFrom(mamesh.vertices[0].position)
            let actualOrigin=XYZ.newFrom(mamesh.vertices[0].position)

            for (let vert of mamesh.vertices){
                if (vert.position.x>actualEnd.x) actualEnd.x=vert.position.x
                if (vert.position.y>actualEnd.y) actualEnd.y=vert.position.y

                if (vert.position.x<actualOrigin.x) actualOrigin.x=vert.position.x
                if (vert.position.y<actualOrigin.y) actualOrigin.y=vert.position.y
            }

            let actualAmplitude=XYZ.newFrom(actualEnd).substract(actualOrigin)
            let ampli=XYZ.newFrom(end).substract(origine)
            let factor=new XYZ(ampli.x/actualAmplitude.x,ampli.y/actualAmplitude.y,0)

            for (let vert of mamesh.vertices){
                vert.position.substract(actualOrigin).resizes(factor).add(origine)
            }
            
        }


        function toPositionsList(verticesOrPositions:Vertex[]|XYZ[]):XYZ[]{
            let positions:XYZ[]
            if (verticesOrPositions[0] instanceof XYZ) positions=<XYZ[]>verticesOrPositions
            else {
                positions=[]
                for (let v of <Vertex[]>verticesOrPositions) positions.push(v.position)
            }
            return positions
        }


        export function affineTransformation_4vec(verticesOrPositions:Vertex[]|XYZ[], v0:XYZ, v1:XYZ, v2:XYZ, v3:XYZ, w0:XYZ, w1:XYZ, w2:XYZ, w3:XYZ){

            /**inutile de faire des copies, les vecteurs sont déjà copié dans les méthodes de geo.*/
            // v0=XYZ.newFrom(v0)
            // v1=XYZ.newFrom(v1)
            // v2=XYZ.newFrom(v2)
            // v3=XYZ.newFrom(v3)
            // w0=XYZ.newFrom(w0)
            // w1=XYZ.newFrom(w1)
            // w2=XYZ.newFrom(w2)
            // w3=XYZ.newFrom(w3)


            let positions=toPositionsList(verticesOrPositions)


            let mat=new MM()
            geo.affineTransformation_4vec(v0,v1,v2,v3,w0,w1,w2,w3,mat)

            for (let v of positions){
                geo.multiplicationVectorMatrix(mat,v,v)
            }
        }



        export function affineTransformation_3vec(verticesOrPositions:Vertex[]|XYZ[], v0:XYZ, v1:XYZ, v2:XYZ, w0:XYZ, w1:XYZ, w2:XYZ){

            let positions=toPositionsList(verticesOrPositions)


            let mat=new MM()
            geo.affineTransformation_3vec(v0,v1,v2,w0,w1,w2,mat)

            for (let v of positions){
                geo.multiplicationVectorMatrix(mat,v,v)
            }

        }


        export function quadTransformation_4vec(verticesOrPositions:Vertex[]|XYZ[], v0:XYZ, v1:XYZ, v2:XYZ, v3:XYZ, w0:XYZ, w1:XYZ, w2:XYZ, w3:XYZ){

            let positions=toPositionsList(verticesOrPositions)

            let positions1:XYZ[]=[]
            for (let v of positions) positions1.push(XYZ.newFrom(v))
            let positions2:XYZ[]=[]
            for (let v of positions) positions2.push(XYZ.newFrom(v))



            affineTransformation_3vec(positions1,v0,v1,v2,w0,w1,w2)
            affineTransformation_3vec(positions2,v0,v2,v3,w0,w2,w3)

            for (let i=0;i<positions.length;i++){
                let a=geo.distance(positions[i],v1)
                let b=geo.distance(positions[i],v3)
                let ab=a+b

                geo.baryCenter([positions1[i],positions2[i]],[b/ab,a/ab],positions[i])
            }


        }







        }
}