/**
 * Created by Kieffer on 23/04/2017.
 */


module mathis {

    export module surfaceConnection {

        import getEdgeConsideringAlsoDiagonalVoisin = mathis.graph.getEdgeConsideringAlsoDiagonalVoisin;
        // export class SurfaceCorrectionProcess {
        //     mamesh: Mamesh;
        //
        //     constructor(mamesh: Mamesh) {
        //         this.mamesh = mamesh
        //     }
        //
        //     go(): Mamesh {
        //         let verticesDeleted = [];
        //         let verticesSaved = [];
        //
        //
        //         /** pour chaque point */
        //         //let v = mamesh.vertices[12];
        //         for (let v of this.mamesh.vertices)
        //         {
        //
        //             /** si le point n'a qu'un lien ou n'a pas de lien on le supprime directement **/
        //             if (v.links.length == 1 || v.links.length == 0)
        //             {
        //                 //console.log("Stop Vrai facile");
        //                 verticesDeleted.push(v);
        //             }
        //             /** sinon on parcours et on initalise tous les vertex à non-parcouru **/
        //             else
        //             {
        //                 let alreadySeen = new mathis.HashMap<Vertex,boolean>();
        //                 for (let vs of this.mamesh.vertices) alreadySeen.putValue(vs, false);
        //
        //                 let tab = [];
        //                 tab.push(v);
        //
        //                 let firstVertex = v;
        //                 let currentVertex = v;
        //                 let loopFlag = true;
        //                 let i=0;
        //
        //                 /** tant que **/
        //                 while(loopFlag && i < 80)
        //                 {
        //                     i++ ;
        //                     alreadySeen.putValue(currentVertex, true);
        //                     let ifExistFreeNeighbour = false;
        //                     let newCurrentVertex = currentVertex;
        //
        //                     /** pour chaque lien du point en cours **/
        //                     for (let l of currentVertex.links)
        //                     {
        //                         /** si il y a un voisin non visité **/
        //                         if (!alreadySeen.getValue(l.to))
        //                         {
        //                             ifExistFreeNeighbour = true;
        //                             newCurrentVertex = l.to;
        //                         }
        //
        //                         /** si on a un chemin vers le point de départ et que le point en cours n'est pas en 2e position dans le stack END FALSE **/
        //                         /** ne fonctionne pas à la première itération **/
        //                         if (l.to == firstVertex && tab.length > 1 && currentVertex != tab[1])
        //                         {
        //                             loopFlag = false;
        //
        //                             //console.log("Stop False");
        //                             verticesSaved.push(firstVertex);
        //                         }
        //                     }
        //
        //                     currentVertex = newCurrentVertex;
        //
        //                     /**  si tous les voisins ont été visités et que le point courant et celui de départ END TRUE**/
        //                     if (!ifExistFreeNeighbour && currentVertex == firstVertex)
        //                     {
        //                         /** arret de la boucle **/
        //                         loopFlag = false;
        //                         //console.log("Stop Vrai");
        //
        //                         verticesDeleted.push(firstVertex);
        //                     }
        //
        //                     /** si tous les voisins ont été visités **/
        //                     if (!ifExistFreeNeighbour)
        //                     {
        //                         // console.log("dépile");
        //                         /** dépile la pile **/
        //                         tab.pop();
        //
        //                         /** prend pour vertex en cours le vertex précédent dans la pile **/
        //                         currentVertex = tab[tab.length-1];
        //                     }
        //                     else
        //                     /** s'il y a un voisin de libre **/
        //                     {
        //                         /** empile **/
        //                         tab.push(currentVertex);
        //                     }
        //                 }
        //             }
        //         }
        //         for (let v of verticesDeleted)
        //         {
        //             for (let l of v.links) {
        //                 Vertex.separateTwoVoisins(v, l.to);
        //             }
        //         }
        //
        //         /** suppression des points inutiles **/
        //         for (let v of verticesDeleted) {
        //             tab.removeFromArray(this.mamesh.vertices, v);
        //         }
        //
        //         /** autre méthode possible: reconstruire la liste **/
        //         //tab.arrayMinusElements(mamesh.vertices, )
        //
        //         return this.mamesh;
        //     }
        // }

        export class SurfaceConnectionProcess {
            makeLinks = true;
            mamesh: Mamesh;
            nbBiggerFacesDeleted: number;
            areaVsPerimeter: boolean;

            constructor(mamesh: Mamesh, nbBiggerFacesDeleted: number, areaVsPerimeter: boolean) {
                this.mamesh = mamesh;
                this.nbBiggerFacesDeleted = nbBiggerFacesDeleted;
                this.areaVsPerimeter = areaVsPerimeter;
            }

            go(): Mamesh {

                console.log("------- DEBUT -------");
                console.log("### Correction des épines");

                /** suppression des épines **/
                for (let v of this.mamesh.vertices){

                    let loopflag = true;
                    let tip = v;

                    while (loopflag){
                        if (tip.links.length == 1)
                        {
                            let oldtip = tip;
                            tip = tip.links[0].to;
                            Vertex.separateTwoVoisins(oldtip, oldtip.links[0].to);
                            tab.removeFromArray(this.mamesh.vertices, oldtip);
                        }
                        else
                        {
                            loopflag = false;
                        }
                    }
                }

                /** suppression des isolés **/
                tab.arrayMinusElements(this.mamesh.vertices, (v)=> v.links.length==0);


                console.log("### Calcul des normales");

                /** *********************** **/
                /** Calcul des normales **/
                /** *********************** **/

                let tabRetenuVect1 = [];
                let tabRetenuVect2 = [];

                /** création de la HashMap **/
                let vertexToNormal=new HashMap<Vertex,XYZ>();
                let vertexToNumStrat=new HashMap<Vertex,number>();

                /** Calcul des produits scalaires. On parcourt chaque point **/
                for (let v of this.mamesh.vertices){

                    /** initialisation des variables */
                    let minscal = 0;
                    let instantDot;
                    let vectorTable = [];

                    /** ###### ETAPE 0 SUPPRESSION (ignorer) **/

                    /** on ne considèle que les vertex avec plus de 1 lien **/
                    if (v.links.length > 1) {

                        /** Pour chaque lien **/
                        for (let l of v.links) {

                            /** creation d'un vecteur à l'aide des coordonnés**/
                            let vect = new BABYLON.Vector3(0, 0, 0);
                            vect.x = l.to.param.x - v.param.x;
                            vect.y = l.to.param.y - v.param.y;
                            vect.z = l.to.param.z - v.param.z;
                            vect.normalize();

                            /** on récupère les vecteurs normalisés de chaque lien dans une table**/
                            vectorTable.push(vect);
                        } //ffor pour chaque lien


                        /** calcul du scalaire minimum : Initiatlisation **/
                        minscal = BABYLON.Vector3.Dot(vectorTable[0], vectorTable[1]);
                        if (minscal < 0) minscal *= -1; //valeur absolue
                        let vect1 = vectorTable[0];
                        let vect2 = vectorTable[1];

                        /** Double boucle pour chaque vecteur comparé à chaque autres vecteur (dot product)**/
                        for (let i = 0; i < vectorTable.length; i++) {
                            for (let j = i + 1; j < vectorTable.length; j++) {
                                instantDot = BABYLON.Vector3.Dot(vectorTable[i], vectorTable[j]);
                                if (instantDot < 0) instantDot *= -1; //valeur absolue

                                /** si on trouve une valeur plus petite **/
                                if (minscal > instantDot) {
                                    /** nouveau minimum **/
                                    minscal = instantDot;
                                    /** nouveaux vecteurs retenus pour le crossProduct **/
                                    vect1 = vectorTable[i];
                                    vect2 = vectorTable[j];
                                }

                            }
                        }
                        /** Tableaux où on stocke les vecteurs retenus (un pour tous les 1er vecteurs de tous les points, **/
                        /** un autre tous les 2eme vecteurs de tous les points) **/
                        // tabRetenuVect1.push(vect1);
                        // tabRetenuVect2.push(vect2);

                        /** calcul de la normale **/
                        let normale = BABYLON.Vector3.Cross(vect1, vect2);
                        normale.normalize();
                        vertexToNormal.putValue(v,new XYZ(normale.x,normale.y,normale.z));

                        vertexToNumStrat.putValue(v, -1)
                    }
                } //ffor pour chaque point




                /** ###### ETAPE 1 SUPPRESSION **/

                // /** suppression des vertex avec 1 lien **/
                // let deletedtab = [];
                // for (let v of this.mamesh.vertices){
                //     /** on ne considère que les vertex avec plus de 1 lien **/
                //     if (v.links.length < 2) {
                //         deletedtab.push(v);
                //         for (let l of v.links) {
                //             Vertex.separateTwoVoisins(v, l.to);
                //         }
                //     }
                // }
                //
                // for (let v of deletedtab) {
                //     tab.removeFromArray(this.mamesh.vertices, v);
                // }


                console.log("### Alignement des normales");

                /** *********************** **/
                /** Alignement des normales **/
                /** *********************** **/

                /** choix du vertex de départ **/
                let startvertex = this.mamesh.vertices[0];
                let i = 0;

                /** si normale nulle, prend un autre point **/
                while (i < this.mamesh.vertices.length -1 && vertexToNormal.getValue(startvertex).x == 0 && vertexToNormal.getValue(startvertex).y == 0 && vertexToNormal.getValue(startvertex).z == 0) {
                    startvertex = this.mamesh.vertices[i+1];
                    i++;
                } //todo: si tous les points de la figure ont une normale nulle, indiquer une erreur: figure invalide


                /** initatlisation des strates **/
                let markedVertex = [];
                markedVertex.push(startvertex);
                let strates = [];
                strates.push(markedVertex);
                let alreadySeen = new mathis.HashMap<Vertex,boolean>();

                let curentEdge = markedVertex;
                while (curentEdge.length > 0) {
                    curentEdge = mathis.graph.getEdge(curentEdge, alreadySeen);
                    strates.push(curentEdge);
                }
                /** parcours des strates **/
                for (let i = 1; i < strates.length; i++){
                    for (let v of strates[i]){
                        /**pour tous les links du point **/
                        for (let l of v.links){
                            /**pour tous les points de la strate précédente **/
                            for (let p of strates[i-1]){
                                /** s'ils sont adjacents **/
                                if(l.to == p){
                                    /** si normale nulle, prend la normale précédente **/
                                    if (vertexToNormal.getValue(v).x == 0 && vertexToNormal.getValue(v).y == 0 && vertexToNormal.getValue(v).z == 0)
                                    {
                                        let newNormale0 = new XYZ(vertexToNormal.getValue(p).x, vertexToNormal.getValue(p).y, vertexToNormal.getValue(p).z);
                                        vertexToNormal.putValue(v,newNormale0)
                                    } //fnormale_nulle

                                    /** inverser la normale si le dot product entre les normales est négatif **/
                                    if (BABYLON.Vector3.Dot(vertexToNormal.getValue(p), vertexToNormal.getValue(v)) < 0)
                                    {
                                        let newNormale = new XYZ(-vertexToNormal.getValue(v).x, -vertexToNormal.getValue(v).y, -vertexToNormal.getValue(v).z);
                                        vertexToNormal.putValue(v,newNormale)
                                    } //finversion
                                } //flink<>p
                            } //fstrate-1
                        } //flinks
                    } //fvertex
                } //fstrats

                // for (let v of this.mamesh.vertices)
                // {
                //     console.log(v.param);
                //     console.log(vertexToNormal.getValue(v));
                // }

                // console.log("### Normales");
                //
                // for (let v of this.mamesh.vertices)
                // {
                //     console.log("Normale:");
                //     console.log(vertexToNormal.getValue(v).x);
                //     console.log(vertexToNormal.getValue(v).y);
                //     console.log(vertexToNormal.getValue(v).z);
                // }

                console.log("### Détection de surfaces déjà remplies");

                /** ************************************ **/
                /** Détection de surfaces déjà remplies  **/
                /** ************************************ **/

                let dejaParcours = new StringMap<boolean>();

                for (let v of this.mamesh.vertices)
                {
                    for (let l of v.links)
                    {
                        /** initialisation dejaParcours, tous les liens à faux**/
                        dejaParcours.putValue(v.hashNumber + "," + l.to.hashNumber, false);
                    }
                }


                console.log(this.mamesh.smallestTriangles);
                console.log(this.mamesh.smallestSquares);

                /** triangles **/
                for (let i = 0; i < this.mamesh.smallestTriangles.length; i = i+3)
                {
                    let Firstneighbour = this.mamesh.smallestTriangles[i];
                    let Secondneighbour = this.mamesh.smallestTriangles[i+1];
                    let Thirdneighbour = this.mamesh.smallestTriangles[i+2];

                    // console.log(Firstneighbour);
                    // console.log(Secondneighbour);
                    // console.log(Thirdneighbour);

                    let normale = vertexToNormal.getValue(this.mamesh.smallestTriangles[i]);
                    let vect1 = new BABYLON.Vector3(0, 0, 0);
                    vect1.x = Firstneighbour.param.x - Secondneighbour.param.x;
                    vect1.y = Firstneighbour.param.y - Secondneighbour.param.y;
                    vect1.z = Firstneighbour.param.z - Secondneighbour.param.z;


                    let vect2 = new BABYLON.Vector3(0, 0, 0);
                    vect2.x = Firstneighbour.param.x - Thirdneighbour.param.x;
                    vect2.y = Firstneighbour.param.y - Thirdneighbour.param.y;
                    vect2.z = Firstneighbour.param.z - Thirdneighbour.param.z;


                    let valeur1 = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(new XYZ(vect1.x, vect1.y, vect1.z), new XYZ(vect2.x, vect2.y, vect2.z), normale);
                    let valeur2 = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(new XYZ(vect2.x, vect2.y, vect2.z), new XYZ(vect1.x, vect1.y, vect1.z), normale);
                    console.log(valeur1);
                    console.log(valeur2);

                    if (valeur1 < valeur2)
                    {
                        dejaParcours.putValue(Firstneighbour.hashNumber + "," + Secondneighbour.hashNumber, true);
                        dejaParcours.putValue(Secondneighbour.hashNumber + "," + Thirdneighbour.hashNumber, true);
                        dejaParcours.putValue(Thirdneighbour.hashNumber + "," + Firstneighbour.hashNumber, true);
                    }
                    else
                    {
                        dejaParcours.putValue(Firstneighbour.hashNumber + "," + Thirdneighbour.hashNumber, true);
                        dejaParcours.putValue(Thirdneighbour.hashNumber + "," + Secondneighbour.hashNumber, true);
                        dejaParcours.putValue(Secondneighbour.hashNumber + "," + Firstneighbour.hashNumber, true);
                    }
                }


                /** carrés **/
                for (let i = 0; i < this.mamesh.smallestSquares.length; i = i+4)
                {
                    let Firstneighbour = this.mamesh.smallestSquares[i];
                    let Secondneighbour = this.mamesh.smallestSquares[i+1];
                    let Thirdneighbour = this.mamesh.smallestSquares[i+2];
                    let Fourthneighbour = this.mamesh.smallestSquares[i+3];

                    console.log(Firstneighbour);
                    console.log(Secondneighbour);
                    console.log(Thirdneighbour);
                    console.log(Fourthneighbour);

                    let normale = vertexToNormal.getValue(this.mamesh.smallestSquares[i]);
                    let vect1 = new BABYLON.Vector3(0, 0, 0);
                    vect1.x = Firstneighbour.param.x - Secondneighbour.param.x;
                    vect1.y = Firstneighbour.param.y - Secondneighbour.param.y;
                    vect1.z = Firstneighbour.param.z - Secondneighbour.param.z;
                    console.log(vect1);

                    let vect2 = new BABYLON.Vector3(0, 0, 0);
                    vect2.x = Firstneighbour.param.x - Fourthneighbour.param.x;
                    vect2.y = Firstneighbour.param.y - Fourthneighbour.param.y;
                    vect2.z = Firstneighbour.param.z - Fourthneighbour.param.z;
                    console.log(vect2);

                    let valeur1 = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(new XYZ(vect1.x, vect1.y, vect1.z), new XYZ(vect2.x, vect2.y, vect2.z), normale);
                    let valeur2 = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(new XYZ(vect2.x, vect2.y, vect2.z), new XYZ(vect1.x, vect1.y, vect1.z), normale);
                    console.log(valeur1);
                    console.log(valeur2);

                    if (valeur1 < valeur2)
                    {
                        dejaParcours.putValue(Firstneighbour.hashNumber + "," + Secondneighbour.hashNumber, true);
                        dejaParcours.putValue(Secondneighbour.hashNumber + "," + Thirdneighbour.hashNumber, true);
                        dejaParcours.putValue(Thirdneighbour.hashNumber + "," + Fourthneighbour.hashNumber, true);
                        dejaParcours.putValue(Fourthneighbour.hashNumber + "," + Firstneighbour.hashNumber, true);
                    }
                    else
                    {
                        dejaParcours.putValue(Firstneighbour.hashNumber + "," + Fourthneighbour.hashNumber, true);
                        dejaParcours.putValue(Fourthneighbour.hashNumber + "," + Thirdneighbour.hashNumber, true);
                        dejaParcours.putValue(Thirdneighbour.hashNumber + "," + Secondneighbour.hashNumber, true);
                        dejaParcours.putValue(Secondneighbour.hashNumber + "," + Firstneighbour.hashNumber, true);
                    }
                }

                console.log("### Détection de polygones");

                /** *********************** **/
                /** Détection de polygones  **/
                /** *********************** **/

                let tablinkdelete = [];

                let tab_polys = [];

                /** creation d'un tableau de liens **/
                let tablinks = [];
                for (let v of this.mamesh.vertices)
                {
                    for (let l of v.links)
                    {
                        /** initialisation dejaParcours, tous les liens à faux**/
                        // dejaParcours.putValue(v.hashNumber + "," + l.to.hashNumber, false);
                        let elemlink = [v,l.to];
                        tablinks.push(elemlink)
                    }
                }

                /** pour chaque link **/
                for (let lk of tablinks) {

                    /** tableau de souvenir des liens parcourus **/
                    let traveledlinks = [];

                    /** initialisation vecteur et lien de depart **/
                    let first_point = lk[0];
                    let v_previous = lk[0];
                    let v_current = lk[1];

                    /** on se souvient du premier lien parcouru **/
                    let newlinkstart = [v_previous, v_current];
                    traveledlinks.push(newlinkstart);

                    /** si le lien de depart est déjà parcouru, on le zap **/
                    if (dejaParcours.getValue(v_previous.hashNumber + "," + v_current.hashNumber) != true)
                    {
                        /** detection d'un premier polygone **/
                        let current_poly = [v_current];

                        /** while experimental, sur k < n étapes max **/
                        let vloop = true;
                        while (vloop) {
                            /** initialisation du minimum **/
                            let anglemin = 6.4;
                            let l_pretend = v_previous.links[0];

                            /** pour chaque lien du vertex **/
                            for (let l_concur of v_current.links) {
                                /** on omet le lien de départ et les liens déjà parcourus**/
                                if (l_concur.to != v_previous && dejaParcours.getValue(v_current.hashNumber + "," + l_concur.to.hashNumber) != true) {
                                    let vector_l_previous = new XYZ(v_previous.param.x - v_current.param.x, v_previous.param.y - v_current.param.y, v_previous.param.z - v_current.param.z);
                                    let vector_l_next = new XYZ(l_concur.to.param.x - v_current.param.x, l_concur.to.param.y - v_current.param.y, l_concur.to.param.z - v_current.param.z);
                                    /** calcul de l'angle **/
                                    let newangle = geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vector_l_previous, vector_l_next, vertexToNormal.getValue(v_previous));
                                    /** valeur absolue **/
                                    if (newangle < 0) newangle = (6.2831853072 + newangle);

                                    /** retient le nouvel angle et nouveau lien **/
                                    if (newangle < anglemin) {
                                        anglemin = newangle;
                                        l_pretend = l_concur
                                    }
                                }
                            }

                            /** se souvenir du lien parcouru **/
                            let newlink = [v_current, l_pretend.to];

                            /** si l'opposé du lien est déjà parcouru pour ce polygone = anomalie, on doit le supprimer **/
                            let isdouble = false;
                            for (let l_in of traveledlinks) {
                                if (newlink[0] == l_in[1] && newlink[1] == l_in[0])
                                {
                                    isdouble = true;
                                }
                            }

                            if (isdouble)
                            {
                                tablinkdelete.push(newlink);
                            }
                            else
                            {
                                /** ajout du nouveau point dans le polygone et retient le lien parcouru**/
                                current_poly.push(l_pretend.to);
                                traveledlinks.push(newlink);
                            }

                            /** marquer le lien comme étant deja parcouru **/
                            dejaParcours.putValue(v_current.hashNumber + "," + l_pretend.to.hashNumber, true);

                            /** on passe au nouveau point **/
                            v_previous = v_current;
                            v_current = l_pretend.to;

                            /** on retombe sur le premier point, fin de detection du polygone **/
                            if (v_current == first_point) {
                                /** break **/
                                vloop = false
                            }
                        }
                        /** ajout d'un nouveau polygone dans la table **/
                        tab_polys.push(current_poly)
                    }
                }

                console.log("Polygones détéctés:");
                console.log(tab_polys);

                console.log("Liens à supprimer:");
                console.log(tablinkdelete);

                console.log("### Suppression des liens volants");

                /** ****************************** **/
                /** Suppression des liens volants  **/
                /** ****************************** **/

                for (let l of tablinkdelete) {
                    Vertex.separateTwoVoisins(l[0], l[1]);

                    if (l[0].links.length < 1)
                    {
                        /** suppression du tableau de polygone **/
                        for (let poly of tab_polys) {
                            for (let v of poly) {
                                if (v == l[0])
                                {
                                    tab.removeFromArray(poly, l[0]);
                                }

                            }
                        }
                        tab.removeFromArray(this.mamesh.vertices, l[0]);
                    }

                    if (l[1].links.length < 1)
                    {
                        /** suppression du tableau de polygone **/
                        for (let poly of tab_polys) {
                            for (let v of poly) {
                                if (v == l[1])
                                {
                                    tab.removeFromArray(poly, l[1]);
                                }

                            }
                        }
                        tab.removeFromArray(this.mamesh.vertices, l[1]);
                    }
                }

                console.log("### Calcul des aires");

                /** ***************** **/
                /** Calcul des aires  **/
                /** ***************** **/

                /** calcul des aires **/
                let tabSurface = [];

                /** stoker la valeur de centre de polygone à plus de 4 sommets **/
                let PolygoIndexToVertexCenter=[];

                let oneOverLength = 0;
                let polyIndex = -1;
                for (let p of tab_polys)
                {
                    polyIndex ++;
                    /** surface à 3 sommets **/
                    if (p.length == 3)
                    {
                        let distA = geo.distance(p[0].param, p[1].param);
                        let distB = geo.distance(p[0].param, p[2].param);
                        let distC = geo.distance(p[1].param, p[2].param);

                        /** aire **/
                        if (this.areaVsPerimeter)
                        {
                            /** calcul d'aire d'après la formule de Héron **/
                            let heronP = (distA + distB + distC) / 2;
                            let surface =  Math.sqrt(heronP * (heronP - distA) * (heronP - distB) * (heronP - distC));
                            tabSurface.push(surface)
                        }
                        /** perimetre **/
                        else
                        {
                            let perimetre = distA + distB + distC;
                            tabSurface.push(perimetre)
                        }
                    }
                    /** surface à 4 sommets **/
                    else if (p.length == 4)
                    {
                        let distA = geo.distance(p[0].param, p[1].param);
                        let distB = geo.distance(p[1].param, p[2].param);
                        let distC = geo.distance(p[2].param, p[3].param);
                        let distD = geo.distance(p[3].param, p[0].param);
                        let distE = geo.distance(p[0].param, p[2].param);

                        /** aire **/
                        if (this.areaVsPerimeter) {
                            /** calcul d'aire d'après la formule de Héron **/
                            let heronP1 = (distA + distB + distE) / 2;
                            let surface1 = Math.sqrt(heronP1 * (heronP1 - distA) * (heronP1 - distB) * (heronP1 - distE));
                            let heronP2 = (distC + distD + distE) / 2;
                            let surface2 = Math.sqrt(heronP2 * (heronP2 - distC) * (heronP2 - distD) * (heronP2 - distE));
                            tabSurface.push(surface1 + surface2)
                        }
                        /** perimetre **/
                        else
                        {
                            let perimetre = distA + distB + distC + distD;
                            tabSurface.push(perimetre)
                        }
                    }
                    /** surface a plus de 4 sommets **/
                    else if (p.length >= 5) {
                        let centerVertex = new mathis.Vertex().setPosition(0, 0, 0);

                        /** Initialization **/
                        oneOverLength = 1 / (p.length);
                        let tab1 = [p[0].position];
                        let tab2 = [oneOverLength];

                        /** For each face **/
                        for (let v of p) {
                            tab1.push(v.position);
                            tab2.push(oneOverLength)
                        }
                        geo.baryCenter(tab1, tab2, centerVertex.param);

                        let centerVertex2 = new mathis.Vertex().setPosition(centerVertex.param.x, centerVertex.param.y, centerVertex.param.z);

                        let surface3 = 0;
                        /** aire **/
                        if (this.areaVsPerimeter) {
                            for (let i = 0; i < p.length; i++) {
                                /** calcul d'aire d'après la formule de Héron **/
                                let distA = geo.distance(p[i].param, p[(i + 1) % (p.length)].param);
                                let distB = geo.distance(p[(i + 1) % (p.length)].param, centerVertex2.param);
                                let distC = geo.distance(centerVertex2.param, p[i].param);
                                let heronP3 = (distA + distB + distC) / 2;
                                surface3 = surface3 + Math.sqrt(heronP3 * (heronP3 - distA) * (heronP3 - distB) * (heronP3 - distC))
                            }
                        }
                        /** perimetre **/
                        else
                        {
                            for (let i = 0; i < p.length; i++) {
                                let distA = geo.distance(p[i].param, p[(i + 1) % (p.length)].param);
                                surface3 = surface3 + distA;
                            }
                        }

                        tabSurface.push(surface3);
                        /** on stock la valeur du centre de gravité dui polygone pour éviter de la recalculer après **/
                        PolygoIndexToVertexCenter[polyIndex] = centerVertex2
                    }
                }


                console.log("### Suppresison de nb faces les plus grandes");

                /** ***************************************** **/
                /** Suppresison de nb faces les plus grandes  **/
                /** ***************************************** **/

                /** suppresison de nb faces les plus grandes **/
                for (let n = 0; n < this.nbBiggerFacesDeleted; n++) {

                    /** trouver la surface la plus grande pour la supprimer (fait la totalité de la figure) **/
                    let maxSurf = -1;
                    let numSurf = -1;

                    /** si le polygone n'a qu'une seule surface on ne va pas s'amuser à l'enlever **/

                    /** calcul de la surface maximum **/
                    for (let i = 0; i < tabSurface.length; i++) {
                        if (tabSurface[i] > maxSurf) {
                            maxSurf = tabSurface[i];
                            numSurf = i;
                        }
                    }
                    tabSurface[numSurf] = -1;
                    tab_polys[numSurf] = [];

                }

                console.log("### Remplisage de surfaces");

                /** ************************ **/
                /** Remplisage de surfaces  **/
                /** ************************ **/

                /** affichage des polygones **/
                let indexSurface = -1;

                for (let p of tab_polys)
                {
                    indexSurface ++;
                    /** surface à 3 sommets **/
                    if (p.length == 3)
                    {
                        this.mamesh.addATriangle(p[0], p[1], p[2])
                    }
                    /** surface à 4 sommets **/
                    else if (p.length == 4)
                    {
                        this.mamesh.addASquare(p[0], p[1], p[2], p[3])
                    }
                    /** surface a plus de 4 sommets **/
                    else if (p.length >= 5)
                    {
                        let centerVertex2 = PolygoIndexToVertexCenter[indexSurface];
                        centerVertex2.markers.push(Vertex.Markers.polygonCenter);
                        this.mamesh.vertices.push(centerVertex2);

                        for (let i = 0; i < p.length; i++)
                        {
                            this.mamesh.addATriangle(p[i], p[(i + 1) % (p.length)], centerVertex2);
                            p[i].setOneLink(centerVertex2);
                            centerVertex2.setOneLink(p[i])
                        }
                    }
                }

                console.log("------- FIN -------");
                return this.mamesh
            }
        }
    }
}