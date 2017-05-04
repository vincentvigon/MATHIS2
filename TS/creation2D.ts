/**
 * Created by vigon on 02/06/2016.
 */

module mathis{

    export module creation2D{

        import rotation = mathis.symmetries.keyWords.rotation;
        export enum PartShape{triangulatedTriangle,triangulatedRect,square,polygon3,polygon4,polygon5,polygon6,polygon7,polygon8,polygon9,polygon10,polygon11,polygon12}




        export class Concentric{


            SUB_gratAndStick = new grateAndGlue.ConcurrentMameshesGraterAndSticker()
            SUB_oppositeLinkAssocierByAngles=new linkModule.OppositeLinkAssocierByAngles(null)
            SUB_mameshCleaner=new mameshModification.MameshCleaner(null)


            origine=new XYZ(0,0,0)
            end=new XYZ(1,1,0)
            /**a very small angle to avoid the bug of BABYLON*/
            rotation=0.001


            shapes=[PartShape.square]
              
            proportions=[new UV(1,1),new UV(1,1)]

            individualScales=[new UV(1,1)]
            individualRotations=[0]
            individualTranslation=[new XYZ(0,0,0),new XYZ(0,0,0)]


            nbPatches=2

            
            /**if zero, sticking is made only for closest voisin*/
            toleranceToBeOneOfTheClosest=0.55//0.05

            stratesToSuppressFromCorners=[0]
            
            /**e.g. XYZ(1,0.5,0) will suppress all the vertical branching while
             *      XYZ(0.5,1,0) will suppress all the horizontal branching */
            scalingBeforeOppositeLinkAssociations:XYZ=null
            


            /**if you change one of this filed, a rounding is made*/
            propBeginToRound:number[]
            propEndToRound:number[]
            integerBeginToRound:number[]
            integerEndToRound:number[]
            exponentOfRoundingFunction:number[]=[1]
            percolationProba:number[]=[0]


            forceToGrate=[0.1]
            
            

            private nbI
            private nbJ





            constructor(individualNbI:number,individualNbJ:number){
                this.nbI=individualNbI
                this.nbJ=individualNbJ
            }


            go():Mamesh{


                let subMa:Mamesh[]=[]

                for (let j=0; j<this.nbPatches; j++){

                    /**other function are possible*/
                    let indexModulo=(j)%this.shapes.length
                    let partShape=this.shapes[indexModulo]
                    let name:string=PartShape[partShape]

                    let nI=Math.round(this.nbI*this.proportions[j%this.proportions.length].u)
                    let nJ=Math.round(this.nbJ*this.proportions[j%this.proportions.length].v)
                    let radiusI=0.5*this.individualScales[j%this.individualScales.length].u*this.proportions[j%this.proportions.length].u
                    let radiusJ=0.5*this.individualScales[j%this.individualScales.length].v*this.proportions[j%this.proportions.length].v

                    
                    let mamesh:Mamesh
                    /**as usual, deformation of individual patches are  : scaling, then rotation, then translation */

                    if (name.indexOf('polygon')!=-1){

                        let nbSides=parseInt(name.slice(7,name.length))

                        let crea=new reseau.TriangulatedPolygone(nbSides)
                        crea.origin=new XYZ(-radiusI,-radiusJ,0)
                        crea.end=new XYZ(radiusI,radiusJ,0)
                        /** nbI and nbJ are sort of diameter, so the constantRadius is alf the mean of the diameter */
                        crea.nbSubdivisionInARadius=Math.floor((nI+nJ)/4)
                        mamesh=crea.go()

                    }
                    else if (partShape==PartShape.square||partShape==PartShape.triangulatedRect){

                        let gene=new reseau.BasisForRegularReseau()
                        /**here the scaling*/
                        gene.origin=new XYZ(-radiusI,-radiusJ,0)
                        gene.end=new XYZ(radiusI,radiusJ,0)
                        gene.nbI=nI
                        gene.nbJ=nJ

                        if (partShape==PartShape.triangulatedRect) gene.squareMailleInsteadOfTriangle=false
                        gene.go()

                        let regular=new reseau.Regular(gene)
                        if (partShape==PartShape.triangulatedRect) regular.oneMoreVertexForOddLine=true
                        mamesh=regular.go()


                    }
                    else if (partShape==PartShape.triangulatedTriangle){
                        let creator=new reseau.TriangulatedTriangle()
                        creator.origin=new XYZ(-radiusI,-radiusJ,0)
                        creator.end=new XYZ(radiusI,radiusJ,0)
                        creator.nbSubdivisionInSide=(nI+nJ)/2
                        mamesh=creator.go()
                        
                    }



                    if(this.propBeginToRound|| this.propEndToRound||this.integerBeginToRound||this.integerEndToRound){

                        let rounder=new spacialTransformations.RoundSomeStrates(mamesh)

                        if(this.propBeginToRound==null ) rounder.propBeginToRound=0
                        else rounder.propBeginToRound=this.propBeginToRound[j%this.propBeginToRound.length]

                        if(this.propEndToRound==null ) rounder.propEndToRound=1
                        else rounder.propEndToRound=this.propEndToRound[j%this.propEndToRound.length]

                        if (this.integerBeginToRound!=null) rounder.integerBeginToRound=this.integerBeginToRound[j%this.integerBeginToRound.length]
                        if (this.integerEndToRound!=null) rounder.integerEndToRound=this.integerEndToRound[j%this.integerEndToRound.length]

                        
                        rounder.exponentOfRoundingFunction=this.exponentOfRoundingFunction[j%this.exponentOfRoundingFunction.length]
                        rounder.referenceRadiusIsMinVersusMaxVersusMean=2
                        rounder.preventStratesCrossings=true
                        rounder.goChanging()
                        
                    }
                    
                    
                    
                    let percolation=this.percolationProba[j*this.percolationProba.length]
                    if (percolation>0){
                        let percolator=new mameshModification.PercolationOnLinks(mamesh)
                        percolator.percolationProba=percolation
                        percolator.goChanging()
                    }



                    if (this.stratesToSuppressFromCorners[j%this.stratesToSuppressFromCorners.length]>0){
                        let supp=new grateAndGlue.ExtractCentralPart(mamesh,this.stratesToSuppressFromCorners[j%this.stratesToSuppressFromCorners.length])
                        supp.suppressFromBorderVersusCorner=false
                        mamesh=supp.go()
                        mamesh.isolateMameshVerticesFromExteriorVertices()
                    }


                    subMa.push(mamesh)



                    let decay:XYZ=this.individualTranslation[j%this.individualTranslation.length]
                    let angle=this.individualRotations[j%this.individualRotations.length]

                    let mat=new MM()
                    geo.axisAngleToMatrix(new XYZ(0,0,-1),angle,mat)

                    mamesh.vertices.forEach(v=>{
                        geo.multiplicationMatrixVector(mat,v.position,v.position)
                        v.position.add(decay)
                    })



                }


                let res:Mamesh
                /**just to win time : when there is only one IN_mamesh, no need of grating and stiking*/
                if (this.nbPatches>1) {
                    
                    this.SUB_gratAndStick.IN_mameshes=subMa
                    this.SUB_gratAndStick.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest
                    this.SUB_gratAndStick.SUB_grater.proportionOfSeeds=this.forceToGrate
                    res = this.SUB_gratAndStick.goChanging()
                }
                else {
                    res=subMa[0]
                    spacialTransformations.adjustInASquare(res,new XYZ(0,0,0),new XYZ(1,1,0))
                    res.clearOppositeInLinks()
                }


                if (this.scalingBeforeOppositeLinkAssociations!=null) spacialTransformations.adjustInASquare(res,new XYZ(0,0,0),new XYZ(this.scalingBeforeOppositeLinkAssociations.x,this.scalingBeforeOppositeLinkAssociations.y,0))

                this.SUB_oppositeLinkAssocierByAngles.vertices=res.vertices
                this.SUB_oppositeLinkAssocierByAngles.goChanging()
                
                this.SUB_mameshCleaner.IN_mamesh=res
                this.SUB_mameshCleaner.goChanging()
                



                new spacialTransformations.Similitude(res.vertices,this.rotation).goChanging()

                spacialTransformations.adjustInASquare(res,this.origine,this.end)



                return res


            }




        }




        export class Patchwork extends Concentric{

            nbPatchesI=2
            nbPatchesJ=2
            patchesInQuinconce=false
            
            oddPatchLinesAreTheSameVersusLongerVersusShorter=0
            
            alternateShapeAccordingIPlusJVersusCounter=true

            constructor(nbI:number,nbJ:number,nbIPart:number,nbJPart:number){
                super(nbI,nbJ)
                this.nbPatchesI=nbIPart
                this.nbPatchesJ=nbJPart
                
                /**field of the super class, which will be determine in goChanging-method*/
                this.nbPatches=0
                this.individualTranslation=[]
                //this.shapes=[]
            }

            go():Mamesh{

                /**2 fields recomputed*/
                this.individualTranslation=[]
                this.nbPatches=0

                let shapes=[]
                
                let count=0
                for (let j=0; j<this.nbPatchesJ; j++) {
                    let someMoreOrLessOfOdd = 0
                    if ( j % 2 == 1) {
                        if(this.oddPatchLinesAreTheSameVersusLongerVersusShorter==0) someMoreOrLessOfOdd=0
                         else   if(this.oddPatchLinesAreTheSameVersusLongerVersusShorter==1)       someMoreOrLessOfOdd=1
                        else if(this.oddPatchLinesAreTheSameVersusLongerVersusShorter==2)  someMoreOrLessOfOdd=-1
                        else throw 'must be 0 or 1 or 2'
                    }
                    for (let i = 0; i < this.nbPatchesI + someMoreOrLessOfOdd; i++) {
                        this.nbPatches++
                        
                        let dec = 0
                        if (this.patchesInQuinconce && j % 2 == 1) {
                            if(this.oddPatchLinesAreTheSameVersusLongerVersusShorter==0) dec = -0.5
                            if(this.oddPatchLinesAreTheSameVersusLongerVersusShorter==1) dec = -0.5
                            if(this.oddPatchLinesAreTheSameVersusLongerVersusShorter==2) dec = 0.5
                        }

                        this.individualTranslation.push(new XYZ(i+dec,j,0))


                        count++

                        let ind=(this.alternateShapeAccordingIPlusJVersusCounter) ? (i+ someMoreOrLessOfOdd +j) : count

                        //this.proportions.push(this.patchSize[ind%this.patchSize.length])
                        shapes.push(this.shapes[ind%this.shapes.length])
                        
                    }
                }

                this.shapes=shapes


                return super.go()
            }

        }



        

    }
}