

module mathis {

    //
    // export enum Direction{vertical,horizontal,slash,antislash}

    // export var myFavoriteColors={
    //     green:new BABYLON.Color3(124 / 255, 252 / 255, 0)
    //     //greenMathis:new Color(new RGB_range255(124,252,0))
    // }
    
    export class UV{
        u:number
        v:number
        constructor(u:number,v:number){
            this.u=u
            this.v=v
        }
    }
    export class M22{
        m11:number=0
        m12:number=0
        m21:number=0
        m22:number=0

        determinant():number{
            return this.m11*this.m22-this.m21*this.m12
        }

        inverse():M22{
            let res=new M22()
            let det=this.determinant()
            res.m11=this.m22/det
            res.m22=this.m11/det
            res.m12=-this.m12/det
            res.m21=-this.m21/det
            return res
        }

        multiplyUV(uv:UV):UV{
            return new UV(this.m11*uv.u+this.m12*uv.v,this.m21*uv.u+this.m22*uv.v)
        }
        
    }

    export class  XYZ extends BABYLON.Vector3 implements HasHashString{

        //private xyz:XYZ
        //get x(){return this.xyz.x}
        //get y(){return this.xyz.y}
        //get z(){return this.xyz.z}
        //set x(x:number){this.xyz.x=x}
        //set y(y:number){this.xyz.y=y}
        //set z(z:number){this.xyz.z=z}

        static lexicalOrder=(a:XYZ,b:XYZ)=>{
            if (a.x!=b.x) return a.x-b.x
            else if (a.y!=b.y) return a.y-b.y
            else if (a.z!=b.z) return a.z-b.z
            else return 0
        }

        static lexicalOrderInverse=(a:XYZ,b:XYZ)=>{
            return -XYZ.lexicalOrder(a,b)
        }

        /**it is important to rount the number for hash. Because we want that two almost equal vectors have the same hash*/
        static nbDecimalForHash=5
        static resetDefaultNbDecimalForHash(){XYZ.nbDecimalForHash=5}

        get hashString():string{return roundWithGivenPrecision(this.x,XYZ.nbDecimalForHash)+','+roundWithGivenPrecision(this.y,XYZ.nbDecimalForHash)+','+roundWithGivenPrecision(this.z,XYZ.nbDecimalForHash)}
        
        constructor( x:number,   y:number,   z:number) {
            super(x,y,z)
        }

        static newZero():XYZ{
            return new XYZ(0,0,0)
        }

        static newFrom(vect:XYZ):XYZ{
            if (vect==null) return null
            return new XYZ(vect.x,vect.y,vect.z)
        }

        static newOnes():XYZ{
            return new XYZ(1,1,1)
        }

        static newRandom():XYZ{
            return new XYZ(Math.random(),Math.random(),Math.random())
        }

        static temp0(x,y,z):XYZ{
            tempXYZ0.copyFromFloats(x,y,z)
            return tempXYZ0
        }
        static temp1(x,y,z):XYZ{
            tempXYZ1.copyFromFloats(x,y,z)
            return tempXYZ1
        }



        // static temp2(x,y,z):XYZ{
        //     tempXYZ2.copyFromFloats(x,y,z)
        //     return tempXYZ2
        // }
        // static temp3(x,y,z):XYZ{
        //     tempXYZ3.copyFromFloats(x,y,z)
        //     return tempXYZ3
        // }
        // static temp4(x,y,z):XYZ{
        //     tempXYZ4.copyFromFloats(x,y,z)
        //     return tempXYZ4
        // }
        // static temp5(x,y,z):XYZ{
        //     tempXYZ5.copyFromFloats(x,y,z)
        //     return tempXYZ5
        // }
        
        
        // newCopy():XYZ{
        //    return new XYZ(this.x,this.y,this.z)
        //}

        add(vec:XYZ):XYZ{
            geo.add(this,vec,this)
            return this
        }
    
        resizes(vec:XYZ):XYZ{
            this.x*=vec.x
            this.y*=vec.y
            this.z*=vec.z
            return this
        }
        multiply(vec:XYZ):XYZ{
            this.x*=vec.x
            this.y*=vec.y
            this.z*=vec.z
            return this
        }

        length():number{
            return geo.norme(this)
        }
        lengthSquared():number{
            return geo.squareNorme(this)
        }

        substract(vec:XYZ):XYZ{
            geo.substract(this,vec,this)
            return this
        }

        scale(factor:number):XYZ{
            geo.scale(this,factor,this)
            return this
        }

        copyFrom(vect:XYZ):XYZ{
            this.x=vect.x
            this.y=vect.y
            this.z=vect.z
            return this

        }

        copyFromFloats(x:number,y:number,z:number):XYZ{
            this.x=x
            this.y=y
            this.z=z
            return this
        }
        
        
        changeBy(x:number, y:number, z:number){
            this.x=x
            this.y=y
            this.z=z
            return this
        }

        normalize():XYZ{
            var norm=geo.norme(this)
            if (norm<geo.epsilon) throw 'be careful, you have normalized a very small vector'
           

            return this.scale(1/norm)
        }

        almostEqual(vect:XYZ){
            return geo.xyzAlmostEquality(this,vect)
        }


        toString(deci=2):string{
            return '('+this.x.toFixed(deci)+','+this.y.toFixed(deci)+','+this.z.toFixed(deci)+')'
        }

    }
    var tempXYZ0=new XYZ(0,0,0)
    var tempXYZ1=new XYZ(0,0,0)

    
    //TODO rewrite the not-in-place methods
    export class XYZW extends BABYLON.Quaternion{
        constructor( x:number,   y:number,   z:number,w:number) {
            super(x,y,z,w)
        }

        multiply(quat:XYZW):XYZW{
            geo.quaternionMultiplication(quat,this,this)
            return this
        }
        
    }

    export class Hash {
        static segment(a : Vertex,b : Vertex) : string {
            return Segment.segmentId(a.hashNumber,b.hashNumber);
        }

        static segmentOrd(a : Vertex,b : Vertex) {
            if(a.hashNumber > b.hashNumber)
                [a,b] = [b,a];
            return [a,b];
        }

        static quad(a : Vertex,b : Vertex,c : Vertex,d : Vertex) : string {
            [a,b,c,d] = Hash.quadOrd(a,b,c,d);
            return a.hashNumber + "," + b.hashNumber + "," + c.hashNumber + "," + d.hashNumber;
        }

        static quadOrd(a : Vertex,b : Vertex,c : Vertex,d : Vertex) {
            while(a.hashNumber > b.hashNumber || a.hashNumber > c.hashNumber || a.hashNumber > d.hashNumber)
                [a,b,c,d] = [b,c,d,a];
            if(b.hashNumber < d.hashNumber)
                [b,d] = [d,b];
            return [a,b,c,d];
        }
    }


    export class Positioning{
        position:XYZ = new XYZ(0,0,0)
        frontDir:XYZ = new XYZ(1, 0, 0)
        upVector:XYZ = new XYZ(0, 1, 0)
        scaling=new XYZ(1,1,1)
        
        private defaultUpDirIfTooSmall=new XYZ(1,1,0)
        private defaultFrontDirIfTooSmall=new XYZ(0,0,1)
        
        
        copyFrom(positionning:Positioning):void{
            this.position=XYZ.newFrom(positionning.position)
            this.upVector=XYZ.newFrom(positionning.upVector)
            this.frontDir=XYZ.newFrom(positionning.frontDir)
            this.scaling=XYZ.newFrom(positionning.scaling)
        }


        changeFrontDir(vector:XYZ):void {
            geo.orthonormalizeKeepingFirstDirection(vector, this.upVector, this.frontDir, this.upVector)
        }
        changeUpVector(vector:XYZ):void {
            geo.orthonormalizeKeepingFirstDirection( this.upVector,vector , this.upVector,this.frontDir)
        }
        
        setOrientation(frontDir,upVector){
            this.upVector=new XYZ(0, 0, 0)
            this.frontDir=new XYZ(0, 0, 0)
            geo.orthonormalizeKeepingFirstDirection( frontDir,upVector , this.frontDir,this.upVector)
        }
        
        
        
        quaternion(preserveUpVectorInPriority=true):XYZW{
            
            if (this.frontDir==null && this.upVector==null) throw 'you must precise a frontDir or a upVector or both of them'
            
            else if (this.frontDir==null) {
                this.frontDir=new XYZ(0,0,0)
                geo.getOneOrthonormal(this.upVector,this.frontDir)
            }
            else if (this.upVector==null){
                this.upVector=new XYZ(0,0,0)
                geo.getOneOrthonormal(this.frontDir,this.upVector)
            }

            if (this.frontDir.length()<geo.epsilon) {
                this.frontDir=this.defaultFrontDirIfTooSmall
                logger.c('a tangent was too small, and so replaced by a default one')
            }
            if (this.upVector.length()<geo.epsilon) {
                this.upVector=this.defaultUpDirIfTooSmall
                logger.c('a normal was too small, and so replaced by a default one')
            }
            let quaternion=new XYZW(0,0,0,1)
            geo.twoVectorsToQuaternion(this.frontDir,this.upVector,!preserveUpVectorInPriority,quaternion)
            
            return quaternion
        }



        applyToMeshes(meshes:BABYLON.Mesh[]){
            let quaternion=null
            if (this.frontDir!=null||this.upVector!=null) quaternion=this.quaternion()
            for (let mesh of meshes){
                if(this.scaling!=null) mesh.scaling=this.scaling
                if(quaternion!=null) mesh.rotationQuaternion=quaternion
                if(this.position!=null) mesh.position=this.position
            }
        }

        applyToVertices(vertices:Vertex[]){
            let quaternion=this.quaternion()
            let matrix=new MM()
            geo.quaternionToMatrix(quaternion,matrix)
            
            for (let vertex of vertices){
                vertex.position.multiply(this.scaling)
                geo.multiplicationMatrixVector(matrix,vertex.position,vertex.position)
                vertex.position.add(this.position)
            }
        }
        
        
        
        //smoothParam = 0.5

        //
        // almostEqual(camCarac:Positioning):boolean {
        //     return geo.xyzAlmostEquality(this.position, camCarac.position) && geo.xyzAlmostEquality(this.upVector, camCarac.upVector) && geo.xyzAlmostEquality(this.frontDir, camCarac.frontDir)
        // }
        //
        // goCloser(positioning:Positioning):void {
        //     geo.between(positioning.position, this.position, this.smoothParam, this.position)
        //     geo.between(positioning.upVector, this.upVector, this.smoothParam, this.upVector)
        //     geo.between(positioning.frontDir, this.frontDir, this.smoothParam, this.frontDir)
        // }
        // copyFrom(positioning:Positioning) {
        //     geo.copyXYZ(positioning.position, this.position)
        //     geo.copyXYZ(positioning.upVector, this.upVector)
        //     geo.copyXYZ(positioning.frontDir, this.frontDir)
        // }
        //
        // changeFrontDir(vector:XYZ):void {
        //     geo.orthonormalizeKeepingFirstDirection(vector, this.upVector, this.frontDir, this.upVector)
        // }
        // changeUpVector(vector:XYZ):void {
        //     geo.orthonormalizeKeepingFirstDirection( this.upVector,vector , this.upVector,this.frontDir)
        // }

    }


    export class  MM extends BABYLON.Matrix{
        //private mm:MM
        //get m(){return this.mm.m}

        //public m=new Float32Array(16)

        constructor(){
            super()
        }

        static newIdentity():MM{
            var res=new MM()
            res.m[0]=1
            res.m[5]=1
            res.m[10]=1
            res.m[15]=1
            return res
        }



        static newFrom(matr:MM):MM{
            var res=new MM()
            for (var i=0;i<16;i++) res.m[i]=matr.m[i]
            return res
        }

        static newRandomMat():MM{
            var res=new MM()
            for (var i=0;i<16;i++) res.m[i]=Math.random()
            return res
        }

        static newZero():MM{
            return new MM()
        }

        equal(matr:MM):boolean{
            return geo.matEquality(this,matr)
        }
        almostEqual(matr:MM):boolean{
            return geo.matAlmostEquality(this,matr)
        }

        leftMultiply(matr:MM):MM{
            geo.multiplyMatMat(matr,this,this)
            return this
        }

        rightMultiply(matr:MM):MM{
            geo.multiplyMatMat(this,matr,this)
            return this
        }

        inverse():MM{
            geo.inverse(this,this)
            return this
        }

        copyFrom(matr:MM):MM{
            geo.copyMat(matr,this)
            return this
        }


        transpose():MM{
            geo.transpose(this,this)
            return this
        }




        toString():string{
            return "\n"+
                this.m[0]+this.m[1]+this.m[2]+this.m[3]+"\n"+
                this.m[4]+this.m[5]+this.m[6]+this.m[7]+"\n"+
                this.m[8]+this.m[9]+this.m[10]+this.m[11]+"\n"+
                this.m[12]+this.m[13]+this.m[14]+this.m[15]+"\n"

        }
    }


    export class Link{
        to:Vertex
        opposites:Link[]
        weight:number
        customerOb:any=null

        constructor(to:Vertex){
            if (to==null) throw 'a links is construct with a null vertex'
            this.to=to
        }

    }

    /** An element of a graph */
    export class Vertex {

        static hashCount=0
        private _hashCode:number
        get hashNumber():number{return this._hashCode}
        get hashString():string{return this._hashCode+''}

        /**link lead to an other vertex*/
        links:Link[]=[]
        /**position in the 3d space*/
        position:XYZ


        isInvisible=false
        dichoLevel=0
        param:XYZ
        markers:Vertex.Markers[]=[]
        importantMarker:Vertex.Markers
        customerObject:any={}


        setPosition(x:number,y:number,z:number,useAlsoTheseValuesForParam=true):Vertex{
            this.position=new XYZ(x,y,z)
            if(useAlsoTheseValuesForParam) this.param=new XYZ(x,y,z)
            return this
        }



        
        hasMark(mark:Vertex.Markers):boolean{
            return(this.markers.indexOf(mark)!=-1)
        }
        
        constructor(){
            this._hashCode=Vertex.hashCount++
        }

        getOpposites(vert1:Vertex):Vertex[]{
            let fle=this.findLink(vert1)
            if (fle==null) throw "the vertex is not a neighbor. Probably your neighborhood relation is not symetric. " +
            "Please, perform the graph analysis, with the help of the function linkModule.checkTheRegularityOfAGRaph"

            if (fle.opposites==null) return null
            
            let res:Vertex[]=[]
            for (let li of fle.opposites) res.push(li.to)
            
            return res

        }

        hasBifurcations():boolean{
            for (let link of this.links){
                if (link.opposites!=null && link.opposites.length>1) return true
            }
            return false
        }
        
        hasVoisin(vertex:Vertex):boolean{
            for (let link of this.links){
                if (link.to==vertex) return true
            }
            return false
        }
        
        isBorder(){return this.hasMark(Vertex.Markers.border)}

        findLink(vertex:Vertex):Link{
            for (let fle of this.links){
                if (fle.to==vertex) return fle
            }
            return null
        }

        /** set two links in opposition. 
         * If one of them exists (eg as a link with no opposition) the opposition is created */
        setTwoOppositeLinks(cell1:Vertex, cell2:Vertex):Vertex{

            let link1=this.findLink(cell1)
            let link2=this.findLink(cell2)

            if(link1==null) {
                link1=new Link(cell1)
                this.links.push(link1)
            }
            if(link2==null) {
                link2=new Link(cell2)
                this.links.push(link2)
            }

            if (link1.opposites==null) link1.opposites=[]
            if (link2.opposites==null) link2.opposites=[]

            link1.opposites.push(link2)
            link2.opposites.push(link1)
            
            return this

        }

        /**set a simple link between this and vertex.
         *  if such a link already existe (even with somme oppositions, it is suppressed)*/
        setOneLink(vertex:Vertex):Vertex{

            if (vertex==this) throw "it is forbidden to link to itself"
            
            this.suppressOneLink(vertex)

            this.links.push(new Link(vertex))
            return this
        }


        static separateTwoVoisins(v1:Vertex,v2:Vertex):void{
            v1.suppressOneLink(v2)
            v2.suppressOneLink(v1)
        }
        

      
        
        /**to completely separate to vertex, you have to apply this procedure on both the two vertices*/
        private suppressOneLink(voisin:Vertex):void{

            let link=this.findLink(voisin)
            if (link==null) return
            
            tab.removeFromArray(this.links,link)
            if (link.opposites!=null) {
                for (let li of link.opposites){
                    if (li.opposites.length>=2) tab.removeFromArray(li.opposites,link)
                    else li.opposites=null
                }
            }
        }
  
        changeToLinkWithoutOpposite(voisin:Vertex):void{
            let link=this.findLink(voisin)
            if (link==null) return

            if (link.opposites!=null) {
                for (let li of link.opposites){
                    if (li.opposites.length>=2) tab.removeFromArray(li.opposites,link)
                    else li.opposites=null
                }
            }
            link.opposites=null
            
        }
        

        
        
        toString(toSubstract:number):string{
            let res=(this.hashNumber-toSubstract)+""
            return res
        }

        toStringComplete(toSubstract:number):string{
            let res=this.hashNumber-toSubstract+"|links:"
            for (let fle of this.links) {
                let bif=""
                if (fle.opposites!=null){
                    bif+=","
                    for (let li of fle.opposites) bif+=(li.to.hashNumber-toSubstract)+","
                }

                res+="("+(fle.to.hashNumber-toSubstract) + bif  + ")"
            }
            if(this.position!=null) res+="|pos:"+this.position.toString(1)+','
            res+="|mark:"
            for (let mark of this.markers) res+=Vertex.Markers[mark]+','
            return res
        }

    }


    export module Vertex{
        export enum Markers{honeyComb,corner,center,border,polygonCenter,selectedForLineDrawing}

    }

    
    
    /**A graph but not only : it contains vertices but also lines passing through vertices.
     * Most of time a Mamesh is a graph on a surface, so it contains square/triangle between vertices. 
     * It can contain also many other informations e.g. {@link vertexToPositioning} or {@link lineToColor} which are useful
     * to represent a Mamesh */
    export class Mamesh{

        /**'points' of a graph*/
        vertices :Vertex[]=[]
        /**lines passing through vertices*/
        lines:Line[]
        /**surface element between vertices*/
        smallestTriangles :Vertex[]=[]
        smallestSquares:Vertex[]=[]
        /** Hexahedron configuration
         *   4   7
         *  /|   |
         * 3-+-2 |
         *   | | |
         *   5-+-6
         *     |
         * 0---1
         *
         * Coplanar faces ; order (for vectorial product) important.
         * */
        hexahedrons : Vertex[] = [];
        

        /**to each vertex can be associate a positioning
         * is initialised to null: some classes, if null, create a positioning and save it in this field*/
        vertexToPositioning:HashMap<Vertex,Positioning>

        /**to perform dichotomy*/
        cutSegmentsDico :{[id:string]:Segment}={}

        name:string


        //symmetries:((a:XYZ)=>XYZ)[]
        
        
        get polygons():Vertex[][]{
            let res=[]
            for (let i=0;i< this.smallestSquares.length;i+=4) res.push([this.smallestSquares[i],this.smallestSquares[i+1],this.smallestSquares[i+2],this.smallestSquares[i+3]])
            for (let i=0;i< this.smallestTriangles.length;i+=3) res.push([this.smallestTriangles[i],this.smallestTriangles[i+1],this.smallestTriangles[i+2]])
            return res
        }
        
        //linksOK=false
        

        get linesWasMade(){
            return this.lines!=null
        }
        
        get segments():Vertex[][]{
            let res:Vertex[][]=[]
            
            for (let vertex of this.vertices){
                for (let link of vertex.links){
                    if (vertex.hashNumber<link.to.hashNumber) res.push([vertex,link.to])
                }
            }
            return res
        }
        
        
        

        addATriangle(a:Vertex, b:Vertex, c:Vertex):Mamesh {
            this.smallestTriangles.push(a,b,c);
            return this
        }

        addASquare(a:Vertex, b:Vertex, c:Vertex,d:Vertex):Mamesh {
            this.smallestSquares.push(a,b,c,d);
            return this
        }

        addHexahedron(pos : Vertex[]) : Mamesh {
            this.hexahedrons.concat(pos);
            return this;
        }

        getVertex(pos : XYZ) {
            let v = this.findVertexFromParam(pos);
            if(v == null)
                v = this.newVertex(pos);
            return v;
        }

        newVertex(position:XYZ,dichoLevel=0,param?:XYZ):Vertex{
            let vertex=new Vertex()
            vertex.position=position
            vertex.param=(param)?param:position
            vertex.dichoLevel=dichoLevel
            this.addVertex(vertex)
            return vertex
        }
        
        
        
        
        findVertexFromParam(param:XYZ):Vertex{
            
            for (let v of this.vertices){
                if (v.param.hashString==param.hashString) return v
            }
            return null
        }
        
        addVertex(vertex:Vertex):void{
              this.vertices.push(vertex)
        }
        

        
        
        hasVertex(vertex:Vertex):boolean{
            for (let ver of this.vertices){
                if (ver.hashNumber==vertex.hashNumber) return true
            }
            return false
        }

        
        getStraightLines():Line[]{
            let res=[]
            for (let line of this.lines){
                if (!line.isLoop) res.push(line)
            }
            return res
        }

        getLoopLines():Line[]{
            let res=[]
            for (let line of this.lines){
                if (line.isLoop) res.push(line)
            }
            return res
        }

        getStraightLinesAsVertices():Vertex[][]{
            let res=[]
            for (let line of this.lines){
                if (!line.isLoop) res.push(line.vertices)
            }
            return res
        }

        getLoopLinesAsVertices():Vertex[][]{
            let res=[]
            for (let line of this.lines){
                if (line.isLoop) res.push(line.vertices)
            }
            return res
        }
        
        
        
        toString(substractHashCode=true):string{

            let toSubstract=0
            if (substractHashCode){
                toSubstract=Number.MAX_VALUE
                for (let vert of this.vertices){
                    if (vert.hashNumber<toSubstract) toSubstract=vert.hashNumber
                }


            }


            let res="\n"
            if (this.name!=null) res+=this.name+"\n"
            for (let vert of this.vertices){
                res+=vert.toStringComplete(toSubstract)+"\n"
            }
            res+="tri:"
            for (let j=0;j<this.smallestTriangles.length;j+=3){
                res+="["+(this.smallestTriangles[j].hashNumber-toSubstract)+","+(this.smallestTriangles[j+1].hashNumber-toSubstract)+","+(this.smallestTriangles[j+2].hashNumber-toSubstract)+"]"
            }
            res+="\nsqua:"
            for (let j=0;j<this.smallestSquares.length;j+=4){
                res+="["+(this.smallestSquares[j].hashNumber-toSubstract)+","+(this.smallestSquares[j+1].hashNumber-toSubstract)+","+(this.smallestSquares[j+2].hashNumber-toSubstract)+","+(this.smallestSquares[j+3].hashNumber-toSubstract)+"]"
            }


            if (this.linesWasMade) {
                
                
                res += "\nstrai:"
                for (let line of this.getStraightLines()) {
                    res += "["
                    for (let ver of line.vertices) {
                        res += (ver.hashNumber-toSubstract) + ","
                    }
                    res += "]"
                }
           
                res += "\nloop:"
                for (let line of this.getLoopLines()) {
                    res += "["
                    for (let ver of line.vertices) {
                        res += (ver.hashNumber-toSubstract) + ","
                    }
                    res += "]"
                }
            }

            res+="\ncutSegments"
            for (let key in this.cutSegmentsDico){
                let segment=this.cutSegmentsDico[key]
                res+= '{'+(segment.a.hashNumber-toSubstract)+','+(segment.middle.hashNumber-toSubstract)+','+(segment.b.hashNumber-toSubstract)+'}'
            }


            // res+="\nparamToVertex"
            // //let key:XYZ
            // for (let key of this.paramToVertex.allKeys()){
            //     res+=key.hashString+':'+(this.paramToVertex.getValue(key).hashNumber-toSubstract)+'|'
            // }
            



            return res


        }



        fillLineCatalogue(startingVertices:Vertex[]=this.vertices):void{
            this.lines=lineModule.makeLineCatalogue2(startingVertices,true)
        }
        addSimpleLinksAroundPolygons():void{
            new linkModule.SimpleLinkFromPolygonCreator(this).goChanging()
        }
        addOppositeLinksAroundPolygons():void{
            new linkModule.SimpleLinkFromPolygonCreator(this).goChanging()
            new linkModule.OppositeLinkAssocierByAngles(this.vertices).goChanging()
            
            //new linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(this).goChanging()
        }

        
        
        /** A IN_mamesh can be include in a larger graph. This method cut all the link going outside.
         * This method is often use after a submamesh extraction */
        isolateMameshVerticesFromExteriorVertices():void{
            let verticesAndLinkToSepare:{vertex:Vertex;link:Link}[]=[]
            for (let vertex of this.vertices){
                for (let link of vertex.links){
                    if (!this.hasVertex(link.to)) verticesAndLinkToSepare.push({vertex:vertex,link:link})
                }
            }
            for (let vl of verticesAndLinkToSepare){
                Vertex.separateTwoVoisins(vl.link.to,vl.vertex)
                //vl.vertex.suppressOneLink(vl.link.to,true)
                //vl.link.to.suppressOneLink(vl.vertex,false)
            }
        }
        

        
        getOrCreateSegment(v1:Vertex,v2:Vertex,segments:{[id:string]:Segment}):void{
            let res=this.cutSegmentsDico[Segment.segmentId(v1.hashNumber,v2.hashNumber)]
            if(res==null) {
                res=new Segment(v1,v2)
                this.cutSegmentsDico[Segment.segmentId(v1.hashNumber,v2.hashNumber)]=res
            }
            segments[Segment.segmentId(v1.hashNumber,v2.hashNumber)]=res
        }


        
        maxLinkLength():number{
            let res=-1
            
            this.vertices.forEach(vert=>{
                vert.links.forEach(li=>{
                    let dist=geo.distance(vert.position,li.to.position)
                    if (dist>res) res=dist
                })
            })
            
            if (res==-1) throw 'your IN_mamesh seems empty'
            
            return res
        }

        
        
        
        
        // standartDeviationOfLinks():number{
        //     let res=0
        //     let nb=0
        //
        //     this.vertices.forEach(v=>{
        //         v.links.forEach(l=>{
        //             nb++
        //             res+=geo.squaredDistance(v.position,l.to.position)
        //         })
        //
        //     })
        //    
        //     return Math.sqrt(res)/nb
        //
        // }


        clearLinksAndLines():void{

            this.vertices.forEach(v=>{
                tab.clearArray(v.links)
            })
            this.lines=null
        }

        clearOppositeInLinks():void{

            this.vertices.forEach(v=>{
                v.links.forEach((li:Link)=>{
                    li.opposites=null
                })
            })
            //this.loopLines=null
            //this.straightLines=null
        }


        allLinesAsASortedString(substractHashCode=true):string{
            let res=""

            let stringTab:string[]
            let toSubstract

            if (substractHashCode){
                toSubstract=Number.MAX_VALUE
                for (let vert of this.vertices){
                    if (vert.hashNumber<toSubstract) toSubstract=vert.hashNumber
                }
            }


            if (this.linesWasMade) {
                let straigth=this.getStraightLines()
                let loop=this.getLoopLines()
                if (this.linesWasMade && straigth.length > 0) {

                    stringTab = []
                    straigth.forEach(li=> {
                        let line=li.vertices
                        let hashTab:number[] = []
                        line.forEach(v=> {
                            hashTab.push(v.hashNumber - toSubstract)
                        })
                        stringTab.push(JSON.stringify(hashTab))
                    })
                    stringTab.sort()

                    res = "straightLines:" + JSON.stringify(stringTab)
                }


                if (loop.length > 0) {

                    stringTab = []
                    loop.forEach(li=> {
                        let line=li.vertices
                        let hashTab:number[] = []
                        line.forEach(v=> {
                            hashTab.push(v.hashNumber - toSubstract)
                        })

                        let minIndex = tab.minIndexOfNumericList(hashTab)
                        let permutedHashTab:number[] = []
                        for (let i = 0; i < hashTab.length; i++) {
                            permutedHashTab[i] = hashTab[(i + minIndex) % hashTab.length]
                        }

                        stringTab.push(JSON.stringify(permutedHashTab))
                    })
                    stringTab.sort()

                    res += "|loopLines:" + JSON.stringify(stringTab)

                }
            }
            return res

        }


        allSquareAndTrianglesAsSortedString(subtractHashCode=true):string{
            let toSubtract:number=0
            if (subtractHashCode){
                toSubtract=Number.MAX_VALUE
                for (let vert of this.vertices){
                    if (vert.hashNumber<toSubtract) toSubtract=vert.hashNumber
                }
            }
            
            let resSquare="square:"+this.allSquaresOrTrianglesAsASortedString(this.smallestSquares,4,toSubtract)
            let resTri="triangle:"+this.allSquaresOrTrianglesAsASortedString(this.smallestTriangles,3,toSubtract)
            return resSquare+resTri
            
        }

        private allSquaresOrTrianglesAsASortedString(squareOrTriangles:Vertex[],blockSize:number,toSubtract):string{
            let res=""

            let stringTab:string[]

            
            let listOfPoly:Vertex[][]=[]
            
            for (let i=0;i<squareOrTriangles.length;i+=blockSize){
                let block:Vertex[]=[]
                for (let j=0;j<blockSize;j++) block.push(squareOrTriangles[i+j])
                listOfPoly.push(block)
            }

            stringTab = []
            listOfPoly.forEach(line=> {
                    let hashTab:number[] = []
                    line.forEach(v=> {
                        hashTab.push(v.hashNumber - toSubtract)
                    })

                    let minIndex = tab.minIndexOfNumericList(hashTab)
                    let permutedHashTab:number[] = []
                    for (let i = 0; i < hashTab.length; i++) {
                        permutedHashTab[i] = hashTab[(i + minIndex) % hashTab.length]
                    }

                    stringTab.push(JSON.stringify(permutedHashTab))
                })
                stringTab.sort()

                res +=  JSON.stringify(stringTab)


            return res

        }

    }


    export class Line{
        
        vertices:Vertex[]
        isLoop:boolean
        
        

        getVertex(index,loopIfLoop=true):Vertex{
            if (this.isLoop&& loopIfLoop) return this.vertices[index%this.vertices.length]
            else return this.vertices[index]
        }

        hashForDirected():string{
            let decayList:number[]=[]
            if (!this.isLoop){
                for (let v of this.vertices) decayList.push(v.hashNumber)
            }
            else {
                let minIndex=tab.minIndexOb<Vertex>(this.vertices,(v1,v2)=>v1.hashNumber-v2.hashNumber)
                for (let i=0;i<this.vertices.length;i++) decayList.push(this.vertices[(i+minIndex)%this.vertices.length].hashNumber)
            }
            return JSON.stringify(decayList)
        }
        
        inverted():Line{
            let invertedVert:Vertex[]=[]
            for (let i=0;i<this.vertices.length;i++) invertedVert.push(this.vertices[this.vertices.length-1-i])
            return new Line(invertedVert,this.isLoop)
        }
        positionList():XYZ[]{
            let res:XYZ[]=[]
            for (let v of this.vertices) res.push(v.position)
            return res
        }
        
        get hashString():string{
            let hash1=this.hashForDirected()
            let hash2=this.inverted().hashForDirected()
            return (hash1<hash2)? hash1 : hash2
        }

        
        positionnalHashForDirected(precision=1):string{
            let listOfHash:string[]=[]
            XYZ.nbDecimalForHash=precision
            if (!this.isLoop){
                for (let v of this.vertices) listOfHash.push(v.position.hashString)
            }
            else {
                let positionList=this.positionList()
                let minIndex=tab.minIndexOb<XYZ>(positionList,XYZ.lexicalOrder)
                for (let i=0;i<positionList.length;i++) listOfHash.push(positionList[(i+minIndex)%positionList.length].hashString)
            }
            XYZ.resetDefaultNbDecimalForHash()
            return JSON.stringify(listOfHash)
        }
        
        positionnalHash(precision=1):string{
            let hash1=this.positionnalHashForDirected(precision)
            let hash2=this.inverted().positionnalHashForDirected(precision)
            return (hash1<hash2)? hash1 : hash2
        }
        
        //
        // hashStringUpToSymmetries(symmetries:((xyz:XYZ)=>XYZ)[],precision=1):string{
        //    
        //     let symmetriesAndIdentity=symmetries.concat((xyz:XYZ)=>xyz)
        //    
        //     let firstPosSymmetrised:XYZ[]=[]
        //     for (let sym of symmetriesAndIdentity) firstPosSymmetrised.push(sym(this.vertices[0].position))
        //     let lesserFirst=tab.minValueOb<XYZ>(firstPosSymmetrised,XYZ.lexicalOrder)
        //
        //     let lastPosSymmetrized:XYZ[]=[]
        //     for (let sym of symmetriesAndIdentity) lastPosSymmetrized.push(sym(this.vertices[this.vertices.length-1].position))
        //     let lesserLast=tab.minValueOb<XYZ>(lastPosSymmetrized,XYZ.lexicalOrder)
        //    
        //     let chosenSym:(xyz:XYZ)=>XYZ
        //     let chosenOrder:Vertex[]
        //
        //     if (XYZ.lexicalOrder(lesserFirst,lesserLast)  <0){
        //         let chosenSymInd=firstPosSymmetrised.indexOf(lesserFirst)
        //         chosenSym=symmetriesAndIdentity[chosenSymInd]
        //         chosenOrder=this.vertices
        //     }
        //     else{
        //         let chosenSymInd=lastPosSymmetrized.indexOf(lesserLast)
        //         chosenSym=symmetriesAndIdentity[chosenSymInd]
        //         chosenOrder=[]
        //         for (let i=0;i<this.vertices.length;i++) chosenOrder.push(this.vertices[this.vertices.length-1-i])
        //     }
        //
        //     let res:string[]=[]
        //     XYZ.nbDecimalForHash=precision
        //     for (let a of chosenOrder) res.push(chosenSym(a.position).hashString)
        //     XYZ.resetDefaultNbDecimalForHash()
        //    
        //    
        //     return JSON.stringify(res)
        //    
        // }
        //


        hashStringUpToSymmetries(symmetries:((xyz:XYZ)=>XYZ)[],positionVersusParam):string{

            let linesHash=[this.positionnalHash()]

            for (let sym of symmetries){
                let symV:Vertex[]=[]
                for (let v of this.vertices) {
                    let vert=new Vertex()
                    if(positionVersusParam) vert.position=sym(v.position)
                    else vert.position=sym(v.param)
                    symV.push(vert)
                }
                let line=new Line(symV,this.isLoop)
                linesHash.push(line.positionnalHash())
            }

            return tab.minValueString(linesHash)

        }
        
        constructor(vertices:Vertex[],isLoop:boolean){
            this.vertices=vertices
            this.isLoop=isLoop
        }
        
        allSegments():Segment[]{
            let res=[]
            let oneMore=(this.isLoop) ?1:0
            for (let i=0;i<this.vertices.length-1+oneMore;i++){
                res.push(new Segment(this.vertices[i],this.vertices[(i+1)%this.vertices.length]))
            }
            return res
        }
        
    }
    
    
    
    export class Segment {

        static segmentId(a:number, b:number):string{
            if (a<b) return a+','+b
            else return b+','+a
        }


        public a:Vertex
        public b:Vertex
        public middle:Vertex
        public orth1:Vertex
        public orth2:Vertex


        
        get hashString():string{return Segment.segmentId(this.a.hashNumber,this.b.hashNumber)}
        
        constructor(c:Vertex, d:Vertex) {
            this.a = (c.hashNumber < d.hashNumber) ? c : d;
            this.b = (c.hashNumber < d.hashNumber) ? d : c;

        }

        equals(ab:Segment):boolean {
            return this.a == ab.a && this.b == ab.b;
        }

        getOther(c:Vertex) {
            if (c == this.a) return this.b;
            else return this.a;
        }

        getFirst():Vertex {
            return this.a
        }

        getSecond():Vertex {
            return this.b
        }

        has(c:Vertex):boolean {
            return c == this.a || c == this.b
        }
        

    }




}






