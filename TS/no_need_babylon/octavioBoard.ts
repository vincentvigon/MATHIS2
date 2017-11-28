/**
 * Created by vigon on 02/06/2016.
 */

module mathis{

    export module octavioBoard{

        import rotation = mathis.symmetries.keyWords.rotation;
        export enum PartShape{triangulatedTriangle,triangulatedRect,square,polygon3,polygon4,polygon5,polygon6,polygon7,polygon8,polygon9,polygon10,polygon11,polygon12}


        export enum PrimaryType{concentric,patchwork,polyhedron}
        export enum SuppressLinkWithoutOpposite{forNonBorder,forVertexWithAtLeast5links,none}


        export class ConcentricDescription {

            primaryType=PrimaryType.concentric
            shapes=[PartShape.square]
            proportions=[new UV(1,1)]



            /**if you change one of this filed, a rounding is made*/
            propBeginToRound:number[]
            propEndToRound:number[]
            integerBeginToRound:number[]
            integerEndToRound:number[]
            exponentOfRoundingFunction:number[]=[1]


            nbPatches=2

            individualScales=[new UV(1,1)]
            individualRotations=[0]
            individualTranslation=[new XYZ(0,0,0)]

            nbI:number=8
            /**if null is set=nbI*/
            nbJ:number=null

            percolationProba=[0]


            /**e.g. XYZ(1,0.5,0) will suppress all the vertical branching while
             *      XYZ(0.5,1,0) will suppress all the horizontal branching */
            scalingBeforeOppositeLinkAssociations:XYZ=null



            /** bigger is theses coef, and more we chose seed for initiate grating  */
            proportionOfSeeds=[0.1]
            stratesToSuppressFromCorners=[0]

            /** to introduce asymmetry */
            asymetriesForSeeds:{direction:XYZ;influence:number;modulo?:number}[]=null


            /** default : link with no opposite on vertex with valence >=5 will be suppressed. This prevent generally from vertex of valence 7 which are too heavy*/
            suppressLinksWithoutOpposite=SuppressLinkWithoutOpposite.forVertexWithAtLeast5links
            doLineBifurcations=true

        }


        export class PatchworkDescription extends ConcentricDescription{


            primaryType=PrimaryType.patchwork

            nbPatchesI=2
            nbPatchesJ=2
            patchesInQuinconce=false


            oddPatchLinesAreTheSameVersusLongerVersusShorter=0
            alternateShapeAccordingIPlusJVersusCounter=true

        }



        export class Concentric{

            desc=new ConcentricDescription()




            SUB_gratAndStick = new grateAndGlue.ConcurrentMameshesGraterAndSticker()
            SUB_oppositeLinkAssocierByAngles=new linkModule.OppositeLinkAssocierByAngles(null)
            SUB_mameshCleaner=new MameshCleaner(null)

            origine=new XYZ(0,0,0)
            end=new XYZ(1,1,0)

            /**if zero, sticking is made only for closest voisin*/
            toleranceToBeOneOfTheClosest=0.55//0.05

            forceToGrate=[0.1]


            //associateOppositeLinks=true
            finalize=true


            OUT_corner:Vertex[]=[]



            constructor(){

            }


            go():Mamesh{

                this.SUB_gratAndStick.SUB_grater.proportionOfSeeds=
                    this.desc.proportionOfSeeds
                this.SUB_gratAndStick.SUB_grater.asymmetriesForSeeds=this.desc.asymetriesForSeeds



                this.SUB_oppositeLinkAssocierByAngles.canCreateBifurcations=this.desc.doLineBifurcations




                if (this.desc.nbJ==null) this.desc.nbJ=this.desc.nbI



                let subMa:Mamesh[]=[]

                for (let j=0; j<this.desc.nbPatches; j++){

                    /**other function are possible*/
                    let indexModulo=(j)%this.desc.shapes.length
                    let partShape=this.desc.shapes[indexModulo]
                    let name:string=PartShape[partShape]

                    let nI=Math.round(this.desc.nbI*this.desc.proportions[j%this.desc.proportions.length].u)
                    let nJ=Math.round(this.desc.nbJ*this.desc.proportions[j%this.desc.proportions.length].v)
                    let radiusI=0.5*this.desc.individualScales[j%this.desc.individualScales.length].u*this.desc.proportions[j%this.desc.proportions.length].u
                    let radiusJ=0.5*this.desc.individualScales[j%this.desc.individualScales.length].v*this.desc.proportions[j%this.desc.proportions.length].v

                    
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
                        gene.nbU=nI
                        gene.nbV=nJ

                        if (partShape==PartShape.triangulatedRect) gene.squareMailleInsteadOfTriangle=false
                        gene.go()

                        let regular=new reseau.Regular2d(gene)
                        if (partShape==PartShape.triangulatedRect) regular.oneMoreVertexForOddLine=true
                        mamesh=regular.go()


                    }
                    else if (partShape==PartShape.triangulatedTriangle){
                        let creator=new reseau.TriangulatedTriangle()
                        creator.origin=new XYZ(-radiusI,-radiusJ,0)
                        creator.end=new XYZ(radiusI,radiusJ,0)
                        creator.nbU=(nI+nJ)/2
                        mamesh=creator.go()


                    }
                    else throw "partShape non reconnue"

                    if(j==0){
                        for (let v of mamesh.vertices) if (v.hasMark(Vertex.Markers.corner)) {
                            this.OUT_corner.push(v)
                        }
                    }



                    if(this.desc.propBeginToRound|| this.desc.propEndToRound||this.desc.integerBeginToRound||this.desc.integerEndToRound){

                        let rounder=new spacialTransformations.RoundSomeStrates(mamesh)

                        if(this.desc.propBeginToRound==null ) rounder.propBeginToRound=0
                        else rounder.propBeginToRound=this.desc.propBeginToRound[j%this.desc.propBeginToRound.length]

                        if(this.desc.propEndToRound==null ) rounder.propEndToRound=1
                        else rounder.propEndToRound=this.desc.propEndToRound[j%this.desc.propEndToRound.length]

                        if (this.desc.integerBeginToRound!=null) rounder.integerBeginToRound=this.desc.integerBeginToRound[j%this.desc.integerBeginToRound.length]
                        if (this.desc.integerEndToRound!=null) rounder.integerEndToRound=this.desc.integerEndToRound[j%this.desc.integerEndToRound.length]

                        
                        rounder.exponentOfRoundingFunction=this.desc.exponentOfRoundingFunction[j%this.desc.exponentOfRoundingFunction.length]
                        rounder.referenceRadiusIsMinVersusMaxVersusMean=2
                        rounder.preventStratesCrossings=true
                        rounder.goChanging()
                        
                    }
                    
                    
                    
                    let percolation=this.desc.percolationProba[j*this.desc.percolationProba.length]
                    if (percolation>0){
                        let percolator=new mameshModification.PercolationOnLinks(mamesh)
                        percolator.percolationProba=percolation
                        percolator.goChanging()
                    }



                    if (this.desc.stratesToSuppressFromCorners[j%this.desc.stratesToSuppressFromCorners.length]>0){
                        let supp=new grateAndGlue.ExtractCentralPart(mamesh,this.desc.stratesToSuppressFromCorners[j%this.desc.stratesToSuppressFromCorners.length])
                        supp.suppressFromBorderVersusCorner=false
                        mamesh=supp.go()
                        mamesh.isolateMameshVerticesFromExteriorVertices()
                    }


                    subMa.push(mamesh)



                    let decay:XYZ=this.desc.individualTranslation[j%this.desc.individualTranslation.length]
                    let angle=this.desc.individualRotations[j%this.desc.individualRotations.length]

                    let mat=new MM()
                    geo.axisAngleToMatrix(new XYZ(0,0,-1),angle,mat)

                    mamesh.vertices.forEach(v=>{
                        geo.multiplicationVectorMatrix(mat,v.position,v.position)
                        v.position.add(decay)
                    })



                }


                let res:Mamesh
                /**just to win time : when there is only one IN_mamesh, no need of grating and stiking*/
                if (this.desc.nbPatches>1) {
                    
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


                if (this.desc.scalingBeforeOppositeLinkAssociations!=null) spacialTransformations.adjustInASquare(res,new XYZ(0,0,0),new XYZ(this.desc.scalingBeforeOppositeLinkAssociations.x,this.desc.scalingBeforeOppositeLinkAssociations.y,0))

                if (this.finalize){
                    this.SUB_oppositeLinkAssocierByAngles.vertices=res.vertices
                    this.SUB_oppositeLinkAssocierByAngles.goChanging()

                    this.SUB_mameshCleaner.suppressLinksWithoutOpposite=this.desc.suppressLinksWithoutOpposite
                    this.SUB_mameshCleaner.IN_mamesh=res
                    this.SUB_mameshCleaner.goChanging()

                }

                

                

                spacialTransformations.adjustInASquare(res,this.origine,this.end)



                return res


            }




        }


        export class Patchwork extends Concentric{

            desc=new PatchworkDescription()

            constructor(){
                super()

                /**field of the super class, which will be determine in goChanging-method*/
                this.desc.nbPatches=0
                this.desc.individualTranslation=[]
                //this.shapes=[]
            }

            go():Mamesh{

                /**2 fields recomputed*/
                this.desc.individualTranslation=[]
                this.desc.nbPatches=0

                let shapes=[]
                
                let count=0
                for (let j=0; j<this.desc.nbPatchesJ; j++) {
                    let someMoreOrLessOfOdd = 0
                    if ( j % 2 == 1) {
                        if(this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter==0) someMoreOrLessOfOdd=0
                         else   if(this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter==1)       someMoreOrLessOfOdd=1
                        else if(this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter==2)  someMoreOrLessOfOdd=-1
                        else throw 'must be 0 or 1 or 2'
                    }
                    for (let i = 0; i < this.desc.nbPatchesI + someMoreOrLessOfOdd; i++) {
                        this.desc.nbPatches++
                        
                        let dec = 0
                        if (this.desc.patchesInQuinconce && j % 2 == 1) {
                            if(this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter==0) dec = -0.5
                            if(this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter==1) dec = -0.5
                            if(this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter==2) dec = 0.5
                        }

                        this.desc.individualTranslation.push(new XYZ(i+dec,j,0))


                        count++

                        let ind=(this.desc.alternateShapeAccordingIPlusJVersusCounter) ? (i+ someMoreOrLessOfOdd +j) : count

                        //this.proportions.push(this.patchSize[ind%this.patchSize.length])
                        shapes.push(this.desc.shapes[ind%this.desc.shapes.length])
                        
                    }
                }

                this.desc.shapes=shapes


                return super.go()
            }

        }



        export class PolyhedronBoardDescription{

            primaryType=PrimaryType.polyhedron


            polyhedronName:string

            /**    */
            facesDescription:{desc:ConcentricDescription,nbSides:number,normals:XYZ[]}[]=[]

            // concentricDescriptionForSquares:ConcentricDescription[]=[]
            // concentricDescriptionForTriangles:ConcentricDescription[]=[]


            /** default : link with no opposite on vertex with valence >=5 will be suppressed. This prevent generally from vertex of valence 7 which are too heavy*/
            suppressLinksWithoutOpposite=SuppressLinkWithoutOpposite.forVertexWithAtLeast5links
            nbU=4

            canCreateBifurcations=true


        }



        export class PolyhedronBoard{

            SUB_oppositeLinkAssocierByAngles=new linkModule.OppositeLinkAssocierByAngles(null)
            SUB_mameshCleaner=new MameshCleaner(null)

            finalize=true


            constructor(private desc:PolyhedronBoardDescription){


            }


            go(){


                let crea=new polyhedron.Polyhedron(this.desc.polyhedronName)
                let mameshStructure:Mamesh=crea.go()


                let totalMamesh:Mamesh=null

                if (mameshStructure.faces==null) throw "no faces in this mamesh"


                let firstOne=true

                /**on regarde si l'utilisateur a fournis des descriptions pour les faces*/
                for (let face of mameshStructure.faces){

                    let chosenDescription:ConcentricDescription=null
                    let possible:{desc:ConcentricDescription,nbSides:number,normals:XYZ[]}[]=[]
                    for  (let tab of this.desc.facesDescription){
                        if (tab.nbSides==face.length){
                            possible.push(tab)
                        }
                    }

                    if (possible.length==1) chosenDescription=possible[0].desc
                    else if (possible.length>1){

                        let bary=new XYZ(0,0,0)
                        let vecs=[]
                        for (let vert of face) vecs.push(vert.position)
                        geo.baryCenter(vecs,null,bary)
                        /**dans la création des polyhedron, les sommets ont été rangés pour qu'il tournent dans le sens trigo autour des normales sortantes */
                        let V0=XYZ.newFrom(vecs[0]).substract(bary).normalize()
                        let V1=XYZ.newFrom(vecs[1]).substract(bary).normalize()
                        let normal=new XYZ(0,0,0)
                        geo.cross(V0,V1,normal)
                        /**on cherche la normale associée à une description la plus proche de la normale de la face*/
                        possible=possible.sort((a,b)=> {
                            if (a.normals==null||b.normals==null) return 0
                            let sca:number[]=[]
                            for (let vec of a.normals){
                                sca.push(- geo.dot(vec,normal))
                            }
                            let aVal=tab.minValue(sca)

                            sca=[]
                            for (let vec of b.normals){
                                sca.push(- geo.dot(vec,normal))
                            }
                            let bVal=tab.minValue(sca)
                            return aVal-bVal
                        })


                        chosenDescription=possible[0].desc

                    }


                    let creator=new Concentric()
                    /**on n'associe pas les voisins, ni on ne nettoie*/
                    creator.finalize=false


                    /**description des faces par défaut*/
                    if (chosenDescription==null) {
                        creator.desc=new ConcentricDescription()
                        creator.desc.nbPatches=1

                        if (face.length==3) creator.desc.shapes=[PartShape.triangulatedTriangle]
                        else if (face.length==4) creator.desc.shapes=[PartShape.square]
                        else if (face.length==5) creator.desc.shapes=[PartShape.polygon5]
                        else if (face.length==6) creator.desc.shapes=[PartShape.polygon6]
                        else if (face.length==7) creator.desc.shapes=[PartShape.polygon7]
                        else if (face.length==8) creator.desc.shapes=[PartShape.polygon8]
                        else throw "strange polyhedron containing a face with:"+face.length+ " sides"


                    }
                    else creator.desc=chosenDescription




                    /**le nombre de subdivision est décidé par la description du polyhedron (et non pas par celles des faces).
                     * Sinon les lignes ne se recolleraient pas sur les arêtes.
                     * Attention, les polygon sont paramétrés par leur rayon, alors que carré et triangles le sont pas leur diamètre*/
                    if (face.length==3||face.length==4 ){
                        creator.desc.nbI=this.desc.nbU
                    }
                    else {
                        creator.desc.nbI=(this.desc.nbU-1)*2
                    }




                    let subMamesh=creator.go()

                    /**les subMameshes sont envoyé sur les faces */
                    if (face.length==3){
                        let v0=face[0]
                        let v1=face[1]
                        let v2=face[2]


                        spacialTransformations.affineTransformation_3vec(subMamesh.vertices,
                            creator.OUT_corner[0].position,
                            creator.OUT_corner[1].position,
                            creator.OUT_corner[2].position ,
                            v0.position,
                            v1.position,
                            v2.position)

                    }

                    else if (face.length==4){
                        let v0=face[0]
                        let v1=face[1]
                        let v2=face[2]


                        spacialTransformations.affineTransformation_3vec(subMamesh.vertices,
                            new XYZ(0,0,0),new XYZ(1,0,0),new XYZ(1,1,0),
                            v0.position,
                            v1.position,
                            v2.position)

                    }

                    else if (face.length==5){
                        let v0=face[0]
                        let v1=face[2]
                        let v2=face[3]


                        spacialTransformations.affineTransformation_3vec(subMamesh.vertices,
                            creator.OUT_corner[0].position,
                            creator.OUT_corner[2].position,
                            creator.OUT_corner[3].position ,
                            v0.position,
                            v1.position,
                            v2.position)


                    }

                    else if (face.length==6){
                        let v0=face[0]
                        let v1=face[2]
                        let v2=face[4]

                        spacialTransformations.affineTransformation_3vec(subMamesh.vertices,
                            creator.OUT_corner[0].position,
                            creator.OUT_corner[2].position,
                            creator.OUT_corner[4].position ,
                            v0.position,
                            v1.position,
                            v2.position)

                    }
                    else if (face.length==7){
                        let v0=face[0]
                        let v1=face[2]
                        let v2=face[4]

                        spacialTransformations.affineTransformation_3vec(subMamesh.vertices,
                            creator.OUT_corner[0].position,
                            creator.OUT_corner[2].position,
                            creator.OUT_corner[4].position ,
                            v0.position,
                            v1.position,
                            v2.position)

                    }
                    else if (face.length==8){
                        let v0=face[0]
                        let v1=face[3]
                        let v2=face[6]


                        spacialTransformations.affineTransformation_3vec(subMamesh.vertices,
                            creator.OUT_corner[0].position,
                            creator.OUT_corner[3].position,
                            creator.OUT_corner[6].position ,
                            v0.position,
                            v1.position,
                            v2.position)

                    }
                    else throw 'face with ' +face.length +' sides are not yet supported'



                    if (firstOne) {
                        firstOne=false
                        totalMamesh=subMamesh
                    }
                    else {
                        let merger = new grateAndGlue.Merger(totalMamesh, subMamesh)
                        merger.goChanging()
                    }



                }



                //
                // for (let v=0;v< mameshStructure.smallestSquares.length;v+=4){
                //     let v0=mameshStructure.smallestSquares[v]
                //     let v1=mameshStructure.smallestSquares[v+1]
                //     let v2=mameshStructure.smallestSquares[v+2]
                //     let v3=mameshStructure.smallestSquares[v+3]
                //
                //
                //     let creator=new Concentric()
                //     /**on n'associe pas les voisins, ni on ne nettoie*/
                //     creator.finalize=false
                //     creator.desc=this.desc.concentricDescriptionForSquares[(v/4)%this.desc.concentricDescriptionForSquares.length]
                //
                //
                //     let subMamesh=creator.go()
                //
                //     spacialTransformations.quadTransformation_4vec(subMamesh.vertices,new XYZ(0,0,0),new XYZ(1,0,0),new XYZ(1,1,0),new XYZ(0,1,0),v0.position,v1.position,v2.position,v3.position)
                //
                //     if (firstSubMamesh) {
                //         totalMamesh=subMamesh
                //         firstSubMamesh=false
                //     }
                //     else {
                //         let merger=new grateAndGlue.Merger(totalMamesh,subMamesh)
                //         merger.goChanging()
                //     }
                // }
                //
                //
                // for (let v=0;v< mameshStructure.smallestTriangles.length;v+=3){
                //     let v0=mameshStructure.smallestTriangles[v]
                //     let v1=mameshStructure.smallestTriangles[v+1]
                //     let v2=mameshStructure.smallestTriangles[v+2]
                //
                //
                //     let creator=new Concentric()
                //     /**on n'associe pas les voisins, ni on ne nettoie*/
                //     creator.finalize=false
                //     creator.desc=this.desc.concentricDescriptionForTriangles[(v/3)%this.desc.concentricDescriptionForTriangles.length]
                //
                //     let subMamesh=creator.go()
                //
                //
                //     spacialTransformations.affineTransformation_3vec(subMamesh.vertices,
                //         creator.OUT_corner[0].position,
                //         creator.OUT_corner[1].position,
                //         creator.OUT_corner[2].position ,
                //         v0.position,
                //         v1.position,
                //         v2.position)
                //
                //     if (firstSubMamesh) {
                //         totalMamesh=subMamesh
                //         firstSubMamesh=false
                //     }
                //     else {
                //         let merger=new grateAndGlue.Merger(totalMamesh,subMamesh)
                //         merger.goChanging()
                //     }
                // }





                if (this.finalize){
                    this.SUB_oppositeLinkAssocierByAngles.vertices=totalMamesh.vertices
                    this.SUB_oppositeLinkAssocierByAngles.canCreateBifurcations=this.desc.canCreateBifurcations
                    this.SUB_oppositeLinkAssocierByAngles.goChanging()

                    this.SUB_mameshCleaner.suppressLinksWithoutOpposite=this.desc.suppressLinksWithoutOpposite
                    this.SUB_mameshCleaner.IN_mamesh=totalMamesh


                    //this.SUB_mameshCleaner.goChanging()

                }




                return totalMamesh

            }



        }






        export class MameshCleaner{

            OUT_nbLinkSuppressed=0
            OUT_nbVerticesSuppressed=0
            suppressCellWithNoVoisin=true

            suppressLinksWithoutOpposite=SuppressLinkWithoutOpposite.none

            /**other interesting function : (v:Vertex)=> (!v.isBorder()) which is better that the following or percolated IN_mamesh  */
            private suppressLinkWithoutOppositeFunction:(v:Vertex)=>boolean= (v:Vertex)=> (v.links.length>=5)

            IN_mamesh:Mamesh

            constructor(mamesh:Mamesh){
                this.IN_mamesh=mamesh
            }


            goChanging(){



                if (this.suppressLinksWithoutOpposite==SuppressLinkWithoutOpposite.forVertexWithAtLeast5links) this.suppressLinkWithoutOppositeFunction=(v:Vertex)=>(v.links.length>=5)
                else if (this.suppressLinksWithoutOpposite==SuppressLinkWithoutOpposite.forNonBorder) this.suppressLinkWithoutOppositeFunction=(v:Vertex)=>(!v.isBorder())
                else this.suppressLinkWithoutOppositeFunction=null





                if (this.IN_mamesh==null) throw 'a Mamesh is require as IN_arg'
                if (this.suppressLinkWithoutOppositeFunction!=null) this.suppressLinkWithoutOpposite()

            }

            private suppressLinkWithoutOpposite(){

                let goOn=true
                while (goOn){

                    goOn=false
                    for (let v of this.IN_mamesh.vertices){
                        if (this.suppressLinkWithoutOppositeFunction(v)){
                            for (let i=0;i<v.links.length;i++){
                                let li=v.links[i]
                                if (li.opposites==null) {
                                    goOn=true
                                    Vertex.separateTwoVoisins(v,li.to)
                                    this.OUT_nbLinkSuppressed++
                                    break
                                }
                            }
                        }
                        //if (goOn) break
                    }
                }



                if (this.suppressCellWithNoVoisin){
                    let indexToSuppress=[]
                    for (let i=0; i<this.IN_mamesh.vertices.length; i++){
                        if (this.IN_mamesh.vertices[i].links.length==0) {
                            indexToSuppress.push(i)
                            this.OUT_nbVerticesSuppressed++
                        }
                    }
                    this.IN_mamesh.vertices=tab.arrayMinusSomeIndices(this.IN_mamesh.vertices,indexToSuppress)

                }



            }


        }




    }
}