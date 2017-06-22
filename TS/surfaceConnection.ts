/**
 * Created by Guillaume Kieffer on 26/05/2017.
 */


module mathis {

    export module surfaceConnection {

        //import getEdgeConsideringAlsoDiagonalVoisin = mathis.graph.getEdgeConsideringAlsoDiagonalVoisin;

        export class SurfaceConnectionProcess {
            mamesh: Mamesh;
            nbBiggerFacesDeleted: number;
            areaVsPerimeter: boolean;
            fillConvexFaces: boolean;
            OUT_vertexToNormal:HashMap<Vertex, XYZ>

            constructor(mamesh: Mamesh, nbBiggerFacesDeleted: number, areaVsPerimeter: boolean, fillConvexFaces: boolean) {
                this.mamesh = mamesh;
                this.nbBiggerFacesDeleted = nbBiggerFacesDeleted;
                this.areaVsPerimeter = areaVsPerimeter;
                this.fillConvexFaces = fillConvexFaces;
            }

            /** ************************* **/
            /** METHOD: thornsSuppression **/
            /** Remove tips and insulated vertices **/
            /** ********************************** **/
            private thornsSuppression() {
                for (let v of this.mamesh.vertices) {
                    let loopflag = true;
                    let tip = v;

                    while (loopflag) {
                        if (tip.links.length == 1) {
                            let oldtip = tip;
                            tip = tip.links[0].to;
                            Vertex.separateTwoVoisins(oldtip, oldtip.links[0].to);
                            tab.removeFromArray(this.mamesh.vertices, oldtip);
                        }
                        else {
                            loopflag = false;
                        }
                    }
                }

                /** Removing insulated vertices **/
                // tab.arrayMinusElements(this.mamesh.vertices, (v)=> v.links.length<1);
                this.mamesh.vertices = tab.arrayMinusElements(this.mamesh.vertices, (v: Vertex) => v.links.length == 0)


                // for (let v of this.mamesh.vertices){
                //     if (v.links.length<1)
                //         tab.removeFromArray(this.mamesh.vertices, v);
                // }

            }

            /** ************************** **/
            /** METHOD: normalsComputation **/
            /** Compute normals and stock them in a hashMap **/
            /** ******************************************* **/
            private normalsComputation(): HashMap<Vertex, XYZ> {

                /** HashMap creation **/
                let vertexToNormal = new HashMap<Vertex, XYZ>();
                let vertexToNumStrat = new HashMap<Vertex, number>();

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
                        vertexToNumStrat.putValue(v, -1)
                    }
                }
                return vertexToNormal;
            }

            /** *********************** **/
            /** METHOD: aligningNormals **/
            /** align normals in the same orientation **/
            /** ************************************* **/
            private aligningNormals(vertexToNormal: HashMap<Vertex, XYZ>) {
                let startvertex = this.mamesh.vertices[0];
                let i = 0;

                /** if normal is nil, use another vertex **/
                while (i < this.mamesh.vertices.length - 1 && vertexToNormal.getValue(startvertex).x == 0 && vertexToNormal.getValue(startvertex).y == 0 && vertexToNormal.getValue(startvertex).z == 0) {
                    startvertex = this.mamesh.vertices[i + 1];
                    i++;
                }

                /** Strata initialization**/
                let markedVertex = [];
                markedVertex.push(startvertex);
                let strates = [];
                strates.push(markedVertex);
                let alreadySeen = new mathis.HashMap<Vertex, boolean>();

                let curentEdge = markedVertex;
                while (curentEdge.length > 0) {
                    curentEdge = mathis.graph.getEdge(curentEdge, alreadySeen);
                    strates.push(curentEdge);
                }
                /** Strata course**/
                for (let i = 1; i < strates.length; i++) {
                    for (let v of strates[i]) {
                        /**for all current links **/
                        for (let l of v.links) {
                            /** for all previous vertices **/
                            for (let p of strates[i - 1]) {
                                /** if adjacent **/
                                if (l.to == p) {
                                    /** if normal is nil, use previous normal **/
                                    if (vertexToNormal.getValue(v).x == 0 && vertexToNormal.getValue(v).y == 0 && vertexToNormal.getValue(v).z == 0) {
                                        let newNormale0 = new XYZ(vertexToNormal.getValue(p).x, vertexToNormal.getValue(p).y, vertexToNormal.getValue(p).z);
                                        vertexToNormal.putValue(v, newNormale0)
                                    }

                                    /** if dot product is negative : reverse the normal **/
                                    if (BABYLON.Vector3.Dot(vertexToNormal.getValue(p), vertexToNormal.getValue(v)) < 0) {
                                        let newNormale = new XYZ(-vertexToNormal.getValue(v).x, -vertexToNormal.getValue(v).y, -vertexToNormal.getValue(v).z);
                                        vertexToNormal.putValue(v, newNormale)
                                    } //finversion
                                } //flink<>p
                            } //fstrat-1
                        } //flinks
                    } //fvertex
                } //fstrats
            }


            /** ************************************** **/
            /** METHOD: alreadyFilledSurfacesDetection **/
            /** Mark surface links if already filled   **/
            /** ************************************** **/
            private alreadyFilledSurfacesDetection(vertexToNormal: HashMap<Vertex, XYZ>): StringMap<boolean> {
                let alreadyTravel = new StringMap<boolean>();

                for (let v of this.mamesh.vertices) {
                    for (let l of v.links) {
                        /** initialization : all already traveled links at false**/
                        alreadyTravel.putValue(v.hashNumber + "," + l.to.hashNumber, false);
                    }
                }

                /** triangles **/
                for (let i = 0; i < this.mamesh.smallestTriangles.length; i = i + 3) {
                    let Firstneighbour = this.mamesh.smallestTriangles[i];
                    let Secondneighbour = this.mamesh.smallestTriangles[i + 1];
                    let Thirdneighbour = this.mamesh.smallestTriangles[i + 2];

                    let normale = vertexToNormal.getValue(this.mamesh.smallestTriangles[i]);
                    let vect1 = new BABYLON.Vector3(0, 0, 0);
                    vect1.x = Firstneighbour.position.x - Secondneighbour.position.x;
                    vect1.y = Firstneighbour.position.y - Secondneighbour.position.y;
                    vect1.z = Firstneighbour.position.z - Secondneighbour.position.z;

                    let vect2 = new BABYLON.Vector3(0, 0, 0);
                    vect2.x = Firstneighbour.position.x - Thirdneighbour.position.x;
                    vect2.y = Firstneighbour.position.y - Thirdneighbour.position.y;
                    vect2.z = Firstneighbour.position.z - Thirdneighbour.position.z;

                    /** Mark links in the right direction of rotation **/
                    let valeur1 = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(new XYZ(vect1.x, vect1.y, vect1.z), new XYZ(vect2.x, vect2.y, vect2.z), normale);
                    let valeur2 = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(new XYZ(vect2.x, vect2.y, vect2.z), new XYZ(vect1.x, vect1.y, vect1.z), normale);
                    if (valeur1 < valeur2) {
                        alreadyTravel.putValue(Firstneighbour.hashNumber + "," + Secondneighbour.hashNumber, true);
                        alreadyTravel.putValue(Secondneighbour.hashNumber + "," + Thirdneighbour.hashNumber, true);
                        alreadyTravel.putValue(Thirdneighbour.hashNumber + "," + Firstneighbour.hashNumber, true);
                    }
                    else {
                        alreadyTravel.putValue(Firstneighbour.hashNumber + "," + Thirdneighbour.hashNumber, true);
                        alreadyTravel.putValue(Thirdneighbour.hashNumber + "," + Secondneighbour.hashNumber, true);
                        alreadyTravel.putValue(Secondneighbour.hashNumber + "," + Firstneighbour.hashNumber, true);
                    }
                }

                /** quads **/
                for (let i = 0; i < this.mamesh.smallestSquares.length; i = i + 4) {
                    let Firstneighbour = this.mamesh.smallestSquares[i];
                    let Secondneighbour = this.mamesh.smallestSquares[i + 1];
                    let Thirdneighbour = this.mamesh.smallestSquares[i + 2];
                    let Fourthneighbour = this.mamesh.smallestSquares[i + 3];

                    let normale = vertexToNormal.getValue(this.mamesh.smallestSquares[i]);
                    let vect1 = new BABYLON.Vector3(0, 0, 0);
                    vect1.x = Firstneighbour.position.x - Secondneighbour.position.x;
                    vect1.y = Firstneighbour.position.y - Secondneighbour.position.y;
                    vect1.z = Firstneighbour.position.z - Secondneighbour.position.z;

                    let vect2 = new BABYLON.Vector3(0, 0, 0);
                    vect2.x = Firstneighbour.position.x - Fourthneighbour.position.x;
                    vect2.y = Firstneighbour.position.y - Fourthneighbour.position.y;
                    vect2.z = Firstneighbour.position.z - Fourthneighbour.position.z;

                    /** Mark links in the right direction of rotation **/
                    let valeur1 = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(new XYZ(vect1.x, vect1.y, vect1.z), new XYZ(vect2.x, vect2.y, vect2.z), normale);
                    let valeur2 = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(new XYZ(vect2.x, vect2.y, vect2.z), new XYZ(vect1.x, vect1.y, vect1.z), normale);
                    if (valeur1 < valeur2) {
                        alreadyTravel.putValue(Firstneighbour.hashNumber + "," + Secondneighbour.hashNumber, true);
                        alreadyTravel.putValue(Secondneighbour.hashNumber + "," + Thirdneighbour.hashNumber, true);
                        alreadyTravel.putValue(Thirdneighbour.hashNumber + "," + Fourthneighbour.hashNumber, true);
                        alreadyTravel.putValue(Fourthneighbour.hashNumber + "," + Firstneighbour.hashNumber, true);
                    }
                    else {
                        alreadyTravel.putValue(Firstneighbour.hashNumber + "," + Fourthneighbour.hashNumber, true);
                        alreadyTravel.putValue(Fourthneighbour.hashNumber + "," + Thirdneighbour.hashNumber, true);
                        alreadyTravel.putValue(Thirdneighbour.hashNumber + "," + Secondneighbour.hashNumber, true);
                        alreadyTravel.putValue(Secondneighbour.hashNumber + "," + Firstneighbour.hashNumber, true);
                    }
                }
                return alreadyTravel;
            }


            /** ******************************* **/
            /** METHOD: floatedLinksSuppression **/
            /** remove "Floated links" **/
            /** ********************** **/
            private floatedLinksSuppression(tablinkdelete: Array<Array<Vertex>>, tab_polys: Array<Array<Vertex>>) {
                for (let l of tablinkdelete) {
                    Vertex.separateTwoVoisins(l[0], l[1]);

                    if (l[0].links.length < 1) {
                        /** delete link in the polygon array **/
                        for (let poly of tab_polys) {
                            for (let v of poly) {
                                if (v == l[0]) {
                                    tab.removeFromArray(poly, l[0]);
                                }
                            }
                        }
                        tab.removeFromArray(this.mamesh.vertices, l[0]);
                    }

                    if (l[1].links.length < 1) {
                        /** delete link in the polygon array **/
                        for (let poly of tab_polys) {
                            for (let v of poly) {
                                if (v == l[1]) {
                                    tab.removeFromArray(poly, l[1]);
                                }

                            }
                        }
                        tab.removeFromArray(this.mamesh.vertices, l[1]);
                    }
                }
            }


            /** ************************* **/
            /** METHOD: polygonsDetection **/
            /** Detect vertex for all polygons and call the floatedLinksSuppression method **/
            /** ************************************************************************** **/
            // private polygonsDetection(vertexToNormal: HashMap<Vertex, XYZ>, alreadyTravel: StringMap<boolean>): Array<Array<Vertex>> {
            //     let tablinkdelete = [];
            //     let tab_polys = [];
            //     let tabIsFloatingLinks = [];
            //
            //     /** link array creation **/
            //     let tablinks = [];
            //     for (let v of this.mamesh.vertices) {
            //         for (let l of v.links) {
            //             let elemlink = [v, l.to];
            //             tablinks.push(elemlink)
            //         }
            //     }
            //
            //     for (let lk of tablinks) {
            //
            //         /** array to save traveled links**/
            //         let traveledlinks = [];
            //         let first_point = lk[0];
            //         let second_point = lk[1];
            //         // let nb_loop = 0;
            //         let v_previous = lk[0];
            //         let v_current = lk[1];
            //
            //         /** a new link structure : [first vertex; second vertex] **/
            //         let newlinkstart = [v_previous, v_current];
            //         traveledlinks.push(newlinkstart);
            //
            //         /** only if the current link has not been traveled **/
            //         if (alreadyTravel.getValue(v_previous.hashNumber + "," + v_current.hashNumber) != true) {
            //             let current_poly = [];
            //             let IsFloatingLinks = false;
            //
            //             let vloop = true;
            //
            //             while (vloop) {
            //                 let anglemin = 6.4;
            //                 let l_pretend = v_previous.links[0];
            //                 let vImpasse = true;
            //
            //                 /** for each link of the current vertex **/
            //                 for (let l_concur of v_current.links) {
            //
            //                     /** omit the start link and already traveled links **/
            //                     if (l_concur.to != v_previous && (alreadyTravel.getValue(v_current.hashNumber + "," + l_concur.to.hashNumber) == false)) {
            //                         let vector_l_previous = new XYZ(v_previous.position.x - v_current.position.x, v_previous.position.y - v_current.position.y, v_previous.position.z - v_current.position.z);
            //                         let vector_l_next = new XYZ(l_concur.to.position.x - v_current.position.x, l_concur.to.position.y - v_current.position.y, l_concur.to.position.z - v_current.position.z);
            //
            //                         /** angle computation **/
            //                         let newangle = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vector_l_previous, vector_l_next, vertexToNormal.getValue(v_previous));
            //                         if (newangle < 0) newangle = (6.2831853072 + newangle); // only positive angle
            //                         /** retain the new angle and yhe new link **/
            //                         if (newangle < anglemin) {
            //                             anglemin = newangle;
            //                             l_pretend = l_concur
            //                         }
            //
            //                         vImpasse = false;
            //                     }
            //                 }
            //
            //                 /** If finding impasse **/
            //                 if (vImpasse) {
            //                     for (let l_concur of v_current.links) {
            //                         if (l_concur.to == v_previous) {
            //                             /**if impasse **/
            //                             l_pretend = l_concur;
            //                             current_poly[current_poly.length - 1] = l_concur.to;
            //                             break;
            //                         }
            //                     }
            //                 }
            //
            //                 /** retain the traveled link **/
            //                 let newlink = [v_current, l_pretend.to];
            //
            //                 /** if the link is already visited, it's a "floating link" **/
            //                 let isdoubleL = false;
            //                 for (let l_in of traveledlinks) {
            //                     if (newlink[0] == l_in[1] && newlink[1] == l_in[0]) isdoubleL = true;
            //                 }
            //
            //                 /** if the vertex is already visited, there are a "floating link" or "crossed links" **/
            //                 let isdoubleV = false;
            //                 for (let v_in of current_poly) {
            //                     if (v_in == l_pretend.to) isdoubleV = true;
            //                 }
            //
            //                 if (isdoubleL) {
            //                     /** delete the "floating link" **/
            //                     tablinkdelete.push(newlink);
            //                     IsFloatingLinks = true;
            //                 }
            //                 else {
            //                     /** push vertex in the polygon array (only if the current vertex isn't a floating link**/
            //                     if (!isdoubleV) {
            //                         current_poly.push(l_pretend.to);
            //                     }
            //                     /** retain traveled link **/
            //                     traveledlinks.push(newlink);
            //                 }
            //
            //                 /** mark the link as "already traveled" **/
            //                 alreadyTravel.putValue(v_current.hashNumber + "," + l_pretend.to.hashNumber, true);
            //
            //                 /** next vertex **/
            //                 v_previous = v_current;
            //                 v_current = l_pretend.to;
            //
            //                 /** When we fall back on the first point, end of polygon detection*/
            //                 if (v_previous == first_point && v_current == second_point) {
            //                     /** break **/
            //                     vloop = false;
            //                 }
            //             }
            //             /** add a new polygon in the polygon array **/
            //             tab_polys.push(current_poly);
            //             tabIsFloatingLinks.push(IsFloatingLinks);
            //         }
            //     }
            //
            //     /** Floated link suppression  **/
            //     this.floatedLinksSuppression(tablinkdelete, tab_polys);
            //
            //     /** Reorder vertices if polygons are in the Floating Links Array   **/
            //     this.reorderFloatingPolygon(tab_polys, tabIsFloatingLinks);
            //
            //     return tab_polys;
            // }



            private polygonsDetection(vertexToNormal: HashMap<Vertex, XYZ>, alreadyTravel: StringMap<boolean>): Array<Array<Vertex>> {


                let toSort=(a,b)=> a.angle-b.angle

                function nextLink(aLink:[Vertex,Vertex],linksAlreadySeenInCurrentPoly:StringMap<[Vertex,Vertex]>,allRemainingLinks:StringMap<[Vertex,Vertex]>):[Vertex,Vertex]{
                    let linkAndAngle:{link:[Vertex,Vertex];angle:number}[]=[]


                    for (let l of aLink[1].links){
                        /**a priori on ne repart pas d'ou on vient (sauf impasse, cf plus loin)*/
                        if (l.to!=aLink[0])  {
                            let link:[Vertex,Vertex]=[aLink[1],l.to]
                            let hash=Hash.orientedSegment(aLink[1],l.to)
                            if (allRemainingLinks.getValue(hash)!=null) {
                                let vecA = XYZ.newFrom(aLink[0].position).substract(aLink[1].position)
                                let vecB = XYZ.newFrom(l.to.position).substract(aLink[1].position)
                                let angle = geo.angleBetweenTwoVectorsBetween0And2Pi( vecB,vecA, vertexToNormal.getValue(aLink[1]))+Math.PI
                                linkAndAngle.push({link: link, angle: angle})
                                //cc(angle,l.to.hashNumber)
                            }
                        }
                    }

                    if (linkAndAngle.length>0){
                        linkAndAngle.sort(toSort)
                        //for (let i=0;i<linkAndAngle.length;i++) cc(linkAndAngle[i].angle)
                        let best=linkAndAngle[0].link
                        let hashOfBest=Hash.orientedSegmentTuple(best)

                        if (linksAlreadySeenInCurrentPoly.getValue(hashOfBest)!=null) {
                            /**on a bouclé*/
                            return null
                        }
                        else return best
                    }
                    else {
                        /**pas de sorties autre que l'entrée : demi tour*/
                        cc("demi tour",Hash.orientedSegment(aLink[1],aLink[0]))
                        return [aLink[1],aLink[0]]
                    }

                    //
                    // /**le dernier lien a été déjà vu dans ce polygon: on est retombé sur ses pieds, c'est fini*/
                    //
                    //
                    // if (linkAndAngle.length==0){
                    //     cc('pas de sorties')
                    //     if (oneInTheSamePoly) return null
                    //     /**sinon on fait demi-tour*/
                    //     else if (allRemainingLinks.getValue(Hash.orientedSegment(aLink[1],aLink[0]))!=null) {
                    //
                    //     }
                    //     else throw "bizarre : on ne peux pas faire demi tour"
                    // }
                    // else if (linkAndAngle.length==1){
                    //     return linkAndAngle[0].link
                    // }
                    // else {
                    //     linkAndAngle=
                    //     return linkAndAngle[0].link
                    // }
                }


                function addLinkToPoly(poly:Vertex[], link:[Vertex,Vertex],linksAlreadySeenInCurrentPoly:StringMap<[Vertex,Vertex]>):void{
                    poly.push(link[0])
                    linksAlreadySeenInCurrentPoly.putValue(Hash.orientedSegment(link[0],link[1]),link)
                }


                let allRemainingLinks=new StringMap<[Vertex,Vertex]>()


                for (let v of this.mamesh.vertices) {
                    for (let l of v.links) {
                        let hash=Hash.orientedSegment(v,l.to)
                        if (alreadyTravel.getValue(hash)!=true) {
                            allRemainingLinks.putValue(hash,[v,l.to])
                        }
                    }
                }


                /**all poly*/
                let polygons:Vertex[][] = [];


                let aRemainingLink=allRemainingLinks.oneValue()


                while (aRemainingLink!=null){


                    let poly=[]
                    let linksAlreadySeenInCurrentPoly=new StringMap<[Vertex,Vertex]>()
                    polygons.push(poly)
                    addLinkToPoly(poly,aRemainingLink,linksAlreadySeenInCurrentPoly)


                    cc('aRemamin',Hash.orientedSegmentTuple(aRemainingLink))
                    let currentLink=nextLink(aRemainingLink,linksAlreadySeenInCurrentPoly,allRemainingLinks)

                    if (currentLink==null) throw "very strange"

                    while (currentLink!=null){
                        cc('currentLink',Hash.orientedSegmentTuple(currentLink))
                        addLinkToPoly(poly,currentLink,linksAlreadySeenInCurrentPoly)
                        currentLink=nextLink(currentLink,linksAlreadySeenInCurrentPoly,allRemainingLinks)
                    }

                    for (let key of linksAlreadySeenInCurrentPoly.allKeys()){
                        allRemainingLinks.removeKey(key)
                    }


                    aRemainingLink=allRemainingLinks.oneValue()

                }



                //
                //
                // /** link array creation **/
                // let tablinks = [];
                // for (let v of this.mamesh.vertices) {
                //     for (let l of v.links) {
                //         let elemlink = [v, l.to];
                //         tablinks.push(elemlink)
                //     }
                // }
                //
                // for (let lk of tablinks) {
                //
                //     /** array to save traveled links**/
                //     let traveledlinks = [];
                //     let first_point = lk[0];
                //     let second_point = lk[1];
                //     let v_previous = lk[0];
                //     let v_current = lk[1];
                //
                //     /** a new link structure : [first vertex; second vertex] **/
                //     let newlinkstart = [v_previous, v_current];
                //     traveledlinks.push(newlinkstart);
                //
                //     /** only if the current link has not been traveled **/
                //     if (alreadyTravel.getValue(v_previous.hashNumber + "," + v_current.hashNumber) != true) {
                //         let current_poly = [];
                //         let IsFloatingLinks = false;
                //
                //         let vloop = true;
                //
                //         while (vloop) {
                //             let anglemin = 6.4;
                //             let l_pretend = v_previous.links[0];
                //             let vImpasse = true;
                //
                //             /** for each link of the current vertex **/
                //             for (let l_concur of v_current.links) {
                //
                //                 /** omit the start link and already traveled links **/
                //                 if (l_concur.to != v_previous && (alreadyTravel.getValue(v_current.hashNumber + "," + l_concur.to.hashNumber) == false)) {
                //                     let vector_l_previous = new XYZ(v_previous.position.x - v_current.position.x, v_previous.position.y - v_current.position.y, v_previous.position.z - v_current.position.z);
                //                     let vector_l_next = new XYZ(l_concur.to.position.x - v_current.position.x, l_concur.to.position.y - v_current.position.y, l_concur.to.position.z - v_current.position.z);
                //
                //                     /** angle computation **/
                //                     let newangle = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vector_l_previous, vector_l_next, vertexToNormal.getValue(v_previous));
                //                     if (newangle < 0) newangle = (6.2831853072 + newangle); // only positive angle
                //                     /** retain the new angle and yhe new link **/
                //                     if (newangle < anglemin) {
                //                         anglemin = newangle;
                //                         l_pretend = l_concur
                //                     }
                //
                //                     vImpasse = false;
                //                 }
                //             }
                //
                //             /** If finding impasse **/
                //             if (vImpasse) {
                //                 for (let l_concur of v_current.links) {
                //                     if (l_concur.to == v_previous) {
                //                         /**if impasse **/
                //                         l_pretend = l_concur;
                //                         current_poly[current_poly.length - 1] = l_concur.to;
                //                         break;
                //                     }
                //                 }
                //             }
                //
                //             /** retain the traveled link **/
                //             let newlink:[Vertex,Vertex] = [v_current, l_pretend.to];
                //
                //             /** if the link is already visited, it's a "floating link" **/
                //             let isdoubleL = false;
                //             for (let l_in of traveledlinks) {
                //                 if (newlink[0] == l_in[1] && newlink[1] == l_in[0]) isdoubleL = true;
                //             }
                //
                //             /** if the vertex is already visited, there are a "floating link" or "crossed links" **/
                //             let isdoubleV = false;
                //             for (let v_in of current_poly) {
                //                 if (v_in == l_pretend.to) isdoubleV = true;
                //             }
                //
                //             if (isdoubleL) {
                //                 /** delete the "floating link" **/
                //                 tablinkdelete.push(newlink);
                //                 IsFloatingLinks = true;
                //             }
                //             else {
                //                 /** push vertex in the polygon array (only if the current vertex isn't a floating link**/
                //                 if (!isdoubleV) {
                //                     current_poly.push(l_pretend.to);
                //                 }
                //                 /** retain traveled link **/
                //                 traveledlinks.push(newlink);
                //             }
                //
                //             /** mark the link as "already traveled" **/
                //             alreadyTravel.putValue(v_current.hashNumber + "," + l_pretend.to.hashNumber, true);
                //
                //             /** next vertex **/
                //             v_previous = v_current;
                //             v_current = l_pretend.to;
                //
                //             /** When we fall back on the first point, end of polygon detection*/
                //             if (v_previous == first_point && v_current == second_point) {
                //                 /** break **/
                //                 vloop = false;
                //             }
                //         }
                //         /** add a new polygon in the polygon array **/
                //         tab_polys.push(current_poly);
                //         tabIsFloatingLinks.push(IsFloatingLinks);
                //     }
                // }



                return polygons;
            }



            suppressSegmentsWhichAppearsTwiceInOnePolygon(polygons:Vertex[][]){

                /**links which appears twice in a same poly*/
                let tablinkdelete:[Vertex,Vertex][] = []

                /**index of poly with link to suppress*/
                let tabIsFloatingLinks:boolean[] = [];

                for (let poly of polygons){
                    let polySegments=new StringMap<number>()

                    for (let i=0;i<poly.length+1;i++){
                        let v0=poly[i]
                        let v1=poly[(i+1)+poly.length]
                        let hash=Hash.segment(v0,v1)
                        let val=polySegments.getValue(hash)
                        if (val==null) polySegments.putValue(hash,1)
                        else if(val==1) {
                            polySegments.putValue(hash,val+1)
                            tablinkdelete.push([v0,v1])

                        }
                        else throw "a segment appears more than twice in a polygon"
                    }




                }






                /** Floated link suppression  **/
                this.floatedLinksSuppression(tablinkdelete, polygons);

                /** Reorder vertices if polygons are in the Floating Links Array   **/
                this.reorderFloatingPolygon(polygons, tabIsFloatingLinks);


            }



            /** *********************************** **/
            /** METHOD: reorderFloatingPolygon **/
            /** reorder vertices when they are a floating link **/
            /** ********************************************** **/
            private reorderFloatingPolygon(tab_polys: Array<Array<Vertex>>, tabIsFloatingLinks: Array<boolean>) {



                for (let i = 0; (i < tab_polys.length) && (i < tabIsFloatingLinks.length); i++) {
                    if (tabIsFloatingLinks[i]) {
                        /** Initialization **/
                        let new_poly = [];
                        let first_first_vertex = tab_polys[i][0];
                        let first_vertex = tab_polys[i][0];
                        let second_vertex;
                        let vImpasse = true;

                        /** Find a correct second_vertex **/
                        for (let l of first_vertex.links) {
                            if (this.isInPolygon(tab_polys[i], l.to)) {
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
                                    if (l.to != first_vertex && this.isInPolygon(tab_polys[i], l.to)) {
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
                        tab_polys[i] = new_poly;
                    }
                }
            }

            /** *********************************** **/
            /** METHOD: isInPolygon **/
            /** say if the vertex is in the polygon **/
            /** ********************************************** **/
            private isInPolygon(poly: Array<Vertex>, vertexIn: Vertex): boolean {
                for (let v of poly) {
                    if (v == vertexIn) {
                        return true;
                    }
                }
                return false;
            }


            /** *********************************** **/
            /** METHOD: areaAndPerimeterComputation **/
            /** Compute Area ou Perimeter of each polygon and remove N largest faces **/
            /** ******************************************************************** **/
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

            /**################**/
            /**###### GO ######**/
            /**################**/
            go(): Mamesh {
                // console.log("------- START -------");

                /** Thorns suppression **/
                // console.log("### Thorns suppression");
                this.thornsSuppression();


                /** Normals Computation **/
                    // console.log("### Normals computation");
                this.OUT_vertexToNormal = this.normalsComputation();

                /** Aligning Normals **/
                // console.log("### Aligning normals");
                this.aligningNormals(this.OUT_vertexToNormal);

                // for (let v of this.mamesh.vertices)
                // {
                //     console.log(vertexToNormal.getValue(v));
                // }

                /** Already filled surfaces detection  **/
                    // console.log("### Already filled surfaces detection");
                let alreadyTravel = this.alreadyFilledSurfacesDetection(this.OUT_vertexToNormal);


                /** Polygons detection  **/
                    // console.log("### Polygons detection ");
                let tab_polys = this.polygonsDetection(this.OUT_vertexToNormal, alreadyTravel);


                // for (let p of tab_polys) {
                //     console.log("Polygon:");
                //     for (let v of p) {
                //         console.log(v.position);
                //     }
                // }


                /** Area or Perimeter computation (and remove "nbBiggerFacesDeleted" largest faces) **/
                /** PolygoIndexToVertexCenter used when we fill surfaces with a Isobarycenter (see the fillConvexSurface method )**/
                    // console.log("### Area computation");
                let PolygoIndexToVertexCenter = this.areaAndPerimeterComputation(tab_polys);


                /** Surfaces Filling **/
                    // console.log("### Surfaces Filling");
                let indexSurface = -1;
                for (let p of tab_polys) {
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

                // console.log("------- END -------");
                return this.mamesh
            }
        }
    }
}