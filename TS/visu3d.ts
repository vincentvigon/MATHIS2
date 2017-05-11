/**
 * Created by vigon on 16/12/2015.
 */


module mathis{
    export module visu3d{


        import Mesh = BABYLON.Mesh;
        import VertexData = BABYLON.VertexData;
        import Path3D = BABYLON.Path3D;
        //import Ribbon = BABYLON.Geometry.Primitives.Ribbon
        import Quaternion = BABYLON.Quaternion;

        export class VerticesViewer{

            //mamesh:Mamesh
            scene:BABYLON.Scene
            vertices:Vertex[]

            nbSegments=32

            /**if null, default model will be used*/
            meshModel:BABYLON.Mesh=null
            meshModels:BABYLON.Mesh[]=null


            useCloneInsteadOfInstances=false

            /**if a model is given, the scaling is taken as the one of the model ?????*/
            positionings:HashMap<Vertex,Positioning>

            parentNode:BABYLON.Node

            checkCollision=false

            color:Color=color.thema.defaultVertexColor
            constantRadius=null
            /**if no constantRadius and no positioning.size is given, the radius of vertex representation is a proportion of the distance
             * between two linked vertices*/
            radiusProp=0.1

            constructor(mameshOrVertices:Mamesh|Vertex[],scene:BABYLON.Scene,positionings?:HashMap<Vertex,Positioning>){

                if (deconnectViewerForTest) return

                if (mameshOrVertices instanceof Mamesh) this.vertices=mameshOrVertices.vertices
                else this.vertices=<Vertex[]>mameshOrVertices


                if (scene==null) throw  'scene is null'
                else this.scene=scene
                this.positionings=positionings
            }


            checkArgs(){
                if(this.vertices==null||this.vertices[0]==null) cc('no vertex to draw')
            }

            go ():void{
                if (deconnectViewerForTest) return


                this.checkArgs()


                if (this.meshModel==null&&this.meshModels==null){
                    /**diameter of model : 0.5 because then, we think of radius*/
                    this.meshModel=BABYLON.Mesh.CreateSphere('',this.nbSegments,2,this.scene)
                    this.meshModels=[this.meshModel]

                }
                else {
                    if (this.meshModels==null) this.meshModels=[]
                    if (this.meshModel!=null) this.meshModels.push(this.meshModel)
                    for (let mesh of this.meshModels) mesh.bakeCurrentTransformIntoVertices()
                }

                //if (this.material==null) this.material=new BABYLON.StandardMaterial('',this.scene)
                for (let mesh of this.meshModels){

                    if (mesh.material==null){
                        let material=new BABYLON.StandardMaterial("",this.scene)
                            material.diffuseColor=this.color.toBABYLON_Color3()
                        mesh.material=material
                    }
                }



                /**models are hidden*/
                for (let mesh of this.meshModels) mesh.scaling=new XYZ(0,0,0)

                if (this.positionings==null) {

                    // if (this.mamesh != null) {
                    //     logger.c('no positioning given: it is computed from mamesh')
                    //     let posi = new mameshAroundComputations.PositioningComputerForMameshVertices(this.mamesh)
                    //     this.vertexToPositioning = posi.goChanging()
                    // }
                    // else {
                    //logger.c('no positioning given: elementary positioning is compute from vertex position. This positioning is only convenient for spherical representation of vertices')

                    this.positionings = new HashMap<Vertex,Positioning>()


                    for (let v of this.vertices) {
                        let radius:number
                        if (this.constantRadius==null) {

                            let minDist = Number.MAX_VALUE
                            if (v.links.length != 0) {
                                for (let li of v.links) {
                                    let d = geo.distance(v.position, li.to.position)
                                    if (d < minDist) minDist = d
                                }
                            }
                            /**if no links, we look the min distance according to all other vertices*/
                            else {
                                for (let other of this.vertices) {
                                    if (!other.position.almostEqual(v.position)) {
                                        let d = geo.distance(v.position, other.position)
                                        if (d < minDist) minDist = d
                                    }
                                }
                            }

                            radius = minDist * this.radiusProp

                        }
                        else radius=this.constantRadius

                        let pos = new Positioning()
                        pos.frontDir = new XYZ(1, 0, 0)
                        pos.upVector = new XYZ(0, 1, 0)
                        pos.scaling = new XYZ(radius, radius, radius)

                        this.positionings.putValue(v, pos)


                    }


                    //}
                }


                this.buildVertexVisu()

            }

            vertexToCopiedMeshes=new HashMap<Vertex,BABYLON.AbstractMesh[]>()

            clear(){
                this.vertices.forEach(vertex=>{
                    if (this.vertexToCopiedMeshes.getValue(vertex)!=null) {
                        for (let mesh of this.vertexToCopiedMeshes.getValue(vertex)) mesh.dispose()
                    }
                })
            }


            /**can also be use to rebuild a part of the visualisation */
            buildVertexVisu(verticesToUpdate:Vertex[]=this.vertices, verticesToClear:Vertex[]=[]):void{

                verticesToClear.forEach(vertex=>{
                    if (this.vertexToCopiedMeshes.getValue(vertex)!=null) {
                        for (let mesh of this.vertexToCopiedMeshes.getValue(vertex)) mesh.dispose()
                    }
                    this.vertexToCopiedMeshes.removeKey(vertex)
                })

                verticesToUpdate.forEach(vertex=>{

                    let copiedMeshes:BABYLON.AbstractMesh[]=[]


                    if (this.useCloneInsteadOfInstances) {
                        for(let mesh of this.meshModels) copiedMeshes.push(mesh.clone(''))
                    }
                    else {
                        for(let mesh of this.meshModels) copiedMeshes.push(mesh.createInstance(''))
                    }

                    for(let mesh of copiedMeshes)  {
                        mesh.checkCollisions=this.checkCollision
                        if (this.parentNode!=null) mesh.parent=this.parentNode
                    }

                    if (this.vertexToCopiedMeshes.getValue(vertex)!=null) {
                        for (let mesh of this.vertexToCopiedMeshes.getValue(vertex)) mesh.dispose()
                    }
                    this.vertexToCopiedMeshes.putValue(vertex,copiedMeshes)

                    this.updatePositioning(vertex)

                })



            }

            /**can also be used to modify a part of the visualisation*/
            updatePositionings(vertice:Vertex[]=this.vertices):void{
                vertice.forEach(v=>this.updatePositioning(v))
            }


            private updatePositioning(vertex:Vertex){


                let position=XYZ.newFrom(vertex.position)

                for (let mesh of this.vertexToCopiedMeshes.getValue(vertex)){
                    if (this.positionings.getValue(vertex)==null) throw "a vertex without associated positioning"
                    if(Math.abs(this.positionings.getValue(vertex).scaling.x)<geo.epsilon){
                        mesh.visibility=0
                    }
                    else{
                        mesh.visibility=1
                        mesh.rotationQuaternion=this.positionings.getValue(vertex).quaternion()
                        mesh.position=position
                        mesh.scaling=this.positionings.getValue(vertex).scaling
                    }
                }

            }

        }


        export class SurfaceViewer{

            //(IN_mamesh:Mamesh, scene:BABYLON.Scene, options?: {  sideOrientation?: number }, name='rectangleWithDifferentsParameters')

            parentNode:BABYLON.Node=null
            mamesh:Mamesh
            sideOrientation=BABYLON.Mesh.DOUBLESIDE
            normalDuplication=NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr//SurfaceVisuStatic.NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr
            maxAngleBetweenNormals=Math.PI/4

            scene:BABYLON.Scene
            material:any
            color=color.thema.defaultSurfaceColor
            alpha=0.4
            
            backFaceCulling=true



            constructor(mamesh:Mamesh,scene:BABYLON.Scene){

                this.mamesh=mamesh
                this.scene=scene
            }


            checkArgs():void{
                if (this.scene==null ) throw 'the scene must but not null'

            }

            go():Mesh {

                if (deconnectViewerForTest) return



                let positions :number[]=[]
                let uvs = [];

                for (let v of this.mamesh.vertices) {
                    positions.push(v.position.x, v.position.y, v.position.z)
                }


                let hashToIndex:number[]=[]

                for (let index=0;index<this.mamesh.vertices.length;index++) hashToIndex[this.mamesh.vertices[index].hashNumber]=index

                let indices :number[]=[]

                for (let i=0;i<this.mamesh.smallestTriangles.length;i+=3){
                    let v0=this.mamesh.smallestTriangles[i]
                    let v1=this.mamesh.smallestTriangles[i+1]
                    let v2=this.mamesh.smallestTriangles[i+2]
                    indices.push(hashToIndex[v0.hashNumber],hashToIndex[v1.hashNumber],hashToIndex[v2.hashNumber])
                }



                for (let i=0;i<this.mamesh.smallestSquares.length;i+=4){
                    let v0=this.mamesh.smallestSquares[i]
                    let v1=this.mamesh.smallestSquares[i+1]
                    let v2=this.mamesh.smallestSquares[i+2]
                    let v3=this.mamesh.smallestSquares[i+3]
                    indices.push(hashToIndex[v0.hashNumber],hashToIndex[v1.hashNumber],hashToIndex[v3.hashNumber])
                    indices.push(hashToIndex[v1.hashNumber],hashToIndex[v2.hashNumber],hashToIndex[v3.hashNumber])

                    //indices.push(this.IN_mamesh.smallestSquares[i],this.IN_mamesh.smallestSquares[i+1],this.IN_mamesh.smallestSquares[i+3],
                    //    this.IN_mamesh.smallestSquares[i+1],this.IN_mamesh.smallestSquares[i+2],this.IN_mamesh.smallestSquares[i+3])
                }


                let normalsOfTriangles=this.computeOneNormalPerTriangle(positions,indices)
                let normalsOfVertices = this.computeVertexNormalFromTrianglesNormal(positions,indices,normalsOfTriangles)



                /**must be done after the normal computations*/
                this._ComputeSides(this.sideOrientation, positions, indices, normalsOfVertices, uvs);

                let vertexData = new BABYLON.VertexData();
                vertexData.indices = indices;
                vertexData.positions = positions;
                vertexData.normals = normalsOfVertices;
                vertexData.uvs = uvs;


                let mesh=new BABYLON.Mesh('',this.scene)
                vertexData.applyToMesh(mesh)
                if (this.parentNode!=null) mesh.parent=this.parentNode

                if (this.material==null){
                    let material=new BABYLON.StandardMaterial('',this.scene)
                    material.diffuseColor=this.color.toBABYLON_Color3()

                    this.material=material
                    /**put backFaceCulling=false if you want to allow clik on both sides*/
                    this.material.backFaceCulling=this.backFaceCulling
                    if (!this.backFaceCulling) logger.c("backFaceCulling is desactivate on this mamesh.")
                    this.material.sideOrientation=BABYLON.Mesh.BACKSIDE
                    material.alpha=this.alpha
                }
                mesh.material=this.material

                return mesh
                //if (this.scene!=null){
                //
                //    if (this.material==null) {
                //        this.material=new BABYLON.StandardMaterial("mat1", this.scene);
                //        this.material.alpha = this.alpha;
                //        this.material.diffuseColor = new BABYLON.Color3(1,0.2,0.2)
                //        this.material.backFaceCulling = true
                //    }
                //
                //
                //    let babMesh = new BABYLON.Mesh(name, this.scene)
                //    vertexData.applyToMesh(babMesh)
                //    babMesh.material=this.material
                //
                //
                //
                //}



            }


            private  _ComputeSides(sideOrientation: number, positions: number[] | Float32Array, indices: number[] | Float32Array, normals: number[] | Float32Array, uvs: number[] | Float32Array) {
                var li: number = indices.length;
                var ln: number = normals.length;
                var i: number;
                var n: number;
                sideOrientation = sideOrientation || BABYLON.Mesh.DEFAULTSIDE;

                switch (sideOrientation) {

                    case BABYLON.Mesh.FRONTSIDE:
                        // nothing changed
                        break;

                    case BABYLON.Mesh.BACKSIDE:
                        var tmp: number;
                        // indices
                        for (i = 0; i < li; i += 3) {
                            tmp = indices[i];
                            indices[i] = indices[i + 2];
                            indices[i + 2] = tmp;
                        }
                        // normals
                        for (n = 0; n < ln; n++) {
                            normals[n] = -normals[n];
                        }
                        break;

                    case BABYLON.Mesh.DOUBLESIDE:
                        // positions
                        var lp: number = positions.length;
                        var l: number = lp / 3;
                        for (var p = 0; p < lp; p++) {
                            positions[lp + p] = positions[p];
                        }
                        // indices
                        for (i = 0; i < li; i += 3) {
                            indices[i + li] = indices[i + 2] + l;
                            indices[i + 1 + li] = indices[i + 1] + l;
                            indices[i + 2 + li] = indices[i] + l;
                        }
                        // normals
                        for (n = 0; n < ln; n++) {
                            normals[ln + n] = -normals[n];
                        }

                        // uvs
                        var lu: number = uvs.length;
                        for (var u: number = 0; u < lu; u++) {
                            uvs[u + lu] = uvs[u];
                        }
                        break;
                }
            }





            private computeOneNormalPerTriangle(positions: number[], indices: number[]):XYZ[] {

                let res:XYZ[]=[]


                var p1p2x = 0.0;
                var p1p2y = 0.0;
                var p1p2z = 0.0;
                var p3p2x = 0.0;
                var p3p2y = 0.0;
                var p3p2z = 0.0;
                var faceNormalx = 0.0;
                var faceNormaly = 0.0;
                var faceNormalz = 0.0;

                var length = 0.0;

                var i1 = 0;
                var i2 = 0;
                var i3 = 0;



                // indice triplet = 1 face
                var nbFaces = indices.length / 3;
                for (let index = 0; index < nbFaces; index++) {
                    i1 = indices[index * 3];            // get the indexes of each vertex of the face
                    i2 = indices[index * 3 + 1];
                    i3 = indices[index * 3 + 2];

                    p1p2x = positions[i1 * 3] - positions[i2 * 3];          // compute two vectors per face
                    p1p2y = positions[i1 * 3 + 1] - positions[i2 * 3 + 1];
                    p1p2z = positions[i1 * 3 + 2] - positions[i2 * 3 + 2];

                    p3p2x = positions[i3 * 3] - positions[i2 * 3];
                    p3p2y = positions[i3 * 3 + 1] - positions[i2 * 3 + 1];
                    p3p2z = positions[i3 * 3 + 2] - positions[i2 * 3 + 2];

                    faceNormalx = p1p2y * p3p2z - p1p2z * p3p2y;            // compute the face normal with cross product
                    faceNormaly = p1p2z * p3p2x - p1p2x * p3p2z;
                    faceNormalz = p1p2x * p3p2y - p1p2y * p3p2x;

                    length = Math.sqrt(faceNormalx * faceNormalx + faceNormaly * faceNormaly + faceNormalz * faceNormalz);
                    length = (length === 0) ? 1.0 : length;
                    faceNormalx /= length;                                  // normalize this normal
                    faceNormaly /= length;
                    faceNormalz /= length;

                    res[index]=new XYZ(faceNormalx,faceNormaly,faceNormalz)

                    //normals[i1 * 3] += faceNormalx;                         // accumulate all the normals per face
                    //normals[i1 * 3 + 1] += faceNormaly;
                    //normals[i1 * 3 + 2] += faceNormalz;
                    //normals[i2 * 3] += faceNormalx;
                    //normals[i2 * 3 + 1] += faceNormaly;
                    //normals[i2 * 3 + 2] += faceNormalz;
                    //normals[i3 * 3] += faceNormalx;
                    //normals[i3 * 3 + 1] += faceNormaly;
                    //normals[i3 * 3 + 2] += faceNormalz;
                }





                return res

            }



            private computeVertexNormalFromTrianglesNormal(positions:number[],indices:number[],triangleNormals:XYZ[]):number[]{


                let positionNormals:XYZ[]=[]


                //for (let i=0;i<lengthPosition;i++) res[i]=0

                for (let k=0;k<positions.length/3;k++) positionNormals[k]=new XYZ(0,0,0)


                if (this.normalDuplication==NormalDuplication.none) {
                    for (let k = 0; k < indices.length; k += 3) {

                        let triangleIndex = Math.floor(k / 3)
                        positionNormals[indices[k]].add(triangleNormals[triangleIndex])
                        positionNormals[indices[k + 1]].add(triangleNormals[triangleIndex])
                        positionNormals[indices[k + 2]].add(triangleNormals[triangleIndex])

                    }

                    positionNormals.forEach((v:XYZ)=>{
                        v.normalize()
                    })

                }
                else if (this.normalDuplication==NormalDuplication.duplicateVertex||this.normalDuplication==NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr ){

                    let oneStep= (vertexNormal:XYZ,triangleNormal:XYZ,posX,posY,posZ,indexInIndices)=> {

                        if (this.normalDuplication==NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr){
                            if (   geo.xyzAlmostZero(vertexNormal)|| geo.xyzAlmostZero(triangleNormal) ||geo.angleBetweenTwoVectorsBetween0andPi(vertexNormal,triangleNormal)<this.maxAngleBetweenNormals){
                                vertexNormal.add(triangleNormal)
                            }
                            else  {
                                let newIndex=positions.length/3
                                positions.push(posX,posY,posZ)
                                indices[indexInIndices]=newIndex
                                positionNormals.push(triangleNormal)
                            }
                        }
                        else {
                            let newIndex=positions.length/3
                            positions.push(posX,posY,posZ)
                            indices[indexInIndices]=newIndex
                            positionNormals.push(triangleNormal)                        }
                    }

                    for (let k = 0; k < indices.length; k += 3) {
                        let triangleIndex = Math.floor(k / 3)
                        let positionIndex=indices[k]
                        oneStep(positionNormals[positionIndex],triangleNormals[triangleIndex],positions[3*positionIndex],positions[3*positionIndex+1],positions[3*positionIndex+2],k)
                        positionIndex=indices[k+1]
                        oneStep(positionNormals[positionIndex],triangleNormals[triangleIndex],positions[3*positionIndex],positions[3*positionIndex+1],positions[3*positionIndex+2],k+1)
                        positionIndex=indices[k+2]
                        oneStep(positionNormals[positionIndex],triangleNormals[triangleIndex],positions[3*positionIndex],positions[3*positionIndex+1],positions[3*positionIndex+2],k+2)

                    }

                    //positionNormals[indices[k]].add(triangleNormals[triangleIndex])
                    //positionNormals[indices[k + 1]].add(triangleNormals[triangleIndex])
                    //positionNormals[indices[k + 2]].add(triangleNormals[triangleIndex])

                }

                else throw 'wtf'



                let res:number[]=[]
                positionNormals.forEach((v:XYZ)=>{
                    res.push(v.x,v.y,v.z)
                })



                return res

            }

        }

        export enum NormalDuplication{none,duplicateOnlyWhenNormalsAreTooFarr,duplicateVertex}



        export class LinksViewer{

            private mamesh:Mamesh
            private scene:BABYLON.Scene

            parentNode:BABYLON.Node
            //lineRadius=0.05
            lateralScalingConstant=null
            lateralScalingProp=0.05
            tesselation=12

            material:any=null
            color=color.thema.defaultLinkColor

            res:BABYLON.AbstractMesh[]=[]

            meshModel:BABYLON.Mesh



            pairVertexToLateralDirection:(beginVertex:Vertex, endVertex:Vertex)=>XYZ=null


            /**if null (default) all segments will be drawn*/
            segmentOrientationFunction:(begin:Vertex,end:Vertex)=>number=null

            clonesInsteadOfInstances=false

            checkCollision=true
            constructor(mamesh:Mamesh,scene:BABYLON.Scene){
                this.mamesh=mamesh
                this.scene=scene
            }


            private checkArgs(){
                if (this.scene==null) throw 'scene is null'
                if (this.mamesh.vertices.length==0) cc('your IN_mamesh has no vertex')
            }

            go():BABYLON.AbstractMesh[]{

                if (deconnectViewerForTest) return


                this.checkArgs()
                //if (this.IN_mamesh.loopLines==null && this.IN_mamesh.straightLines==null) this.IN_mamesh.fillLineCatalogue()

                if (this.meshModel==null){
                    if (this.material==null){
                        this.material=new BABYLON.StandardMaterial('',this.scene)
                        this.material.diffuseColor=this.color.toBABYLON_Color3()
                    }
                    this.meshModel=BABYLON.Mesh.CreateCylinder('',1,1,1,this.tesselation,5,this.scene)
                    this.meshModel.material=this.material

                }
                /**we hide the model*/
                this.meshModel.scaling=new XYZ(0,0,0)

                if (this.lateralScalingConstant==null){
                    let distance=0
                    let nbVerticesWithLinks=0
                    for (let v of this.mamesh.vertices) {
                        if (v.links.length!=0) {
                            let minDist = Number.MAX_VALUE
                            for (let li of v.links) {
                                let d = geo.distance(v.position, li.to.position)
                                if (d < minDist) minDist = d
                            }
                            distance += minDist
                            nbVerticesWithLinks++
                        }
                    }
                    distance/=nbVerticesWithLinks
                    this.lateralScalingConstant=distance*this.lateralScalingProp
                }


                let alreadyDraw=new StringMap<boolean>()
                for (let vertex of this.mamesh.vertices){
                    for (let link of vertex.links){
                        let key=tab.indicesUpPermutationToString([vertex.hashNumber,link.to.hashNumber])
                        if (alreadyDraw.getValue(key)==null){
                            this.drawOneLink(vertex,link.to)
                            alreadyDraw.putValue(key,true)
                        }
                    }
                }


                return this.res
            }

            private barycenter:XYZ=null
            private middle=new XYZ(0,0,0)


            private  drawOneLink(beginVertex:Vertex,endVertex:Vertex):void{


                if (this.segmentOrientationFunction!=null){
                    if (this.segmentOrientationFunction(beginVertex,endVertex)==0) return

                    if (this.segmentOrientationFunction(beginVertex,endVertex)<0){
                        let temp=beginVertex
                        beginVertex=endVertex
                        endVertex=temp
                    }

                }



                let segment:BABYLON.AbstractMesh
                if (this.clonesInsteadOfInstances ) segment=this.meshModel.clone('')
                else segment=this.meshModel.createInstance('')
                segment.checkCollisions=this.checkCollision
                let elongateAMeshFromBeginToEnd=new ElongateAMeshFromBeginToEnd(beginVertex.position,endVertex.position,segment)
                elongateAMeshFromBeginToEnd.lateralScaling=this.lateralScalingConstant

                if (this.pairVertexToLateralDirection!=null) {
                    elongateAMeshFromBeginToEnd.lateralDirection=this.pairVertexToLateralDirection(beginVertex,endVertex)
                }
                else {
                    if (this.barycenter==null){
                        this.barycenter=new XYZ(0,0,0)
                        for (let v of this.mamesh.vertices) this.barycenter.add(v.position)
                        this.barycenter.scale(1/this.mamesh.vertices.length)
                    }
                    this.middle.copyFrom(beginVertex.position).add(endVertex.position).scale(0.5)
                    this.middle.substract(this.barycenter)
                    elongateAMeshFromBeginToEnd.lateralDirection.copyFrom(this.middle)
                }

                elongateAMeshFromBeginToEnd.goChanging()


                if (this.parentNode!=null) segment.parent=this.parentNode

                this.res.push(segment)





            }

            // private  drawOneLine(lineVertex:Vertex[],i:number,isLoop:boolean):void{
            //
            //
            //     let oneMore=(isLoop)?1:0
            //
            //     for (let i=0;i<lineVertex.length-1+oneMore;i++){
            //
            //         let beginVertex=lineVertex[i]
            //         let endVertex=lineVertex[(i+1)%lineVertex.length]
            //
            //         if (this.segmentSelectionFunction!=null && !this.segmentSelectionFunction(i,[beginVertex,endVertex])) {
            //             this.segmentSelectionFunction(i,[beginVertex,endVertex])
            //             continue
            //         }
            //
            //
            //         let segment:BABYLON.AbstractMesh
            //         if (this.clonesInsteadOfInstances ) segment=this.meshModel.clone('')
            //         else segment=this.meshModel.createInstance('')
            //         segment.checkCollisions=this.checkCollision
            //         let elongateAMeshFromBeginToEnd=new ElongateAMeshFromBeginToEnd(beginVertex.position,endVertex.position,segment)
            //         elongateAMeshFromBeginToEnd.diameter=this.diameter
            //
            //         if (this.positioningToAlignSegmentAlongSomeUpDirections!=null){
            //
            //             elongateAMeshFromBeginToEnd.upVector.copyFrom(this.positioningToAlignSegmentAlongSomeUpDirections.getValue(beginVertex).upVector)
            //                 .add(this.positioningToAlignSegmentAlongSomeUpDirections.getValue(endVertex).upVector).scale(0.5)
            //         }
            //
            //
            //
            //         elongateAMeshFromBeginToEnd.goChanging()
            //
            //
            //         if (this.parentNode!=null) segment.parent=this.parentNode
            //
            //         this.res.push(segment)
            //     }
            //
            //
            //
            //
            // }


        }


        export class LinesViewer{


            lines:Line[]
            /**only useful to compute  a  line-radius which is proportional to the mean-vertex-spacing*/
            vertices:Vertex[]=null

            private scene:BABYLON.Scene
            parentNode:BABYLON.Node

            doNotDrawLinesContainingOnlyInvisibleVertices=true

            /**priority 1*/
            color : Color=null
            /**priority 2*/
            lineToColor:HashMap<Line,Color>=null
            /**priority 3*/
            lineToLevel:HashMap<Line,number>=null

            levelPropToColorFunc=(prop:number)=>new Color(new HSV_01(prop*0.7,1,0.8))


            cap=BABYLON.Mesh.NO_CAP
            tesselation=10

            /**if null, no interpolation*/
            interpolationOption:geometry.InterpolationOption=new geometry.InterpolationOption()

            isThin=false
            constantRadius=null
            radiusProp=0.05
            radiusFunction:(index:number,alphaRatio:number)=>number=null





            private res:BABYLON.Mesh[]=[]

            constructor(mameshOrLines:Mamesh|Line[],scene:BABYLON.Scene){

                if (mameshOrLines instanceof Mamesh){
                    let mamesh=<Mamesh> mameshOrLines
                    if (!mamesh.linesWasMade) mamesh.fillLineCatalogue()
                    this.lines=mamesh.lines
                }
                else{
                    this.lines=<Line[]>mameshOrLines
                }


                this.scene=scene

            }


            //
            // static directionnalLineSelector=(nbExceptionAllowed:number,direction:Direction)=>{
            //     return (index: number,line:Vertex[])=>{
            //         let referenceParam=line[0].param
            //         let exceptionCount=0
            //         for (let vertex of line){
            //             if (vertex.param==null) throw 'no param, we can not see vertical lines'
            //
            //             let a,b=-1
            //             if (direction==Direction.vertical){
            //                 a=vertex.param.x
            //                 b=referenceParam.x
            //             }
            //             else if (direction==Direction.horizontal){
            //                 a=vertex.param.y
            //                 b=referenceParam.y
            //             }
            //             else throw 'not yet done'
            //
            //             cc(referenceParam,vertex.param)
            //             if (! geo.almostEquality(a,b)) {
            //                 exceptionCount++
            //                 referenceParam=vertex.param
            //             }
            //             if (exceptionCount>nbExceptionAllowed) {
            //                 cc('false')
            //                 return false
            //             }
            //         }
            //         return (exceptionCount<=nbExceptionAllowed)
            //     }
            // }




            go():BABYLON.Mesh[]{


                /**even when viewer is de-connected, we can use lineToColor during test*/
                this.buildLineToColor()
                if (deconnectViewerForTest) return

                if (this.scene==null) throw 'scene is null'

                /**OLD: very small rotation because of a bug of babylon : Some strictly vertical lines disappear
                 * */
                //new spacialTransformations.Similitude(this.mamesh.vertices,0.0001).goChanging()


                for (let line of this.lines){
                    if (this.lineToColor.getValue(line)!=null) this.drawOneLine(line)
                }

                return this.res

            }

            clear(){
                for (let mesh of this.res) mesh.dispose()
            }

            private buildLineToColor(){

                /**priority 1*/
                if (this.color!=null){
                    this.lineToColor=new HashMap<Line,Color>()
                    for (let line of this.lines) this.lineToColor.putValue(line,this.color)
                    return
                }

                /**priority 2*/
                if (this.lineToColor!=null) return

                /**priority 3*/
                /**nothing is specified. The level is the index of the line*/
                if (this.lineToLevel==null) {
                    this.lineToLevel=new HashMap<Line, number>()
                    for (let i=0;i<this.lines.length;i++) this.lineToLevel.putValue(this.lines[i],i)
                }
                /**from level to color*/
                let max=tab.maxValue(this.lineToLevel.allValues())
                let min=tab.minValue(this.lineToLevel.allValues())
                this.lineToColor=new HashMap<Line,Color>()
                for (let line of this.lines){
                    let value=this.lineToLevel.getValue(line)
                    if (value!=null){
                        let prop=(value-min)/(max-min)
                        this.lineToColor.putValue(line,this.levelPropToColorFunc(prop))
                    }
                    else  this.lineToColor.putValue(line,null)
                }


            }





            private  drawOneLine(line:Line):void{


                let path:XYZ[]=[]
                let onlyInvisible=true
                line.vertices.forEach((v:Vertex)=>{
                    path.push(v.position)
                    if (!v.isInvisible) onlyInvisible=false
                })

                if (onlyInvisible&& this.doNotDrawLinesContainingOnlyInvisibleVertices) return

                let mesh=this.drawOnePath(line,path)

                this.res.push(mesh)

            }


            private drawOnePath(line:Line,path:XYZ[]):BABYLON.Mesh{

                let res:BABYLON.Mesh

                let smoothPath:XYZ[]
                if (this.interpolationOption!=null&&this.interpolationOption.interpolationStyle!=geometry.InterpolationStyle.none){
                    let lineInterpoler=new geometry.LineInterpoler(path)
                    lineInterpoler.options=this.interpolationOption
                    if (line.isLoop) lineInterpoler.options.loopLine=true
                    smoothPath=lineInterpoler.go()
                }
                else {
                    smoothPath=path
                    if (line.isLoop) smoothPath.push(path[0])
                }

                path=smoothPath

                let color=this.lineToColor.getValue(line).toBABYLON_Color3()


                if (this.isThin){
                    let aa=BABYLON.Mesh.CreateLines('',path,this.scene)
                    aa.color=color
                    res=aa
                }
                else {

                    let modifiedFunction=null

                    if (this.radiusFunction!=null){

                        let pathTotalLength=0
                        for (let i=0;i<path.length-1;i++){
                            pathTotalLength+=geo.distance(path[i],path[i+1])
                        }
                        modifiedFunction= (ind:number,alphaProp:number)=> this.radiusFunction(ind,alphaProp/pathTotalLength)

                        res= BABYLON.Mesh.CreateTube('',path,null,this.tesselation,modifiedFunction,this.cap,this.scene,true,BABYLON.Mesh.FRONTSIDE)

                    }
                    else  {
                        if (this.constantRadius==null){
                           let totalLength=0
                            let nbVertices=0
                            for (let line of this.lines) {
                                for (let i=0;i< line.vertices.length-1;i++) {
                                    totalLength+=geo.distance(line.vertices[i].position,line.vertices[i+1].position)
                                    nbVertices++
                                }
                            }
                            this.constantRadius=totalLength/nbVertices*this.radiusProp
                        }

                        res= BABYLON.Mesh.CreateTube('',path,this.constantRadius,this.tesselation,null,this.cap,this.scene,true,BABYLON.Mesh.FRONTSIDE)
                    }
                }


                let material=new BABYLON.StandardMaterial('',this.scene)
                material.diffuseColor=color
                res.material=material

                if (this.parentNode!=null) res.parent=this.parentNode

                return res

            }


        }






        //
        // class OneLineVisuMaker {
        //
        //     private path:XYZ[]
        //    
        //     isLoop:boolean
        //     babMesh:BABYLON.Mesh
        //     parentNode:BABYLON.Node
        //    
        //     constructor(path:XYZ[],isLoop:boolean,scene:BABYLON.Scene){
        //        
        //         this.scene=scene
        //         this.path=path
        //         this.isLoop=isLoop
        //        
        //     }
        //
        //    
        //
        //
        //
        // }


        export class ElongateAMeshFromBeginToEnd {


            private begin:XYZ
            private end:XYZ
            private modelMesh:BABYLON.AbstractMesh

            lateralScaling=0.05
            /**if the orignal is a round-cylinder, this do not change nothing*/
            lateralDirection=new XYZ(0,0,1)


            constructor(begin:XYZ,end:XYZ,originalMesh:BABYLON.AbstractMesh){
                this.begin=begin
                this.end=end
                this.modelMesh=originalMesh
            }

            private yAxis = new XYZ(0, 1, 0)
            private zAxis = new XYZ(0, 0, 1)
            private direction= new XYZ(0, 0, 0)

            private nothing=new XYZ(0,0,0)

            goChanging( ):BABYLON.AbstractMesh{

                this.direction.copyFrom(this.end).substract(this.begin)
                var length:number = this.direction.length();
                this.direction.normalize();

                var middle:XYZ = new XYZ(0, 0, 0);
                middle.add(this.begin).add(this.end).scale(0.5)


                this.modelMesh.scaling = new XYZ(this.lateralScaling, length, this.lateralScaling);

                this.modelMesh.position = middle;

                let anOrtho = new XYZ(0, 0, 0)

                let copyOfLateralDirection=new XYZ(0,0,0)
                geo.cross(this.direction,this.lateralDirection,this.nothing)
                if (this.nothing.lengthSquared()<geo.epsilon) copyOfLateralDirection.copyFromFloats(Math.random(),Math.random(),Math.random())
                else copyOfLateralDirection.copyFrom(this.lateralDirection)

                geo.orthonormalizeKeepingFirstDirection(this.direction,copyOfLateralDirection,this.nothing,anOrtho)
                let quat = new XYZW(0, 0, 0, 0)

                geo.aQuaternionMovingABtoCD(this.yAxis, this.zAxis, this.direction, anOrtho, quat, true)

                this.modelMesh.rotationQuaternion = quat


                return this.modelMesh


            }
        }







    }



}