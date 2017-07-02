/**
 * Created by Guillaume Kieffer on 26/05/2017.
 */


module mathis {

    export module polygonFinder {


        export class PolygonTurner{

            constructor(
                private mamesh:Mamesh,
                private vertexToNormal:HashMap<Vertex,XYZ>
            ){}

            goChanging(){
                this.goForQuad()
                this.goForTriangle()


            }


            goForQuad(){
                let newList:Vertex[]=[]
                for (let i = 0; i < this.mamesh.smallestSquares.length; i = i + 4) {
                    let v0 = this.mamesh.smallestSquares[i];
                    let v1 = this.mamesh.smallestSquares[i + 1];
                    let v2 = this.mamesh.smallestSquares[i + 2];
                    let v3 = this.mamesh.smallestSquares[i + 3];

                    let normale = this.vertexToNormal.getValue(v0)

                    let side01=XYZ.newFrom(v1.position).substract(v0.position)
                    let side30=XYZ.newFrom(v0.position).substract(v3.position)

                    /** Mark links in the right direction of rotation **/
                    let angle = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(side30,side01, normale);
                    if (angle<0)newList.push(v3,v2,v1,v0)
                    else newList.push(v0,v1,v2,v3)
                }
                this.mamesh.smallestSquares=newList
            }

            goForTriangle(){
                let newList:Vertex[]=[]
                for (let i = 0; i < this.mamesh.smallestTriangles.length; i = i + 3) {
                    let v0 = this.mamesh.smallestTriangles[i];
                    let v1 = this.mamesh.smallestTriangles[i + 1];
                    let v2 = this.mamesh.smallestTriangles[i + 2];

                    let normale = this.vertexToNormal.getValue(v0)

                    let side01=XYZ.newFrom(v1.position).substract(v0.position)
                    let side20=XYZ.newFrom(v0.position).substract(v2.position)

                    /** Mark links in the right direction of rotation **/
                    let angle = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(side20,side01, normale);
                    if (angle<0)newList.push(v2,v1,v0)
                    else newList.push(v0,v1,v2)
                }
                this.mamesh.smallestTriangles=newList
            }
        }



        export class NormalComputerFromLinks{

            //takeTheTwoFirstLinks_Versus_takeTheTwoMoreOrthogonal=true

            normalizeNormals=true
            smoothing=true


            constructor(private mamesh:Mamesh){}

            private nbNormalComputed=0

            go(): HashMap<Vertex, XYZ>{


                let res=new HashMap<Vertex,XYZ>()
                for (let v of this.mamesh.vertices){
                    let normal=this.oneNormalComputation(v)
                    if (normal!=null) res.putValue(v,normal)
                }

                let remainingVertices=new HashMap<Vertex,Vertex>()
                for (let v of this.mamesh.vertices) if(res.getValue(v)!=null) remainingVertices.putValue(v,v)

                let count=0
                let maxCount=1000
                let startvertex = remainingVertices.oneValue()

                while (startvertex!=null&&count<maxCount){
                    this.aligningNormals(res,startvertex,remainingVertices)
                    startvertex = remainingVertices.oneValue()
                    count++
                }
                if (count==maxCount) throw "more than "+ maxCount  + " connected component in this mamesh. Strange"

                if (this.nbNormalComputed!=this.mamesh.vertices.length) throw "we do not manage to compute all the normals"


                //TODO
                // if (this.smoothing){
                //     let newRes=new HashMap<Vertex,XYZ>()
                //
                //     for (let v of this.mamesh.vertices){
                //         if (v.links.length>0) {
                //             let newNor = new XYZ(0, 0, 0)
                //             for (let l of v.links) {
                //                 let voi=res.getValue(l.to)
                //                 if (voi!=null) newNor.add(voi)
                //             }
                //             let len=newNor.length()
                //             if(len>geo.epsilon) newRes.putValue(v, newNor)
                //         }
                //     }
                //     res=newRes
                // }

                return res
           }


            private temp0=new XYZ(0,0,0)
            private temp1=new XYZ(0,0,0)
            private oneNormalComputation(v:Vertex):XYZ {



                if (v.links.length < 2) {
                    logger.c("cannot compute normal for vertex with nbLinks<2")
                        return null
                    }
                let normal = new XYZ(0, 0, 0)
                let bestNormal = new XYZ(0, 0, 0)
                let bestLen=0

                let nb=v.links.length
                    for (let l0 =0;l0<nb;l0++){
                            for (let k1=(l0+1);k1<nb;k1++){
                                let edge0 = this.temp0.copyFrom(v.links[l0].to.position).substract(v.position)
                                let edge1 = this.temp1.copyFrom(v.links[k1].to.position).substract(v.position)
                                geo.cross(edge0.normalize(), edge1.normalize(), normal)
                                let len = normal.length()
                                if (len>bestLen) {
                                    bestLen=len
                                    bestNormal.copyFrom(normal)
                                }
                            }
                    }


                    if (bestLen < 100*geo.epsilon) {
                        if (bestLen < geo.epsilon) {
                            logger.c( "Cannot compute normal : all in the links are on the same line")
                            return null
                        }
                    }

                    if(this.normalizeNormals) bestNormal.scale(1/bestLen)
                    return bestNormal

            }




            // /** ************************** **/
            // /** METHOD: normalsComputation **/
            // /** Compute normals and stock them in a hashMap **/
            // /** ******************************************* **/
            private normalsComputation(): HashMap<Vertex, XYZ> {

                /** HashMap creation **/
                let vertexToNormal = new HashMap<Vertex, XYZ>();
                //let vertexToNumStrat = new HashMap<Vertex, number>();

                /** Dot product computation **/
                for (let v of this.mamesh.vertices) {
                    let minscal = 0;
                    let instantDot;
                    let vectorTable = [];

                    if (v.links.length > 1) {
                        for (let l of v.links) {

                            /** vector array creation **/
                            let vect = new BABYLON.Vector3(0, 0, 0);
                            vect.x = l.to.position.x - v.position.x;
                            vect.y = l.to.position.y - v.position.y;
                            vect.z = l.to.position.z - v.position.z;
                            vect.normalize();
                            vectorTable.push(vect);
                        }

                        /** Smaller dot product computation **/
                        minscal = BABYLON.Vector3.Dot(vectorTable[0], vectorTable[1]);
                        if (minscal < 0) minscal *= -1; //absolute value
                        let vect1 = vectorTable[0];
                        let vect2 = vectorTable[1];

                        /** for each vector compared to each vector **/
                        for (let i = 0; i < vectorTable.length; i++) {
                            for (let j = i + 1; j < vectorTable.length; j++) {
                                instantDot = BABYLON.Vector3.Dot(vectorTable[i], vectorTable[j]);
                                if (instantDot < 0) instantDot *= -1; //valeur absolue

                                /** Smaller dot product **/
                                if (minscal > instantDot) {
                                    minscal = instantDot;

                                    vect1 = vectorTable[i];
                                    vect2 = vectorTable[j];
                                }
                            }
                        }

                        /** Normal Computation **/
                        let normal = BABYLON.Vector3.Cross(vect1, vect2);
                        normal.normalize();
                        vertexToNormal.putValue(v, new XYZ(normal.x, normal.y, normal.z));
                        //vertexToNumStrat.putValue(v, -1)
                    }
                }
                return vertexToNormal;
            }

            /** *********************** **/
            /** METHOD: aligningNormals **/
            /** align normals in the same orientation **/
            /** ************************************* **/
            private aligningNormals(vertexToNormal: HashMap<Vertex, XYZ>,startvertex:Vertex,remainingVertices:HashMap<Vertex,Vertex>) {

                remainingVertices.removeKey(startvertex)
                this.nbNormalComputed++


                /** Strata initialization**/

                let strates = [];
                let alreadySeen = new mathis.HashMap<Vertex, boolean>();

                let curentEdge = [startvertex];
                let count=0
                let maxCount=10000
                while (curentEdge.length > 0&&count<maxCount) {
                    count++
                    strates.push(curentEdge);
                    curentEdge = mathis.graph.getEdge(curentEdge, alreadySeen);
                }
                if (count==maxCount) throw "too many strates"

                /** Strata course**/
                for (let i = 1; i < strates.length; i++) {
                    for (let v of strates[i]) {
                        remainingVertices.removeKey(v)
                        this.nbNormalComputed++
                        /**for all current links **/
                        for (let l of v.links) {
                            /** for all previous vertices **/
                            for (let p of strates[i - 1]) {
                                /** if adjacent **/
                                if (l.to == p) {

                                    /** if dot product is negative : reverse the normal **/
                                    let previousNormal=vertexToNormal.getValue(p)
                                    let currentNormal=vertexToNormal.getValue(v)
                                    if (currentNormal==null) {
                                        vertexToNormal.putValue(v,XYZ.newFrom(previousNormal))
                                    }
                                    else if (geo.dot(previousNormal,currentNormal ) < 0) {
                                        currentNormal.scale(-1)
                                    }
                                    break
                                }
                            }
                        }
                    }
                }
            }


        }



        export class PolygonFinderFromLinks {

            mamesh: Mamesh


            OUT_vertexToNormal:HashMap<Vertex, XYZ>
            SUB_NormalComputer:NormalComputerFromLinks


            nbBiggerFacesDeleted=1
            areaVsPerimeter=false
            fillConvexFaces=true


            constructor(mamesh: Mamesh) {
                this.mamesh = mamesh;
            }

            /** ************************* **/
            /** METHOD: thornsSuppression **/
            /** Remove tips and insulated vertices **/
            /** ********************************** **/
            // private thornsSuppression() {
            //     for (let v of this.mamesh.vertices) {
            //         let loopflag = true;
            //         let tip = v;
            //
            //         while (loopflag) {
            //             if (tip.links.length == 1) {
            //                 let oldtip = tip;
            //                 tip = tip.links[0].to;
            //                 Vertex.separateTwoVoisins(oldtip, oldtip.links[0].to);
            //                 tab.removeFromArray(this.mamesh.vertices, oldtip);
            //             }
            //             else {
            //                 loopflag = false;
            //             }
            //         }
            //     }
            //
            //     /** Removing insulated vertices **/
            //     // tab.arrayMinusElements(this.mamesh.vertices, (v)=> v.links.length<1);
            //     this.mamesh.vertices = tab.arrayMinusElements(this.mamesh.vertices, (v: Vertex) => v.links.length == 0)
            //
            //
            //     // for (let v of this.mamesh.vertices){
            //     //     if (v.links.length<1)
            //     //         tab.removeFromArray(this.mamesh.vertices, v);
            //     // }
            //
            // }



            private polygonsDetection(vertexToNormal: HashMap<Vertex, XYZ>): Array<Array<Vertex>> {



                let orienter=new PolygonTurner(this.mamesh,vertexToNormal)
                orienter.goChanging()


                let alreadyTravel=new StringMap<boolean>()
                for (let i=0;i<this.mamesh.smallestSquares.length;i+=4){
                    let v0=this.mamesh.smallestSquares[i]
                    let v1=this.mamesh.smallestSquares[i+1]
                    let v2=this.mamesh.smallestSquares[i+2]
                    let v3=this.mamesh.smallestSquares[i+3]
                    alreadyTravel.putValue(Hash.orientedSegment(v0,v1),true)
                    alreadyTravel.putValue(Hash.orientedSegment(v1,v2),true)
                    alreadyTravel.putValue(Hash.orientedSegment(v2,v3),true)
                    alreadyTravel.putValue(Hash.orientedSegment(v3,v0),true)
                }
                for (let i=0;i<this.mamesh.smallestTriangles.length;i+=3){
                    let v0=this.mamesh.smallestTriangles[i]
                    let v1=this.mamesh.smallestTriangles[i+1]
                    let v2=this.mamesh.smallestTriangles[i+2]
                    alreadyTravel.putValue(Hash.orientedSegment(v0,v1),true)
                    alreadyTravel.putValue(Hash.orientedSegment(v1,v2),true)
                    alreadyTravel.putValue(Hash.orientedSegment(v2,v0),true)
                }


                let toSort=(a,b)=> a.angle-b.angle

                /** ici la fonction stratétique*/
                function buildOnPolygonRecursively(recCount:number,poly:Vertex[], linksAlreadySeenInCurrentPoly:StringMap<boolean>, allRemainingLinks:StringMap<[Vertex,Vertex]>):Vertex[]{

                    recCount++
                    if (recCount>1000) throw "too many recursion when we build a polygon"

                    let linkAndAngle:{vertex:Vertex;angle:number}[]=[]
                    let lastV=poly[poly.length-1]
                    let previousV=poly[poly.length-2]



                    for (let l of lastV.links){
                        /**a priori on ne repart pas d'ou on vient (sauf impasse, cf plus loin)*/
                        if (l.to!=previousV)  {
                            let nextV =l.to
                            let hash=Hash.orientedSegment(lastV,nextV)
                                let vecA = XYZ.newFrom(previousV.position).substract(lastV.position)
                                let vecB = XYZ.newFrom(l.to.position).substract(lastV.position)
                                let angle = geo.angleBetweenTwoVectorsBetween0And2Pi( vecB,vecA, vertexToNormal.getValue(lastV))+Math.PI
                                linkAndAngle.push({vertex: nextV, angle: angle})

                        }
                    }

                    if (linkAndAngle.length>0){
                        linkAndAngle.sort(toSort)
                        let best=linkAndAngle[0].vertex
                        let hashOfBest=Hash.orientedSegment(lastV,best)

                        if (linksAlreadySeenInCurrentPoly.getValue(hashOfBest)!=null) {//
                            /**on a bouclé*/
                            poly.pop()
                            return poly
                        }
                        else if (allRemainingLinks.getValue(hashOfBest)==null){
                            Vertex.separateTwoVoisins(previousV,lastV)
                            allRemainingLinks.removeKey(Hash.orientedSegment(previousV,lastV))
                            poly.pop()
                            if (poly.length>1) return buildOnPolygonRecursively(recCount,poly,linksAlreadySeenInCurrentPoly,allRemainingLinks)
                            else return null
                        }
                        else {
                            poly.push(best)
                            linksAlreadySeenInCurrentPoly.putValue(Hash.orientedSegment(lastV,best),true)
                            return buildOnPolygonRecursively(recCount,poly,linksAlreadySeenInCurrentPoly,allRemainingLinks)
                        }
                    }
                    else {
                        /**pas de sorties autre que l'entrée : demi tour*/
                        Vertex.separateTwoVoisins(previousV,lastV)
                        allRemainingLinks.removeKey(Hash.orientedSegment(previousV,lastV))
                        poly.pop()
                        if (poly.length>1) return buildOnPolygonRecursively(recCount,poly,linksAlreadySeenInCurrentPoly,allRemainingLinks)
                        else return null
                    }
                }




                let allRemainingLinks=new StringMap<[Vertex,Vertex]>()


                for (let v of this.mamesh.vertices) {
                    for (let l of v.links) {
                        let hash=Hash.orientedSegment(v,l.to)
                        if (alreadyTravel.getValue(hash)==null) {
                            allRemainingLinks.putValue(hash,[v,l.to])
                        }
                    }
                }

                /**all poly*/
                let polygons:Vertex[][] = [];


                let aRemainingLink=allRemainingLinks.oneValue()


                let outsideCount=0
                let max=10000
                while (aRemainingLink!=null&& outsideCount<max){
                    outsideCount++
                    let poly=[aRemainingLink[0],aRemainingLink[1]]
                    let linksAlreadySeenInCurrentPoly=new StringMap<boolean>()
                    linksAlreadySeenInCurrentPoly.putValue(Hash.orientedSegment(aRemainingLink[0],aRemainingLink[1]),true)
                    let recCount=0
                    poly=buildOnPolygonRecursively(recCount,poly,linksAlreadySeenInCurrentPoly,allRemainingLinks)

                    if (poly!=null){
                        polygons.push(poly)
                        for (let key of linksAlreadySeenInCurrentPoly.allKeys()) allRemainingLinks.removeKey(key)
                    }


                    aRemainingLink=allRemainingLinks.oneValue()

                }
                if (outsideCount==max) throw "we turn too mush on the mamesh"



                return polygons;
            }

            private suppressionOfLinksAppearingTwiceInOnePolygon(createdPolygons:Vertex[][]){
                let indexesOfPolygonsToModify:number[]=[]
                let tablinkdelete:[Vertex,Vertex][]=[]


                for (let j=0;j< createdPolygons.length;j++){
                    let poly=createdPolygons[j]

                    let linksToNumberOccurence=new StringMap<number>()
                    let alreadyAdd=false
                    for (let i=0;i<poly.length;i++){

                        let hash=Hash.segment(poly[i],poly[(i+1)%poly.length])
                        let nbOcc=linksToNumberOccurence.getValue(hash)
                        if (nbOcc==null) linksToNumberOccurence.putValue(hash,1)
                        else if (nbOcc==1) {
                            linksToNumberOccurence.putValue(hash,2)
                            if(!alreadyAdd) indexesOfPolygonsToModify.push(j)
                            alreadyAdd=true
                            tablinkdelete.push([poly[i],poly[(i+1)%poly.length]])
                        }
                        else throw "a segment appears more than two times in the same polygon"

                    }

                }

                this.floatedLinksSuppression(tablinkdelete,indexesOfPolygonsToModify,createdPolygons)
                this.reorderFloatingPolygon(indexesOfPolygonsToModify,createdPolygons)

            }


            private floatedLinksSuppression(tablinkdelete: [Vertex,Vertex][], indexesOfPolygonsToModify:number[],createdPolygons: Array<Array<Vertex>>) {
                for (let l of tablinkdelete) {
                    Vertex.separateTwoVoisins(l[0], l[1]);

                    if (l[0].links.length < 1) {
                        /** delete link in the polygon array **/
                        for (let i of indexesOfPolygonsToModify) {
                            let poly=createdPolygons[i]
                            for (let v of poly) {
                                if (v == l[0]) {
                                    tab.removeFromArray(poly, l[0]);
                                    break
                                }
                            }
                        }
                        tab.removeFromArray(this.mamesh.vertices, l[0]);
                    }

                    if (l[1].links.length < 1) {
                        /** delete link in the polygon array **/
                        for (let i of indexesOfPolygonsToModify) {
                            let poly=createdPolygons[i]
                            for (let v of poly) {
                                if (v == l[1]) {
                                    tab.removeFromArray(poly, l[1]);
                                    break
                                }

                            }
                        }
                        tab.removeFromArray(this.mamesh.vertices, l[1]);
                    }
                }
            }

            private reorderFloatingPolygon(indexPolygonsToReorder:number[], allPolygons: Vertex[][]) {


                for (let i of indexPolygonsToReorder) {
                    let poly:Vertex[]=allPolygons[i]
                        /** Initialization **/
                        let new_poly = [];
                        let first_first_vertex = poly[0];
                        let first_vertex = poly[0];
                        let second_vertex;
                        let vImpasse = true;

                        /** Find a correct second_vertex **/
                        for (let l of first_vertex.links) {
                            if (poly.indexOf(l.to)!=-1) {
                                second_vertex = l.to;
                                break;
                            }
                        }

                        new_poly.push(first_vertex);
                        let vloop = true;

                        /** Travel polygon **/
                        while (vloop) {
                            /** End condition if we see the first vertex of the polygon**/
                            if (second_vertex != first_first_vertex) {
                                for (let l of second_vertex.links) {
                                    if (l.to != first_vertex && poly.indexOf(l.to)!=-1) {
                                        /** Push in a correct order verticies in the polygon **/
                                        new_poly.push(second_vertex);
                                        first_vertex = second_vertex;
                                        second_vertex = l.to;
                                        vImpasse = false;
                                        break;
                                    }
                                }
                            }
                            else {
                                /** End loop **/
                                vloop = false;
                            }

                            if (vImpasse) {
                                /** End loop **/
                                vloop = false;
                            }
                        }

                        /** Reorder the polygon  **/
                        allPolygons[i] = new_poly;

                }
            }


            private areaAndPerimeterComputation(tab_polys: Array<Array<Vertex>>): Array<Vertex> {
                let tabSurface = [];
                let PolygoIndexToVertexCenter = [];

                let oneOverLength = 0;
                let polyIndex = -1;
                for (let p of tab_polys) {
                    polyIndex++;
                    /** Surface with 3 vertices **/
                    if (p.length == 3) {
                        let distA = geo.distance(p[0].position, p[1].position);
                        let distB = geo.distance(p[0].position, p[2].position);
                        let distC = geo.distance(p[1].position, p[2].position);

                        /** area**/
                        if (this.areaVsPerimeter) {
                            /** Heron's formula **/
                            let heronP = (distA + distB + distC) / 2;
                            let surface = Math.sqrt(heronP * (heronP - distA) * (heronP - distB) * (heronP - distC));
                            tabSurface.push(surface)
                        }
                        /** perimeter **/
                        else {
                            let perimetre = distA + distB + distC;
                            tabSurface.push(perimetre)
                        }
                    }
                    /** Surface with 4 vertices **/
                    else if (p.length == 4) {
                        let distA = geo.distance(p[0].position, p[1].position);
                        let distB = geo.distance(p[1].position, p[2].position);
                        let distC = geo.distance(p[2].position, p[3].position);
                        let distD = geo.distance(p[3].position, p[0].position);
                        let distE = geo.distance(p[0].position, p[2].position);

                        /** area **/
                        if (this.areaVsPerimeter) {
                            /** Heron's formula **/
                            let heronP1 = (distA + distB + distE) / 2;
                            let surface1 = Math.sqrt(heronP1 * (heronP1 - distA) * (heronP1 - distB) * (heronP1 - distE));
                            let heronP2 = (distC + distD + distE) / 2;
                            let surface2 = Math.sqrt(heronP2 * (heronP2 - distC) * (heronP2 - distD) * (heronP2 - distE));
                            tabSurface.push(surface1 + surface2)
                        }
                        /** perimeter **/
                        else {
                            let perimetre = distA + distB + distC + distD;
                            tabSurface.push(perimetre)
                        }
                    }
                    /** Surface with more than 4 vertices **/
                    else if (p.length >= 5) {
                        let centerVertex = new mathis.Vertex().setPosition(0, 0, 0);

                        oneOverLength = 1 / (p.length);
                        let tab1 = [];
                        let tab2 = [];

                        for (let v of p) {
                            tab1.push(v.position);
                            tab2.push(oneOverLength)
                        }
                        /** Triangulation center (Isobarycenter) **/
                        geo.baryCenter(tab1, tab2, centerVertex.param);
                        let centerVertex2 = new mathis.Vertex().setPosition(centerVertex.param.x, centerVertex.param.y, centerVertex.param.z);

                        let surface3 = 0;

                        /** area**/
                        if (this.areaVsPerimeter) {
                            for (let i = 0; i < p.length; i++) {
                                /** Heron's formula **/
                                let distA = geo.distance(p[i].position, p[(i + 1) % (p.length)].position);
                                let distB = geo.distance(p[(i + 1) % (p.length)].position, centerVertex2.position);
                                let distC = geo.distance(centerVertex2.position, p[i].position);
                                let heronP3 = (distA + distB + distC) / 2;
                                surface3 = surface3 + Math.sqrt(heronP3 * (heronP3 - distA) * (heronP3 - distB) * (heronP3 - distC))
                            }
                        }

                        /** perimeter **/
                        else {
                            for (let i = 0; i < p.length; i++) {
                                let distA = geo.distance(p[i].position, p[(i + 1) % (p.length)].position);
                                surface3 = surface3 + distA;
                            }
                        }

                        tabSurface.push(surface3);
                        /** save the Triangulation center for faces computation**/
                        PolygoIndexToVertexCenter[polyIndex] = centerVertex2
                    }
                }

                /** Remove n largest faces  **/
                for (let n = 0; n < this.nbBiggerFacesDeleted; n++) {

                    let maxSurf = -1;
                    let numSurf = -1;

                    /** largest faces computation **/
                    for (let i = 0; i < tabSurface.length; i++) {
                        if (tabSurface[i] > maxSurf) {
                            maxSurf = tabSurface[i];
                            numSurf = i;
                        }
                    }
                    tabSurface[numSurf] = -1;

                    /** Remove this face  **/
                    tab_polys[numSurf] = [];
                }

                return PolygoIndexToVertexCenter;
            }


            /** ************************* **/
            /** METHOD: fillConvexSurface **/
            /** Triangularisation with Isobarycenter method**/
            /** ****************************************** **/
            private fillConvexSurface(polygon: Array<Vertex>, centerVertex: Vertex) {
                centerVertex.markers.push(Vertex.Markers.polygonCenter);
                this.mamesh.vertices.push(centerVertex);

                for (let i = 0; i < polygon.length; i++) {
                    this.mamesh.addATriangle(polygon[i], polygon[(i + 1) % (polygon.length)], centerVertex);
                    polygon[i].setOneLink(centerVertex);
                    centerVertex.setOneLink(polygon[i])
                }
            }


            //todo Optimize this method
            /** *************************** **/
            /** METHOD: fillNoConvexSurface **/
            /** Attempt to fill no-convex surface **/
            /** ********************************* **/
            private fillNoConvexSurface(polygon: Array<Vertex>, vertexToNormal: HashMap<Vertex, XYZ>) {
                while (polygon.length >= 3) {
                    let isAcuteAngle = new HashMap<Vertex, boolean>();
                    let ifObtuseAngleExist = false;

                    /** find if vertex is an Acute or an Obtuse angle **/
                    for (let i = 0; i < polygon.length; i = i + 1) {
                        let vPrev;
                        let vNext;
                        let vCurr = polygon[i];

                        /** No array overflow **/
                        if (i == 0) {
                            vPrev = polygon[polygon.length - 1];
                        }
                        else {
                            vPrev = polygon[i - 1];
                        }

                        if (i == polygon.length - 1) {
                            vNext = polygon[0];
                        }
                        else {
                            vNext = polygon[i + 1];
                        }

                        let vector_l_previous = new XYZ(vPrev.position.x - vCurr.position.x, vPrev.position.y - vCurr.position.y, vPrev.position.z - vCurr.position.z);
                        let vector_l_next = new XYZ(vNext.position.x - vCurr.position.x, vNext.position.y - vCurr.position.y, vNext.position.z - vCurr.position.z);

                        /** angle computation **/
                        let newangle = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vector_l_previous, vector_l_next, vertexToNormal.getValue(polygon[i]));

                        /** acute Vs Obtuse angle **/
                        if (newangle < 0) {
                            isAcuteAngle.putValue(vCurr, false);
                            ifObtuseAngleExist = true;
                        }
                        else {
                            isAcuteAngle.putValue(vCurr, true)
                        }
                    }

                    let vbreak = true;

                    /** triangularisation **/
                    for (let i = 0; i < polygon.length && vbreak; i++) {
                        let vPrev;
                        let vNext;
                        let vNextNext;
                        let vCurr = polygon[i];

                        /** No array overflow **/
                        if (i == 0) {
                            vPrev = polygon[polygon.length - 1];
                        }
                        else {
                            vPrev = polygon[i - 1];
                        }

                        if (i == polygon.length - 1) {
                            vNext = polygon[0];
                        }
                        else {
                            vNext = polygon[i + 1];
                        }

                        if (i == polygon.length - 2) {
                            vNextNext = polygon[0];
                        }
                        else {
                            if (i == polygon.length - 1) {
                                vNextNext = polygon[1];
                            }
                            else {
                                vNextNext = polygon[i + 2];
                            }
                        }

                        if (ifObtuseAngleExist) {
                            /** find the Obtuse angle **/
                            if (!isAcuteAngle.getValue(vCurr)) {
                                /** fill triangle **/
                                vCurr.setOneLink(vNextNext);
                                vNextNext.setOneLink(vCurr);
                                this.mamesh.addATriangle(vCurr, vNext, vNextNext);
                                tab.removeFromArray(polygon, vNext);
                                vbreak = false;
                            }
                        }
                        else {
                            /** fill triangle **/
                            vPrev.setOneLink(vNext);
                            vNext.setOneLink(vPrev);
                            this.mamesh.addATriangle(vPrev, vCurr, vNext);
                            tab.removeFromArray(polygon, vCurr);
                            vbreak = false;
                        }
                    }
                }
            }


            go(): void {


                this.SUB_NormalComputer=new NormalComputerFromLinks(this.mamesh)

                this.mamesh.vertices=tab.arrayMinusElements(this.mamesh.vertices,(v:Vertex)=>{return v.links.length==0})


                /** Normals Computation **/
                this.OUT_vertexToNormal = this.SUB_NormalComputer.go()



                /** Polygons detection  **/
                let detectedPolygons = this.polygonsDetection(this.OUT_vertexToNormal);


                this.suppressionOfLinksAppearingTwiceInOnePolygon(detectedPolygons)


                /** Area or Perimeter computation (and remove "nbBiggerFacesDeleted" largest faces) **/
                /** PolygoIndexToVertexCenter used when we fill surfaces with a Isobarycenter (see the fillConvexSurface method )**/
                    // console.log("### Area computation");
                let PolygoIndexToVertexCenter = this.areaAndPerimeterComputation(detectedPolygons);


                /** Surfaces Filling **/
                    // console.log("### Surfaces Filling");
                let indexSurface = -1;
                for (let p of detectedPolygons) {
                    indexSurface++;
                    /** Surface with 3 vertices **/
                    if (p.length == 3) {
                        this.mamesh.addATriangle(p[0], p[1], p[2])
                    }
                    /** Surface with 4 vertices **/
                    else if (p.length == 4) {
                        this.mamesh.addASquare(p[0], p[1], p[2], p[3])
                    }
                    /** Surface with more than 4 vertices **/
                    else if (p.length >= 5) {
                        /** Filling method choice: only convex faces or consider non-convex **/
                        if (this.fillConvexFaces) {
                            let centerVertex2 = PolygoIndexToVertexCenter[indexSurface];
                            this.fillConvexSurface(p, centerVertex2);
                        }
                        else {
                            this.fillNoConvexSurface(p, this.OUT_vertexToNormal);
                        }
                    }
                }

            }
        }
    }
}