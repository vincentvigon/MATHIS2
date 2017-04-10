// /**
// * Created by vigon on 25/01/2016.
// */
//
//
// module mathis{
//    export module flat{
//
//
//
//        export enum StickingMode{simple,inverse,none}
//
//        export class Rectangle{
//            nbX=4
//            nbY=3
//
//            minX=0
//            maxX=1
//            minY=0
//            maxY=1
//
//            protected mamesh:Mamesh
//
//            makeLinks=false
//            addTriangleOrSquare=true
//
//            borderStickingVertical=StickingMode.none
//            borderStickingHorizontal=StickingMode.none
//
//            nbVerticalDecays=0
//            nbHorizontalDecays=0
//
//
//
//
//            holeParameters= new Array<XYZ>()
//
//            protected paramIsHole(param:XYZ):boolean{
//                for (let i in this.holeParameters) {
//                    let pa:XYZ=this.holeParameters[i]
//                    if (geo.xyzAlmostEquality(param,pa)) return true
//                }
//                return false
//
//
//            }
//
//            //
//            //public stickingFunction: (i:number,j:number,nbX:number,nbY:number)=>{i:number;j:number} =null
//
//
//            constructor( mamesh:Mamesh){
//                this.IN_mamesh=IN_mamesh
//            }
//
//            //
//            //private buildStickingFunction():(i:number,j:number,nbX:number,nbY:number)=>{i:number;j:number}{
//            //
//            //    let resFunction= (i,j,nbX,nbY)=>{
//            //        let iRes=null
//            //        let jRes=null
//            //
//            //        if (j>=0 && j<nbY && i>=0 && i<nbX  ){
//            //            iRes=i
//            //            jRes=j
//            //            return {i:iRes,j:jRes}
//            //        }
//            //
//            //        if (this.borderStickingVertical==StickingMode.simple){
//            //
//            //            if (i==-1){
//            //                iRes=nbX-1
//            //                jRes=modulo(j,nbY)
//            //            }
//            //
//            //
//            //        }
//            //
//            //
//            //
//            //
//            //
//            //
//            //
//            //        if (i==-1) iRes=nbX-1
//            //        else if (i==nbX) iRes=0
//            //        else if (i>=0 && i<nbX) iRes=i
//            //
//            //        if (j==-1) jRes=nbY-1
//            //        else if (j==nbY) jRes=0
//            //        else if (j>=0 && j<nbY) jRes=j
//            //
//            //        return {i:iRes,j:jRes}
//            //
//            //    }
//            //
//            //
//            //    return resFunction
//            //
//            //
//            //}
//            //
//            //
//            //private buildStickingFunction(verticalMode:StickingMode,horizontalMode:StickingMode):(i:number,j:number,nbX:number,nbY:number)=>{i:number;j:number}{
//            //
//            //    let resFunction=null
//            //
//            //
//            //    if (verticalMode==StickingMode.simple && horizontalMode==StickingMode.simple  ){
//            //
//            //        resFunction= (i,j,nbX,nbY)=>{
//            //            let iRes=null
//            //            let jRes=null
//            //
//            //            if (i==-1) iRes=nbX-1
//            //            else if (i==nbX) iRes=0
//            //            else if (i>=0 && i<nbX) iRes=i
//            //
//            //            if (j==-1) jRes=nbY-1
//            //            else if (j==nbY) jRes=0
//            //            else if (j>=0 && j<nbY) jRes=j
//            //
//            //            return {i:iRes,j:jRes}
//            //
//            //        }
//            //
//            //    }
//            //    else if (verticalMode==StickingMode.simple && horizontalMode==StickingMode.none  ){
//            //
//            //        resFunction= (i,j,nbX,nbY)=>{
//            //            let iRes=null
//            //            let jRes=null
//            //
//            //            if (j>=0 && j<nbY) jRes=j
//            //
//            //            if (i==-1) iRes=nbX-1
//            //            else if (i==nbX) iRes=0
//            //            else if (i>=0 && i<nbX) iRes=i
//            //
//            //            return {i:iRes,j:jRes}
//            //
//            //        }
//            //
//            //    }
//            //
//            //    else if (verticalMode==StickingMode.simple && horizontalMode==StickingMode.inverse  ){
//            //
//            //        resFunction= (i,j,nbX,nbY)=>{
//            //            let iRes=null
//            //            let jRes=null
//            //
//            //            if (j>=0 && j<nbY){
//            //
//            //                if (i==-1) iRes=nbX-1
//            //                else if (i==nbX) iRes=0
//            //                else if (i>=0 && i<nbX) iRes=i
//            //            }
//            //
//            //            else {
//            //
//            //                if (j==-1){
//            //                    jRes=nbY-1
//            //
//            //                    if (i<=-1) iRes=null
//            //                    else if (i>=nbX) iRes=null
//            //                    else iRes= nbX-1-i
//            //                }
//            //                else if (j==nbY){
//            //                    jRes=0
//            //                    if (i<=-1) iRes=null
//            //                    else if (i>=nbX) iRes=null
//            //                    else iRes= nbX-1-i
//            //                }
//            //
//            //            }
//            //
//            //
//            //            return {i:iRes,j:jRes}
//            //
//            //        }
//            //
//            //    }
//            //    else if (verticalMode==StickingMode.none && horizontalMode==StickingMode.inverse  ){
//            //
//            //        resFunction= (i,j,nbX,nbY)=>{
//            //            let iRes=null
//            //            let jRes=null
//            //
//            //            if (j>=0 && j<nbY && i>=0 && i<nbX  ){
//            //                    iRes=i
//            //                    jRes=j
//            //            }
//            //            else {
//            //
//            //                if (j==-1){
//            //                    jRes=nbY-1
//            //
//            //                    if (i<=-1) iRes=null
//            //                    else if (i>=nbX) iRes=null
//            //                    else iRes= nbX-1-i
//            //                }
//            //                else if (j==nbY){
//            //                    jRes=0
//            //                    if (i<=-1) iRes=null
//            //                    else if (i>=nbX) iRes=null
//            //                    else iRes= nbX-1-i
//            //                }
//            //
//            //            }
//            //
//            //
//            //            return {i:iRes,j:jRes}
//            //
//            //        }
//            //
//            //    }
//            //    else if (verticalMode==StickingMode.none && horizontalMode==StickingMode.none  ){
//            //        resFunction= (i,j,nbX,nbY)=> {
//            //            let iRes = null
//            //            let jRes = null
//            //
//            //            if (j >= 0 && j < nbY) {
//            //                if (i >= 0 && i < nbX) {
//            //                    iRes = i
//            //                    jRes = j
//            //                }
//            //            }
//            //            return {i:iRes,j:jRes}
//            //        }
//            //    }
//            //
//            //    //else if (verticalMode==StickingMode.decay && horizontalMode==StickingMode.none  ){
//            //    //    resFunction= (i,j,nbX,nbY)=> {
//            //    //        let iRes = null
//            //    //        let jRes = null
//            //    //
//            //    //        if (j >= 0 && j < nbY && i >= 0 && i < nbX) {
//            //    //                iRes = i
//            //    //                jRes = j
//            //    //
//            //    //        }
//            //    //        else if (i==-1){
//            //    //            if (j>=1 && j<nbY){
//            //    //                iRes=nbX-1
//            //    //                jRes=j-1
//            //    //            }
//            //    //        }
//            //    //        else if (i==nbX){
//            //    //            if (j>=0 && j<nbY-1){
//            //    //                iRes=0
//            //    //                jRes=j+1
//            //    //            }
//            //    //        }
//            //    //
//            //    //
//            //    //        return {i:iRes,j:jRes}
//            //    //    }
//            //    //}
//            //
//            //
//            //
//            //        return resFunction
//            //}
//
//
//            superGo(){
//
//
//                //let sticking=this.buildStickingFunction(this.borderStickingVertical,this.borderStickingHorizontal)
//                //
//                //if (sticking!=null) {
//                //    this.stickingFunction=sticking
//                //
//                //}
//                //else {
//                //
//                //
//                //    sticking=this.buildStickingFunction(this.borderStickingHorizontal,this.borderStickingVertical)
//                //
//                //    if (sticking!=null) this.stickingFunction= (i,j,nbX,nbY)=>{
//                //        let res=sticking(j,i,nbY,nbX)
//                //        return {i:res.j,j:res.i}
//                //    }
//                //    else throw 'this combinaison of border sticking mode is impossible'
//                //
//                //}
//
//
//
//
//
//
//
//                //if (this.borderStickingHorizontal==StickingMode.simple) this.horizontalStickingFunction= (i)=>(i)
//                //else if (this.borderStickingHorizontal==StickingMode.inverse) this.horizontalStickingFunction= (i)=>(this.nbX-i-1)
//                //
//                //
//                //if (this.borderStickingVertical==StickingMode.simple) this.verticalStickingFunction= (i)=>(i)
//                //else if (this.borderStickingVertical==StickingMode.inverse) this.verticalStickingFunction= (i)=>(this.nbY-i-1)
//
//            }
//
//            protected paramToVertex:{[id:string]:Vertex}={}
//
//
//
//
//            protected getVertex(i:number,j:number):Vertex{
//
//
//                //let iRes=i
//                //let jRes=j
//                //
//                //if (this.borderStickingVertical!=StickingMode.none  && i!=modulo(i,this.nbX) ){
//                //    jRes=this.verticalStickingFunction(j)
//                //    iRes=modulo(iRes,this.nbX)
//                //
//                //    cc('i,iRes',i,iRes)
//                //    cc('j,jRes',j,jRes)
//                //}
//                //
//                //
//                //if (this.borderStickingHorizontal!=StickingMode.none  && j!=modulo(j,this.nbY) ){
//                //    iRes=this.horizontalStickingFunction(i)
//                //    jRes=modulo(j,this.nbY)
//                //}
//
//
//                //let ijRes=this.stickingFunction(i,j,this.nbX,this.nbY)
//
//                let iRes=null
//                let jRes=null
//                if (this.borderStickingVertical!=StickingMode.inverse&& this.borderStickingHorizontal!=StickingMode.inverse){
//                    if (this.borderStickingVertical==StickingMode.none) iRes=i
//                    else if (this.borderStickingVertical==StickingMode.simple) iRes=modulo(i,this.nbX)
//
//                    if (this.borderStickingHorizontal==StickingMode.none) jRes=j
//                    else if (this.borderStickingHorizontal==StickingMode.simple) jRes=modulo(j,this.nbY)
//                }
//                else if (this.borderStickingVertical==StickingMode.inverse && this.borderStickingHorizontal==StickingMode.none){
//                    if (i<0 || i>=this.nbX){
//                        iRes=modulo(i,this.nbX)
//                        jRes=this.nbY -1 - j
//                    }
//                    else {
//                        iRes=i
//                        jRes=j
//                    }
//                }
//
//
//
//
//
//                return this.paramToVertex[iRes+','+jRes]
//
//            }
//
//
//
//        }
//
//
//        export class Quinconce extends Rectangle{
//
//
//            oneMoreVertexInOddLines=false
//            addTriangles=true
//
//            addMarkForHoneyComb=false
//
//
//            private isHoneyCombCenter(i:number,j:number){
//
//                if (j%2==0 && i%3==2) return true
//                if (j%2==1 && i%3==1) return true
//                return false
//
//            }
//
//
//
//            private checkArgs(){
//
//                if (this.oneMoreVertexInOddLines){
//                    if (this.borderStickingHorizontal!=StickingMode.none) mawarning(' the vertical sticking may be strange')
//                    if (this.borderStickingHorizontal!=StickingMode.none && this.nbY%2!=0) throw 'horizontal sticking impossible with these parameters'
//
//                }
//
//                //if (this.borderStickingHorizontal!=BorderSticking.none && this.nbY%2!=0 ) throw 'nbY must be even to make some horizontal sticking'
//                //if (this.borderStickingVertical!=BorderSticking.none && this.oneMoreVertexInOddLines) throw 'oneMoreVertexInOddLines and borderStickingVertical are incompatible'
//            }
//
//
//
//
//            goChanging(){
//
//                this.checkArgs()
//                this.superGo()
//
//                var cellId = 0;
//
//
//
//
//                //var max = Math.max(this.nbX+1, this.nbY);
//                //var ecart =1/(max-1)
//
//
//                let positionPerhapsModulo=(x:number)=>{
//                    if (this.borderStickingVertical==StickingMode.none) return x
//                    if (x<0) return this.maxX-this.minX+x
//                    else return x
//                }
//
//
//                let addX=(this.borderStickingVertical!=StickingMode.none)?1:0
//                let addY=(this.borderStickingHorizontal!=StickingMode.none)?1:0
//
//                let deltaX=(this.maxX-this.minX)/(this.nbX-1+addX)
//                let deltaY=(this.maxY-this.minY)/(this.nbY-1+addY)
//
//                for (var j = 0; j < this.nbY; j++) {
//
//                    var  oneMore=(this.oneMoreVertexInOddLines) ?  j%2  :0
//                    for (var i = 0; i < this.nbX+oneMore; i++) {
//
//                        let param=new XYZ(i,j,0)
//
//
//                            if (this.holeParameters == null || !this.paramIsHole(param)) {
//
//
//                                let leftDecayForOddLines = ( j % 2 == 1) ? 0.5 * deltaX : 0;
//
//                                let currentVertDecay= (this.nbVerticalDecays==0)? 0 : i*deltaX/(this.maxX-this.minX)*this.nbVerticalDecays*deltaY
//
//
//                                let vertex = this.mamesh.newVertex()
//                                vertex.param = param
//                                vertex.position = geo.newXYZ(
//                                    i * deltaX - leftDecayForOddLines + this.minX,
//                                    (j * deltaY + this.minY)+currentVertDecay,
//                                    0)
//                                this.paramToVertex[i + ',' + j] = vertex
//
//
//                                cellId++;
//
//
//                                if (!this.addMarkForHoneyComb || ! this.isHoneyCombCenter(i,j) ) vertex.markers.push(Vertex.Markers.honeyComb)
//
//
//
//                                }
//
//
//                    }
//                }
//
//                if (this.makeLinks) this.linksCreationForSquare()
//
//
//            }
//
//
//            private linksCreation(){
//
//
//
//
//                this.mamesh.vertices.forEach((cell:Vertex)=> {
//
//                    {
//                        let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y);
//                        let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y);
//
//                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
//                        else if (c == null && cc != null) cell.setOneLink(cc,true)
//                        else if (c != null && cc == null) cell.setOneLink(c,true)
//                    }
//
//                    /**even lines */
//                    if (cell.param.y%2==0){
//                        // sud est - nord ouest
//                        let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y + 1);
//                        let cc:Vertex = this.getVertex(cell.param.x, cell.param.y - 1);
//
//                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
//                        else if (c == null && cc != null) cell.setOneLink(cc,true)
//                        else if (c != null && cc == null) cell.setOneLink(c,true)
//
//
//                        // sud ouest - nord est
//                        c = this.getVertex(cell.param.x, cell.param.y + 1);
//                        cc = this.getVertex(cell.param.x + 1, cell.param.y - 1);
//
//                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
//                        else if (c == null && cc != null) cell.setOneLink(cc,true)
//                        else if (c != null && cc == null) cell.setOneLink(c,true)
//
//
//                    }
//                    /**odd lines */
//                    else {
//                        //sud est - nord ouest
//                        let c:Vertex = this.getVertex(cell.param.x, cell.param.y + 1);
//                        let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y - 1);
//                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
//                        else if (c == null && cc != null) cell.setOneLink(cc,true)
//                        else if (c != null && cc == null) cell.setOneLink(c,true)
//
//                        //sud ouest - nord est
//                        c = this.getVertex(cell.param.x - 1, cell.param.y + 1);
//                        cc = this.getVertex(cell.param.x, cell.param.y - 1);
//                        if (c != null && cc != null) cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
//                        else if (c == null && cc != null) cell.setOneLink(cc,true)
//                        else if (c != null && cc == null) cell.setOneLink(c,true)
//
//                    }
//
//
//
//                });
//
//
//                if (this.addTriangles) this.triangleCreation()
//
//
//
//            }
//
//
//            private triangleCreation(){
//
//                for (let vertex of this.mamesh.vertices){
//
//                    let i=vertex.param.x
//                    let j=vertex.param.y
//
//
//
//                    let v1=this.getVertex(i,j)
//                    if (v1==null)  continue
//
//                    let v2=this.getVertex(i+1,j+1)
//                    if (v2=null)  continue
//
//
//                    let v3=this.getVertex(i,j+1)
//                    if (v3!=null)this.mamesh.addATriangle(v1,v2,v3)
//
//
//                    let v4=this.getVertex(i+1,j)
//                    if (v4!=null)this.mamesh.addATriangle(v1,v4,v2)
//
//
//
//                }
//
//
//            }
//
//
//
//        }
//
//
//        export class Cartesian extends Rectangle{
//
//            cornersAreSharp=true
//            acceptDuplicateOppositeLinks=true
//
//            private checkArgs(){
//
//
//
//                if (this.nbX<2) throw 'this.nbX must be >=2'
//                if (this.nbY<2) throw 'this.nbY must be >=2'
//                if (this.maxX<=this.minX) throw 'we must have minX<maxX'
//                if (this.maxY<=this.minY) throw 'we must have minY<maxY'
//                if (!this.addTriangleOrSquare && !this.makeLinks) mawarning('few interest if you do not add neither square nor links')
//
//                if (!this.cornersAreSharp){
//                    if (this.borderStickingHorizontal!=StickingMode.none || this.borderStickingVertical!=StickingMode.none) mawarning(' the sticking we delete the links in the corners')
//                }
//
//                if (this.borderStickingVertical!=StickingMode.none && this.nbX==2) throw 'nbX too small for sticking'
//                if (this.borderStickingHorizontal!=StickingMode.none && this.nbY==2) throw 'nbY too small for sticking'
//
//
//            }
//
//
//            //private computeDecayVerctor(a,A,b,B):XYZ{
//            //
//            //    if (a==0) return new XYZ(0,b,0)
//            //    let denominator=(A*B-a*b)
//            //    return new XYZ(a*A*B/denominator,a*b*B/denominator,0)
//            //}
//
//
//
//            private computeDecayVector(a,A,b,B,dV,dH):XYZ{
//                let res=new XYZ(0,0,0)
//                res.x= a*A*B/( A*B - a*b*dH *dV )
//                res.y=b*dV/A*res.x
//                return res
//            }
//
//            goChanging():void{
//
//
//                this.checkArgs()
//                this.superGo()
//
//
//                let addX=(this.borderStickingVertical!=StickingMode.none)?1:0
//                let addY=(this.borderStickingHorizontal!=StickingMode.none)?1:0
//
//                let deltaX=(this.maxX-this.minX)/(this.nbX-1+addX)
//                let deltaY=(this.maxY-this.minY)/(this.nbY-1+addY)
//
//
//                let A=(this.maxX-this.minX)
//                let B=(this.maxY-this.minY)
//
//                let VX=this.computeDecayVector(deltaX,A,deltaY,B,this.nbVerticalDecays,this.nbHorizontalDecays)
//                let preVY=this.computeDecayVector(deltaY,B,deltaX,A,this.nbHorizontalDecays,this.nbVerticalDecays)
//                let VY=new XYZ(preVY.y,preVY.x,0)
//
//
//                let vertexId=0
//                for (let i=0;i<this.nbX;i++){
//                    for (let j=0;j<this.nbY;j++){
//                        let param = new XYZ(i, j, 0)
//                        if (this.holeParameters==null ||  !this.paramIsHole(param)) {
//
//                            //let currentVertDecay= (this.nbVerticalDecays==0)? 0 : i*deltaX/(this.maxX-this.minX)*this.nbVerticalDecays*deltaY
//                            //let currentHorDecay= (this.nbHorizontalDecays==0)? 0 : j*deltaY/(this.maxY-this.minY)*this.nbHorizontalDecays*deltaX
//
//                            let vertex = this.IN_mamesh.newVertex() // graphManip.addNewVertex(this.IN_mamesh.vertices, j * this.nbX + i)
//                            vertex.position =  XYZ.newFrom(VX).scale(i)
//                            let ortherDirection=XYZ.newFrom(VY).scale(j)
//                            vertex.position.add(ortherDirection)
//
//                            vertex.param=param
//                            this.paramToVertex[i + ',' + j] = vertex
//                            vertexId++
//
//                        }
//                    }
//                }
//
//
//
//                //
//                //if (this.makeLinks){
//                //    for (let i=0;i<this.nbX;i++) {
//                //        for (let j = 0; j < this.nbY; j++) {
//                //
//                //            if (i>0 && i<this.nbX-1){
//                //                this.IN_mamesh.vertices[(i)+(j)*this.nbX].setTwoOppositeLinks(this.IN_mamesh.vertices[(i-1)+(j)*this.nbX],this.IN_mamesh.vertices[(i+1)+(j)*this.nbX])
//                //            }
//                //            else if (i==0) this.IN_mamesh.vertices[(i)+(j)*this.nbX].setOneLink(this.IN_mamesh.vertices[(i+1)+(j)*this.nbX])
//                //            else if (i==this.nbX-1) this.IN_mamesh.vertices[(i)+(j)*this.nbX].setOneLink(this.IN_mamesh.vertices[(i-1)+(j)*this.nbX])
//                //
//                //
//                //            if (j>0 && j<this.nbY-1){
//                //                this.IN_mamesh.vertices[(i)+(j)*this.nbX].setTwoOppositeLinks(this.IN_mamesh.vertices[(i)+(j-1)*this.nbX],this.IN_mamesh.vertices[(i)+(j+1)*this.nbX])
//                //            }
//                //            else if (j==0) this.IN_mamesh.vertices[(i)+(j)*this.nbX].setOneLink(this.IN_mamesh.vertices[(i)+(j+1)*this.nbX])
//                //            else if (j==this.nbY-1) this.IN_mamesh.vertices[(i)+(j)*this.nbX].setOneLink(this.IN_mamesh.vertices[(i)+(j-1)*this.nbX])
//                //        }
//                //    }
//                //
//                //    if (!this.cornersAreSharp){
//                //        this.IN_mamesh.vertices[0].setTwoOppositeLinks(this.IN_mamesh.vertices[1],this.IN_mamesh.vertices[this.nbX],true)
//                //
//                //        this.getVertex(this.nbX-1,0).setTwoOppositeLinks(this.getVertex(this.nbX-1,1),this.getVertex(this.nbX-2,0),true)
//                //
//                //        this.getVertex(0,this.nbY-1).setTwoOppositeLinks(this.getVertex(0,this.nbY-2),this.getVertex(1,this.nbY-1),true)
//                //        this.getVertex(this.nbX-1,this.nbY-1).setTwoOppositeLinks(this.getVertex(this.nbX-1,this.nbY-2),this.getVertex(this.nbX-2,this.nbY-1),true)
//                //
//                //    }
//                //
//                //    if (this.borderStickingVertical!=BorderSticking.none){
//                //        let stickFunction
//                //        if(this.borderStickingVertical==BorderSticking.simple) stickFunction= (i:number)=>{return i}
//                //        else if(this.borderStickingVertical==BorderSticking.inverted) stickFunction= (i:number)=>{return this.nbY-1-i}
//                //
//                //        for (let j = 0; j < this.nbY; j++) {
//                //            this.getVertex(this.nbX - 1, j).setTwoOppositeLinks(this.getVertex(this.nbX - 2, j), this.getVertex(0, stickFunction(j)), true)
//                //            this.getVertex(0, j).setTwoOppositeLinks(this.getVertex(1, j), this.getVertex(this.nbX - 1, stickFunction(j)), true)
//                //        }
//                //    }
//                //
//                //    if (this.borderStickingHorizontal!=BorderSticking.none){
//                //        let stickFunction
//                //        if(this.borderStickingHorizontal==BorderSticking.simple) stickFunction= (i:number)=>{return i}
//                //        else if(this.borderStickingHorizontal==BorderSticking.inverted) stickFunction= (i:number)=>{return this.nbX-1-i}
//                //
//                //        for (let i = 0; i < this.nbX; i++) {
//                //            this.getVertex(i,this.nbY - 1).setTwoOppositeLinks(this.getVertex(i,this.nbY - 2), this.getVertex(stickFunction(i),0), true)
//                //            this.getVertex(i,0).setTwoOppositeLinks(this.getVertex(i,1), this.getVertex(stickFunction(i),this.nbY - 1), true)
//                //        }
//                //    }
//                //
//                //
//                //
//                //}
//
//
//                if (this.cornersAreSharp){
//                    let vertex:Vertex
//                    vertex=this.getVertex(0,0)
//                    if (vertex!=null)  vertex.isSharpAngle=true
//                    vertex=this.getVertex(this.nbX-1,this.nbY-1)
//                    if (vertex!=null)  vertex.isSharpAngle=true
//                    vertex=this.getVertex(0,this.nbY-1)
//                    if (vertex!=null)  vertex.isSharpAngle=true
//                    vertex=this.getVertex(this.nbX-1,0)
//                    if (vertex!=null)  vertex.isSharpAngle=true
//                }
//
//
//
//                if (this.makeLinks) this.linksCreation()
//
//                if (this.addSquare) this.squareCreation()
//
//
//
//
//                //if (this.addSquare){
//                //
//                //    for (let i=0;i<this.nbX-1;i++) {
//                //        for (let j = 0; j < this.nbY-1; j++) {
//                //            this.mamesh.addASquare((i)+(j)*this.nbX,(i+1)+(j)*this.nbX,(i+1)+(j+1)*this.nbX,(i)+(j+1)*this.nbX)
//                //        }
//                //    }
//                //
//                //    if (this.borderStickingVertical!=BorderSticking.none){
//                //        let stickFunction
//                //        if(this.borderStickingVertical==BorderSticking.simple) stickFunction= (i:number)=>{return i}
//                //        else if(this.borderStickingVertical==BorderSticking.inverted) stickFunction= (i:number)=>{return this.nbY-1-i}
//                //
//                //        for (let j = 0; j < this.nbY-1; j++) {
//                //           this.mamesh.addASquare(this.getId(this.nbX - 1, j),this.getId(0, stickFunction(j)),this.getId(0, stickFunction(j+1)), this.getId(this.nbX-1,j+1)   )
//                //        }
//                //
//                //    }
//                //    if (this.borderStickingHorizontal!=BorderSticking.none){
//                //        let stickFunction
//                //        if(this.borderStickingHorizontal==BorderSticking.simple) stickFunction= (i:number)=>{return i}
//                //        else if(this.borderStickingHorizontal==BorderSticking.inverted) stickFunction= (i:number)=>{return this.nbY-1-i}
//                //
//                //        for (let i = 0; i < this.nbX-1; i++) {
//                //            this.mamesh.addASquare(this.getId(i+1,this.nbY-1),this.getId( stickFunction(i+1),0), this.getId( stickFunction(i),0), this.getId(i,this.nbY - 1))
//                //        }
//                //
//                //    }
//                //
//                //
//                //
//                //
//                //}
//
//
//            }
//
//            private linksCreation(){
//
//
//                //var checkExistingLinks=(this.borderStickingHorizontal!=StickingMode.none) || (this.borderStickingVertical!=StickingMode.none)
//
//
//                this.mamesh.vertices.forEach((cell:Vertex)=> {
//
//                    {
//                        let decayWhenCrossingBorderRightward=0
//                        let decayWhenCrossingBorderLeftward=0
//                        if (cell.param.x==0) decayWhenCrossingBorderLeftward=(this.borderStickingVertical==StickingMode.inverse)?this.nbVerticalDecays :  -this.nbVerticalDecays
//                        if (cell.param.x==this.nbX-1) decayWhenCrossingBorderRightward=+this.nbVerticalDecays
//
//
//
//                        let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y+decayWhenCrossingBorderRightward);
//                        let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y+decayWhenCrossingBorderLeftward);
//
//                        if (c != null && cc != null) {
//                            if (this.acceptDuplicateOppositeLinks) cell.setTwoOppositeLinks(c,cc,false)
//                            else cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
//                        }
//                        else if (c == null && cc != null) cell.setOneLink(cc,true)
//                        else if (c != null && cc == null) cell.setOneLink(c,true)
//
//                    }
//
//
//                    {
//
//                        let decayWhenCrossingUpward=0
//                        let decayWhenCrossingDownWard=0
//                        if (cell.param.y==0) decayWhenCrossingDownWard=(this.borderStickingHorizontal==StickingMode.inverse)?this.nbHorizontalDecays :  -this.nbHorizontalDecays
//                        if (cell.param.y==this.nbY-1) decayWhenCrossingUpward=+this.nbHorizontalDecays
//
//
//                        let c:Vertex = this.getVertex(cell.param.x +decayWhenCrossingUpward , cell.param.y+1);
//                        let cc:Vertex = this.getVertex(cell.param.x +decayWhenCrossingDownWard , cell.param.y-1);
//
//                        if (c != null && cc != null) {
//                            if (this.acceptDuplicateOppositeLinks) cell.setTwoOppositeLinks(c,cc,false)
//                            else cell.setVoisinCoupleKeepingExistingAtBest(c, cc)
//                        }                        else if (c == null && cc != null) cell.setOneLink(cc,true)
//                        else if (c != null && cc == null) cell.setOneLink(c,true)
//
//                    }
//
//
//
//                });
//
//
//            }
//
//
//
//            private squareCreation(){
//
//                for (let vertex of this.mamesh.vertices){
//
//
//
//
//                    let i=vertex.param.x
//                    let j=vertex.param.y
//
//                    let rightDecayWhenCrossing=0
//                    if (i==this.nbX-1) rightDecayWhenCrossing=+this.nbVerticalDecays
//
//                    let upDecayWhenCrossing=0
//                    if (j==this.nbY-1) upDecayWhenCrossing=+this.nbHorizontalDecays
//
//
//
//
//
//                    let v1=this.getVertex(i,j)
//                    if (v1=null)  continue;
//
//                    let v2=this.getVertex(i+1,j+rightDecayWhenCrossing)
//                    if (v2==null) continue;
//
//                    let v3=this.getVertex(i+1+upDecayWhenCrossing,j+1+ rightDecayWhenCrossing)
//                    if (v3==null) continue;
//
//                    let v4=this.getVertex(i+upDecayWhenCrossing,j+1)
//                    if (v4==null)  continue;
//
//                    this.mamesh.addASquare(v1,v2,v3,v4)
//
//                }
//
//
//
//                //
//                //if (this.addTrianglesToClose) {
//                //
//                //    if (this.nbVerticalDecays==1 && this.nbHorizontalDecays ==1) {
//                //
//                //        let v:Vertex
//                //        let i1, i2, i3:number
//                //        v = this.getVertex(0, this.nbY - 1)
//                //        i1 = v.id
//                //
//                //        v = this.getVertex(this.nbHorizontalDecays, 0)
//                //        i2 = v.id
//                //
//                //        v = this.getVertex(0, 0)
//                //        i3 = v.id
//                //
//                //        this.mamesh.addATriangle(i1, i2, i3)
//                //
//                //
//                //        v = this.getVertex(this.nbX - 1, 0)
//                //        i1 = v.id
//                //
//                //        v = this.getVertex(0, 0)
//                //        i2 = v.id
//                //
//                //        v = this.getVertex(0, this.nbVerticalDecays)
//                //        i3 = v.id
//                //
//                //        this.mamesh.addATriangle(i1, i2, i3)
//                //
//                //
//                //    }
//                //    else throw 'adding triangle to close is not yet operationnal for such parameters'
//                //}
//                //
//
//
//
//
//
//
//
//            }
//
//
//
//
//        }
//
//
//
//        export class SingleSquare{
//            makeLinks=true
//            sharpAngles=true
//
//            goChanging():Mamesh{
//                let mesh=new Mamesh()
//
//                let vert0=mesh.newVertex()
//                vert0.position=geo.newXYZ(0,0,0)
//                vert0.dichoLevel=0
//
//                let vert1=mesh.newVertex()
//                vert1.position=geo.newXYZ(1,0,0)
//                vert1.dichoLevel=0
//
//                let vert2=mesh.newVertex()
//                vert2.position=geo.newXYZ(1,1,0)
//                vert2.dichoLevel=0
//
//                let vert3=mesh.newVertex()
//                vert3.position=geo.newXYZ(0,1,0)
//                vert3.dichoLevel=0
//
//
//                //let triangulatedRect=new Polygone([vert1,vert2,vert3])
//                //mesh.polygones.push(triangle)
//
//                mesh.addASquare(vert0,vert1,vert2,vert3)
//
//                if (this.sharpAngles){
//                    vert0.isSharpAngle=true
//                    vert1.isSharpAngle=true
//                    vert2.isSharpAngle=true
//                    vert3.isSharpAngle=true
//
//                }
//
//                if (this.makeLinks) {
//                    if (this.sharpAngles) {
//                        vert0.setOneLink(vert1, false)
//                        vert1.setOneLink(vert2, false)
//                        vert2.setOneLink(vert3, false)
//                        vert3.setOneLink(vert0, false)
//
//                        vert0.setOneLink(vert3, false)
//                        vert3.setOneLink(vert2, false)
//                        vert2.setOneLink(vert1, false)
//                        vert1.setOneLink(vert0, false)
//                    }
//                    else{
//                        vert0.setTwoOppositeLinks(vert1,vert3)
//                        vert1.setTwoOppositeLinks(vert2,vert0)
//                        vert2.setTwoOppositeLinks(vert3,vert1)
//                        vert3.setTwoOppositeLinks(vert0,vert2)
//
//                    }
//                    mesh.linksOK = true
//                }
//                else mesh.linksOK=false
//
//
//                return mesh
//            }
//
//        }
//
//
//        export class SingleTriangle {
//            makeLinks = true
//            sharpAngles = true
//
//            goChanging():Mamesh {
//                let mesh=new Mamesh()
//
//                let vert0=mesh.newVertex()
//                vert0.position=geo.newXYZ(0,0,0)
//                vert0.dichoLevel=0
//
//
//                let vert1=mesh.newVertex()
//                vert1.position=geo.newXYZ(0,1,0)
//                vert1.dichoLevel=0
//
//                let vert2=mesh.newVertex()
//                vert2.position=geo.newXYZ(1,0,0)
//                vert2.dichoLevel=0
//
//
//                //let triangulatedRect=new Polygone([vert1,vert2,vert3])
//                //mesh.polygones.push(triangle)
//
//                mesh.addATriangle(vert0,vert1,vert2)
//
//
//                if (this.sharpAngles) {
//                    vert0.isSharpAngle=true
//                    vert1.isSharpAngle=true
//                    vert2.isSharpAngle=true
//                }
//
//                if (this.makeLinks) {
//                    if (this.sharpAngles) {
//                        vert0.setOneLink(vert1, false)
//                        vert0.setOneLink(vert2, false)
//                        vert1.setOneLink(vert0, false)
//                        vert1.setOneLink(vert2, false)
//                        vert2.setOneLink(vert0, false)
//                        vert2.setOneLink(vert1, false)
//                    }
//                    else{
//                        vert0.setTwoOppositeLinks(vert1,vert2,false)
//                        vert1.setTwoOppositeLinks(vert2,vert0,false)
//                        vert2.setTwoOppositeLinks(vert0,vert1,false)
//                    }
//
//                    mesh.linksOK = true
//                }
//                else mesh.linksOK=false
//
//
//                return mesh
//            }
//        }
//
//
//
//        export class SingleSquareWithOneDiag {
//            makeLinks = true
//            sharpAngles = true
//
//            goChanging():Mamesh {
//                let mesh=new Mamesh()
//
//                let vert0=mesh.newVertex()
//                vert0.position=geo.newXYZ(0,0,0)
//                vert0.dichoLevel=0
//
//                let vert1=mesh.newVertex()
//                vert1.position=geo.newXYZ(1,0,0)
//                vert1.dichoLevel=0
//
//                let vert2=mesh.newVertex()
//                vert2.position=geo.newXYZ(1,1,0)
//                vert2.dichoLevel=0
//
//                let vert3=mesh.newVertex()
//                vert3.position=geo.newXYZ(0,1,0)
//                vert3.dichoLevel=0
//
//
//                //let triangle=new Polygone([vert1,vert2,vert3])
//                //mesh.polygones.push(triangle)
//
//                mesh.addATriangle(vert0,vert1,vert3)
//                mesh.addATriangle(vert1,vert2,vert3)
//
//                if (this.sharpAngles){
//                    vert0.isSharpAngle=true
//                    vert1.isSharpAngle=true
//                    vert2.isSharpAngle=true
//                    vert3.isSharpAngle=true
//                }
//
//                if (this.makeLinks) {
//
//                    vert1.setOneLink(vert3)
//                    vert3.setOneLink(vert1)
//
//
//                    if (this.sharpAngles){
//                        vert0.setOneLink(vert1)
//                        vert0.setOneLink(vert3)
//
//                        vert1.setOneLink(vert0)
//                        vert1.setOneLink(vert2)
//
//                        vert2.setOneLink(vert1)
//                        vert2.setOneLink(vert3)
//
//                        vert3.setOneLink(vert0)
//                        vert3.setOneLink(vert2)
//                    }
//                    else{
//                        vert0.setTwoOppositeLinks(vert1,vert3)
//                        vert1.setTwoOppositeLinks(vert2,vert0)
//                        vert2.setTwoOppositeLinks(vert3,vert1)
//                        vert3.setTwoOppositeLinks(vert0,vert2)
//                    }
//
//                    mesh.linksOK = true
//                }
//                else mesh.linksOK=false
//
//                return mesh
//            }
//        }
//
//
//        export class SingleSquareWithTwoDiag {
//            makeLinks = true
//            sharpAngles = true
//
//            goChanging():Mamesh {
//                let mesh=new Mamesh()
//
//                let vert0=mesh.newVertex()
//                vert0.position=geo.newXYZ(0,0,0)
//                vert0.dichoLevel=0
//
//
//                let vert1=mesh.newVertex()
//                vert1.position=geo.newXYZ(1,0,0)
//                vert1.dichoLevel=0
//
//                let vert2=mesh.newVertex()
//                vert2.position=geo.newXYZ(1,1,0)
//                vert2.dichoLevel=0
//
//                let vert3=mesh.newVertex()
//                vert3.position=geo.newXYZ(0,1,0)
//                vert3.dichoLevel=0
//
//                let vert4=mesh.newVertex()
//                vert4.position=geo.newXYZ(0.5,0.5,0)
//                vert4.dichoLevel=0
//
//
//                //let triangulatedRect=new Polygone([vert1,vert2,vert3])
//                //mesh.polygones.push(triangle)
//
//                mesh.addATriangle(vert0,vert1,vert4)
//                mesh.addATriangle(vert1,vert2,vert4)
//                mesh.addATriangle(vert2,vert3,vert4)
//                mesh.addATriangle(vert4,vert3,vert0)
//
//                if (this.sharpAngles){
//                    vert0.isSharpAngle=true
//                    vert1.isSharpAngle=true
//                    vert2.isSharpAngle=true
//                    vert3.isSharpAngle=true
//
//                }
//
//                if (this.makeLinks) {
//
//                    vert0.setOneLink(vert4)
//                    vert1.setOneLink(vert4)
//                    vert2.setOneLink(vert4)
//                    vert3.setOneLink(vert4)
//                    vert4.setTwoOppositeLinks(vert0, vert2)
//                    vert4.setTwoOppositeLinks(vert1, vert3)
//
//                    if (this.sharpAngles) {
//                        vert0.setOneLink(vert1)
//                        vert0.setOneLink(vert3)
//
//                        vert1.setOneLink(vert0)
//                        vert1.setOneLink(vert2)
//
//
//                        vert2.setOneLink(vert1)
//                        vert2.setOneLink(vert3)
//
//
//                        vert3.setOneLink(vert0)
//                        vert3.setOneLink(vert2)
//                    }
//                    else {
//                        vert0.setTwoOppositeLinks(vert1,vert3)
//                        vert1.setTwoOppositeLinks(vert2,vert0)
//                        vert2.setTwoOppositeLinks(vert3,vert1)
//                        vert3.setTwoOppositeLinks(vert0,vert2)
//                    }
//
//                    mesh.linksOK = true
//                }
//                else mesh.linksOK=false
//
//                return mesh
//            }
//        }
//
//
//        export class RegularPolygone{
//            aLoopLineAround=false
//            nbSides:number
//
//            constructor(nbSides){this.nbSides=nbSides}
//
//            goChanging():Mamesh {
//
//
//                let mesh=new Mamesh()
//                mesh.linksOK=true
//
//                let a = 1 / 2;
//                if (this.nbSides >= 4) {
//
//                    let vert0=mesh.newVertex()
//                    vert0.position=geo.newXYZ(1 / 2, 1 / 2, 0)
//                    vert0.dichoLevel=0
//                    for (let i = 0; i < this.nbSides; i++) {
//                        let verti=mesh.newVertex()
//                        verti.dichoLevel=0
//                        verti.position=geo.newXYZ(1 / 2 + Math.cos(2 * Math.PI * i / this.nbSides - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * i / this.nbSides - Math.PI / 2) * a, 0)
//                    }
//
//                    for (let i = 1; i < this.nbSides + 1; i++) {
//                        //let triangulatedRect=new Polygone([resultMesh.vertices[0],resultMesh.vertices[i],resultMesh.vertices[i % this.nbSides + 1]])
//                        //resultMesh.polygones.push(triangle)
//                        mesh.addATriangle(mesh.vertices[0],mesh.vertices[i],mesh.vertices[i % this.nbSides + 1])
//
//                    }
//
//                    if (this.nbSides%2==0){
//                        for (let i=1;i<=this.nbSides/2;i++){
//                            vert0.setTwoOppositeLinks(mesh.vertices[i],mesh.vertices[i+this.nbSides/2])
//                        }
//                    }
//                    else{
//                        for (let i=1;i<=this.nbSides;i++) vert0.setOneLink(mesh.vertices[i])
//                    }
//
//                    for (let i=1;i<=this.nbSides;i++){
//                        let verti=mesh.vertices[i]
//                        let vertNext=(i==this.nbSides)? mesh.vertices[1]:mesh.vertices[i+1]
//                        let vertPrev=(i==1)? mesh.vertices[this.nbSides]:mesh.vertices[i-1]
//
//                        verti.setOneLink(vert0)
//                        if (this.aLoopLineAround) verti.setTwoOppositeLinks(vertPrev,vertNext)
//                        else{
//                            verti.setOneLink(vertNext)
//                            verti.setOneLink(vertPrev)
//                        }
//                    }
//
//                }
//                else if (this.nbSides == 3) {
//                    for (let i = 0; i < this.nbSides; i++) {
//                        let verti=mesh.newVertex()
//                        verti.dichoLevel=0
//                        verti.position=geo.newXYZ(1 / 2 + Math.cos(2 * Math.PI * i / this.nbSides - Math.PI / 2) * a, 1 / 2 + Math.sin(2 * Math.PI * i / this.nbSides - Math.PI / 2) * a, 0);
//                        verti.dichoLevel=0
//                    }
//                    mesh.addATriangle(mesh.vertices[0],mesh.vertices[1],mesh.vertices[2])
//                    let vert0=mesh.vertices[0]
//                    let vert1=mesh.vertices[1]
//                    let vert2=mesh.vertices[2]
//
//                    if (this.aLoopLineAround){
//                        vert0.setTwoOppositeLinks(vert1,vert2)
//                        vert1.setTwoOppositeLinks(vert2,vert0)
//                        vert2.setTwoOppositeLinks(vert0,vert1)
//                    }
//                    else{
//                        vert0.setOneLink(vert1)
//                        vert0.setOneLink(vert2)
//
//                        vert1.setOneLink(vert2)
//                        vert1.setOneLink(vert0)
//
//                        vert2.setOneLink(vert0)
//                        vert2.setOneLink(vert1)
//
//                    }
//
//
//
//                    //let triangulatedRect=new Polygone([resultMesh.vertices[0],resultMesh.vertices[1],resultMesh.vertices[2]])
//                    //resultMesh.polygones.push(triangle)
//                }
//
//                return mesh
//            }
//
//
//
//        }
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
//       
//
//
//
//
//
//    }
// }