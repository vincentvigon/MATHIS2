/**
 * Created by Kieffer on 23/04/2017.
 */
var mathis;
(function (mathis) {
    var surfaceConnection;
    (function (surfaceConnection) {
        var SurfaceCorrectionProcess = (function () {
            function SurfaceCorrectionProcess(mamesh) {
                this.mamesh = mamesh;
            }
            SurfaceCorrectionProcess.prototype.go = function () {
                var verticesDeleted = [];
                var verticesSaved = [];
                /** pour chaque point */
                //let v = mamesh.vertices[12];
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    // console.log("FOR LOOOOOOOP");
                    // console.log(v.param);
                    /** si le point n'a qu'un lien ou n'a pas de lien on le supprime directement **/
                    if (v.links.length == 1 || v.links.length == 0) {
                        //console.log("Stop Vrai facile");
                        verticesDeleted.push(v);
                    }
                    else {
                        var alreadySeen = new mathis.HashMap();
                        for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                            var vs = _c[_b];
                            alreadySeen.putValue(vs, false);
                        }
                        var tab = [];
                        tab.push(v);
                        var firstVertex = v;
                        var currentVertex = v;
                        var loopFlag = true;
                        var i = 0;
                        /** tant que **/
                        while (loopFlag && i < 80) {
                            // console.log("CURRENT---VERTEX");
                            // console.log(currentVertex.param);
                            i++;
                            alreadySeen.putValue(currentVertex, true);
                            var ifExistFreeNeighbour = false;
                            var newCurrentVertex = currentVertex;
                            /** pour chaque lien du point en cours **/
                            for (var _d = 0, _e = currentVertex.links; _d < _e.length; _d++) {
                                var l = _e[_d];
                                /** si il y a un voisin non visité **/
                                if (!alreadySeen.getValue(l.to)) {
                                    ifExistFreeNeighbour = true;
                                    newCurrentVertex = l.to;
                                }
                                /** si on a un chemin vers le point de départ et que le point en cours n'est pas en 2e position dans le stack END FALSE **/
                                /** ne fonctionne pas à la première itération **/
                                if (l.to == firstVertex && tab.length > 1 && currentVertex != tab[1]) {
                                    loopFlag = false;
                                    //console.log("Stop False");
                                    verticesSaved.push(firstVertex);
                                }
                            }
                            currentVertex = newCurrentVertex;
                            /**  si tous les voisins ont été visités et que le point courant et celui de départ END TRUE**/
                            if (!ifExistFreeNeighbour && currentVertex == firstVertex) {
                                /** arret de la boucle **/
                                loopFlag = false;
                                //console.log("Stop Vrai");
                                verticesDeleted.push(firstVertex);
                            }
                            /** si tous les voisins ont été visités **/
                            if (!ifExistFreeNeighbour) {
                                // console.log("dépile");
                                /** dépile la pile **/
                                tab.pop();
                                /** prend pour vertex en cours le vertex précédent dans la pile **/
                                currentVertex = tab[tab.length - 1];
                            }
                            else 
                            /** s'il y a un voisin de libre **/
                            {
                                /** empile **/
                                tab.push(currentVertex);
                            }
                        }
                    }
                }
                // console.log ("POINTS A GARDER");
                // for (let v of verticesSaved)
                // {
                //     console.log (v.param);
                // }
                // console.log ("POINTS A SUPPRIMER");
                for (var _f = 0, verticesDeleted_1 = verticesDeleted; _f < verticesDeleted_1.length; _f++) {
                    var v = verticesDeleted_1[_f];
                    for (var _g = 0, _h = v.links; _g < _h.length; _g++) {
                        var l = _h[_g];
                        Vertex.separateTwoVoisins(v, l.to);
                    }
                }
                /** suppression des points inutiles **/
                for (var _j = 0, verticesDeleted_2 = verticesDeleted; _j < verticesDeleted_2.length; _j++) {
                    var v = verticesDeleted_2[_j];
                    tab.removeFromArray(this.mamesh.vertices, v);
                }
                /** autre méthode possible: reconstruire la liste **/
                //tab.arrayMinusElements(mamesh.vertices, )
                return this.mamesh;
            };
            return SurfaceCorrectionProcess;
        }());
        surfaceConnection.SurfaceCorrectionProcess = SurfaceCorrectionProcess;
        var SurfaceConnectionProcess = (function () {
            function SurfaceConnectionProcess(mamesh, nbBiggerFacesDeleted) {
                this.makeLinks = true;
                this.mamesh = mamesh;
                this.nbBiggerFacesDeleted = nbBiggerFacesDeleted;
            }
            SurfaceConnectionProcess.prototype.go = function () {
                /** correction du mamesh **/
                var correct = new surfaceConnection.SurfaceCorrectionProcess(this.mamesh);
                this.mamesh = correct.go();
                /** *********************** **/
                /** Calcul des normales **/
                /** *********************** **/
                var tabRetenuVect1 = [];
                var tabRetenuVect2 = [];
                /** création de la HashMap **/
                var vertexToNormal = new HashMap();
                var vertexToNumStrat = new HashMap();
                /** Calcul des produits scalaires. On parcourt chaque point **/
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    /** initialisation des variables */
                    var minscal = 0;
                    var instantDot = void 0;
                    var vectorTable = [];
                    /** Pour chaque lien **/
                    for (var _b = 0, _c = v.links; _b < _c.length; _b++) {
                        var l = _c[_b];
                        /** creation d'un vecteur à l'aide des coordonnés**/
                        var vect = new BABYLON.Vector3(0, 0, 0);
                        vect.x = l.to.param.x - v.param.x;
                        vect.y = l.to.param.y - v.param.y;
                        vect.z = l.to.param.z - v.param.z;
                        vect.normalize();
                        /** on récupère les vecteurs normalisés de chaque lien dans une table**/
                        vectorTable.push(vect);
                    } //ffor pour chaque lien
                    /** calcul du scalaire minimum : Initiatlisation **/
                    minscal = BABYLON.Vector3.Dot(vectorTable[0], vectorTable[1]);
                    if (minscal < 0)
                        minscal *= -1; //valeur absolue
                    var vect1 = vectorTable[0];
                    var vect2 = vectorTable[1];
                    /** Double boucle pour chaque vecteur comparé à chaque autres vecteur (dot product)**/
                    for (var i_1 = 0; i_1 < vectorTable.length; i_1++) {
                        for (var j = i_1 + 1; j < vectorTable.length; j++) {
                            instantDot = BABYLON.Vector3.Dot(vectorTable[i_1], vectorTable[j]);
                            if (instantDot < 0)
                                instantDot *= -1; //valeur absolue
                            /** si on trouve une valeur plus petite **/
                            if (minscal > instantDot) {
                                /** nouveau minimum **/
                                minscal = instantDot;
                                /** nouveaux vecteurs retenus pour le crossProduct **/
                                vect1 = vectorTable[i_1];
                                vect2 = vectorTable[j];
                            }
                        }
                    }
                    /** Tableaux où on stocke les vecteurs retenus (un pour tous les 1er vecteurs de tous les points, **/
                    /** un autre tous les 2eme vecteurs de tous les points) **/
                    tabRetenuVect1.push(vect1);
                    tabRetenuVect2.push(vect2);
                    vertexToNumStrat.putValue(v, -1);
                } //ffor pour chaque point
                /** calcul de la normale **/
                for (var i_2 = 0; (i_2 < tabRetenuVect1.length) && (i_2 < tabRetenuVect2.length); i_2++) {
                    var normale = BABYLON.Vector3.Cross(tabRetenuVect1[i_2], tabRetenuVect2[i_2]);
                    normale.normalize();
                    /** enregistrement de la normale dans la HashMap **/
                    vertexToNormal.putValue(this.mamesh.vertices[i_2], new XYZ(normale.x, normale.y, normale.z));
                }
                /** *********************** **/
                /** Alignement des normales **/
                /** *********************** **/
                /** choix du vertex de départ **/
                var startvertex = this.mamesh.vertices[0];
                var i = 0;
                /** si normale nulle, prend un autre point **/
                while (i < this.mamesh.vertices.length - 1 && vertexToNormal.getValue(startvertex).x == 0 && vertexToNormal.getValue(startvertex).y == 0 && vertexToNormal.getValue(startvertex).z == 0) {
                    startvertex = this.mamesh.vertices[i + 1];
                    i++;
                } //todo: si tous les points de la figure ont une normale nulle, indiquer une erreur: figure invalide
                /** initatlisation des strates **/
                var markedVertex = [];
                markedVertex.push(startvertex);
                var strates = [];
                strates.push(markedVertex);
                var alreadySeen = new mathis.HashMap();
                var curentEdge = markedVertex;
                while (curentEdge.length > 0) {
                    curentEdge = mathis.graph.getEdge(curentEdge, alreadySeen);
                    strates.push(curentEdge);
                }
                /** parcours des strates **/
                for (var i_3 = 1; i_3 < strates.length; i_3++) {
                    for (var _d = 0, _e = strates[i_3]; _d < _e.length; _d++) {
                        var v = _e[_d];
                        /**pour tous les links du point **/
                        for (var _f = 0, _g = v.links; _f < _g.length; _f++) {
                            var l = _g[_f];
                            /**pour tous les points de la strate précédente **/
                            for (var _h = 0, _j = strates[i_3 - 1]; _h < _j.length; _h++) {
                                var p = _j[_h];
                                /** s'ils sont adjacents **/
                                if (l.to == p) {
                                    /** si normale nulle, prend la normale précédente **/
                                    if (vertexToNormal.getValue(v).x == 0 && vertexToNormal.getValue(v).y == 0 && vertexToNormal.getValue(v).z == 0) {
                                        var newNormale0 = new XYZ(vertexToNormal.getValue(p).x, vertexToNormal.getValue(p).y, vertexToNormal.getValue(p).z);
                                        vertexToNormal.putValue(v, newNormale0);
                                    } //fnormale_nulle
                                    /** inverser la normale si le dot product entre les normales est négatif **/
                                    if (BABYLON.Vector3.Dot(vertexToNormal.getValue(p), vertexToNormal.getValue(v)) < 0) {
                                        var newNormale = new XYZ(-vertexToNormal.getValue(v).x, -vertexToNormal.getValue(v).y, -vertexToNormal.getValue(v).z);
                                        vertexToNormal.putValue(v, newNormale);
                                    } //finversion
                                } //flink<>p
                            } //fstrate-1
                        } //flinks
                    } //fvertex
                } //fstrats
                /** detection de polygones **/
                var tab_polys = [];
                var dejaParcours = new StringMap();
                /** creation d'un tableau de liens **/
                var tablinks = [];
                for (var _k = 0, _l = this.mamesh.vertices; _k < _l.length; _k++) {
                    var v = _l[_k];
                    for (var _m = 0, _o = v.links; _m < _o.length; _m++) {
                        var l = _o[_m];
                        /** initialisation dejaParcours, tous les liens à faux**/
                        dejaParcours.putValue(v.hashNumber + "," + l.to.hashNumber, false);
                        var elemlink = [v, l.to];
                        tablinks.push(elemlink);
                    }
                }
                /** pour chaque link **/
                for (var _p = 0, tablinks_1 = tablinks; _p < tablinks_1.length; _p++) {
                    var lk = tablinks_1[_p];
                    /** initialisation vecteur et lien de depart **/
                    var first_point = lk[0];
                    var v_previous = lk[0];
                    var v_current = lk[1];
                    /** si le lien de depart est déjà parcouru, on le zap **/
                    if (dejaParcours.getValue(v_previous.hashNumber + "," + v_current.hashNumber) != true) {
                        /** detection d'un premier polygone **/
                        var current_poly = [v_current];
                        /** while experimental, sur k < n étapes max **/
                        var vloop = true;
                        while (vloop) {
                            /** initialisation du minimum **/
                            var anglemin = 6.4;
                            var l_pretend = v_previous.links[0];
                            /** pour chaque lien du vertex **/
                            for (var _q = 0, _r = v_current.links; _q < _r.length; _q++) {
                                var l_concur = _r[_q];
                                /** on omet le lien de départ et les liens déjà parcourus**/
                                if (l_concur.to != v_previous && dejaParcours.getValue(v_current.hashNumber + "," + l_concur.to.hashNumber) != true) {
                                    var vector_l_previous = new XYZ(v_previous.param.x - v_current.param.x, v_previous.param.y - v_current.param.y, v_previous.param.z - v_current.param.z);
                                    var vector_l_next = new XYZ(l_concur.to.param.x - v_current.param.x, l_concur.to.param.y - v_current.param.y, l_concur.to.param.z - v_current.param.z);
                                    /** calcul de l'angle **/
                                    var newangle = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vector_l_previous, vector_l_next, vertexToNormal.getValue(v_previous));
                                    /** valeur absolue **/
                                    if (newangle < 0)
                                        newangle = (6.2831853072 + newangle);
                                    /** retient le nouvel angle et nouveau lien **/
                                    if (newangle < anglemin) {
                                        anglemin = newangle;
                                        l_pretend = l_concur;
                                    }
                                }
                            }
                            /** ajout du nouveau point dans le polygone **/
                            current_poly.push(l_pretend.to);
                            /** marquer le lien comme étant deja parcouru **/
                            dejaParcours.putValue(v_current.hashNumber + "," + l_pretend.to.hashNumber, true);
                            /** on passe au nouveau point **/
                            v_previous = v_current;
                            v_current = l_pretend.to;
                            /** on retombe sur le premier point, fin de detection du polygone **/
                            if (v_current == first_point) {
                                /** break **/
                                vloop = false;
                            }
                        }
                        /** ajout d'un nouveau polygone dans la table **/
                        tab_polys.push(current_poly);
                    }
                }
                /** calcul des aires **/
                var tabSurface = [];
                /** stoker la valeur de centre de polygone à plus de 4 sommets **/
                var PolygoIndexToVertexCenter = [];
                var oneOverLength = 0;
                var polyIndex = -1;
                for (var _s = 0, tab_polys_1 = tab_polys; _s < tab_polys_1.length; _s++) {
                    var p = tab_polys_1[_s];
                    polyIndex++;
                    /** surface à 3 sommets **/
                    if (p.length == 3) {
                        var distA = geo.distance(p[0].param, p[1].param);
                        var distB = geo.distance(p[0].param, p[2].param);
                        var distC = geo.distance(p[1].param, p[2].param);
                        /** calcul d'aire d'après la formule de Héron **/
                        var heronP = (distA + distB + distC) / 2;
                        var surface = Math.sqrt(heronP * (heronP - distA) * (heronP - distB) * (heronP - distC));
                        tabSurface.push(surface);
                    }
                    else if (p.length == 4) {
                        var distA = geo.distance(p[0].param, p[1].param);
                        var distB = geo.distance(p[1].param, p[2].param);
                        var distC = geo.distance(p[2].param, p[3].param);
                        var distD = geo.distance(p[3].param, p[0].param);
                        var distE = geo.distance(p[0].param, p[2].param);
                        /** calcul d'aire d'après la formule de Héron **/
                        var heronP1 = (distA + distB + distE) / 2;
                        var surface1 = Math.sqrt(heronP1 * (heronP1 - distA) * (heronP1 - distB) * (heronP1 - distE));
                        var heronP2 = (distC + distD + distE) / 2;
                        var surface2 = Math.sqrt(heronP2 * (heronP2 - distC) * (heronP2 - distD) * (heronP2 - distE));
                        tabSurface.push(surface1 + surface2);
                    }
                    else if (p.length >= 5) {
                        var centerVertex = new mathis.Vertex().setPosition(0, 0, 0);
                        /** Initialization **/
                        oneOverLength = 1 / (p.length);
                        var tab1 = [p[0].position];
                        var tab2 = [oneOverLength];
                        /** For each face **/
                        for (var _t = 0, p_1 = p; _t < p_1.length; _t++) {
                            var v = p_1[_t];
                            tab1.push(v.position);
                            tab2.push(oneOverLength);
                        }
                        geo.baryCenter(tab1, tab2, centerVertex.param);
                        var centerVertex2 = new mathis.Vertex().setPosition(centerVertex.param.x, centerVertex.param.y, centerVertex.param.z);
                        var surface3 = 0;
                        for (var i_4 = 0; i_4 < p.length; i_4++) {
                            /** calcul d'aire d'après la formule de Héron **/
                            var distA = geo.distance(p[i_4].param, p[(i_4 + 1) % (p.length)].param);
                            var distB = geo.distance(p[(i_4 + 1) % (p.length)].param, centerVertex2.param);
                            var distC = geo.distance(centerVertex2.param, p[i_4].param);
                            var heronP3 = (distA + distB + distC) / 2;
                            surface3 = surface3 + Math.sqrt(heronP3 * (heronP3 - distA) * (heronP3 - distB) * (heronP3 - distC));
                        }
                        tabSurface.push(surface3);
                        /** on stock la valeur du centre de gravité dui polygone pour éviter de la recalculer après **/
                        PolygoIndexToVertexCenter[polyIndex] = centerVertex2;
                    }
                }
                /** suppresison de nb faces les plus grandes **/
                for (var n = 0; n < this.nbBiggerFacesDeleted; n++) {
                    /** trouver la surface la plus grande pour la supprimer (fait la totalité de la figure) **/
                    var maxSurf = -1;
                    var numSurf = -1;
                    /** si le polygone n'a qu'une seule surface on ne va pas s'amuser à l'enlever **/
                    //if (tabSurface.length != 1)
                    // if (tabSurface.length >= nbBiggerFacesDeleted) {
                    if (true) {
                        /** calcul de la surface maximum **/
                        for (var i_5 = 0; i_5 < tabSurface.length; i_5++) {
                            if (tabSurface[i_5] > maxSurf) {
                                maxSurf = tabSurface[i_5];
                                numSurf = i_5;
                            }
                        }
                        tabSurface[numSurf] = -1;
                        tab_polys[numSurf] = [];
                    }
                }
                /** affichage des polygones **/
                var indexSurface = -1;
                for (var _u = 0, tab_polys_2 = tab_polys; _u < tab_polys_2.length; _u++) {
                    var p = tab_polys_2[_u];
                    indexSurface++;
                    /** surface à 3 sommets **/
                    if (p.length == 3) {
                        this.mamesh.addATriangle(p[0], p[1], p[2]);
                    }
                    else if (p.length == 4) {
                        this.mamesh.addASquare(p[0], p[1], p[2], p[3]);
                    }
                    else if (p.length >= 5) {
                        var centerVertex2 = PolygoIndexToVertexCenter[indexSurface];
                        centerVertex2.markers.push(Vertex.Markers.polygonCenter);
                        this.mamesh.vertices.push(centerVertex2);
                        for (var i_6 = 0; i_6 < p.length; i_6++) {
                            this.mamesh.addATriangle(p[i_6], p[(i_6 + 1) % (p.length)], centerVertex2);
                            p[i_6].setOneLink(centerVertex2);
                            centerVertex2.setOneLink(p[i_6]);
                        }
                    }
                }
                return this.mamesh;
            };
            return SurfaceConnectionProcess;
        }());
        surfaceConnection.SurfaceConnectionProcess = SurfaceConnectionProcess;
    })(surfaceConnection = mathis.surfaceConnection || (mathis.surfaceConnection = {}));
})(mathis || (mathis = {}));
