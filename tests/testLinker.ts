/**
 * Created by vigon on 25/02/2016.
 */


module mathis {



    export module creationFlat {

        export class SingleSquareWithOneDiag {
            makeLinks = true

            markCorners = true
            addALoopLineAround = false

            mamesh:Mamesh

            constructor(mamesh:Mamesh) {
                this.mamesh = mamesh
            }


            go():void {

                let vert0 = this.mamesh.newVertex(new XYZ(0, 0, 0))

                let vert1 = this.mamesh.newVertex(new XYZ(1, 0, 0))

                let vert2 = this.mamesh.newVertex(new XYZ(1, 1, 0))

                let vert3 = this.mamesh.newVertex(new XYZ(0, 1, 0))


                //let triangulatedRect=new Polygone([vert1,vert2,vert3])
                //this.IN_mamesh.polygones.push(triangulatedRect)

                this.mamesh.addATriangle(vert0, vert1, vert3)
                this.mamesh.addATriangle(vert1, vert2, vert3)

                if (this.markCorners) {
                    vert0.markers.push(Vertex.Markers.corner)
                    vert1.markers.push(Vertex.Markers.corner)
                    vert2.markers.push(Vertex.Markers.corner)
                    vert3.markers.push(Vertex.Markers.corner)
                }

                if (this.makeLinks) {

                    vert1.setOneLink(vert3)
                    vert3.setOneLink(vert1)


                    if (!this.addALoopLineAround) {
                        vert0.setOneLink(vert1)
                        vert0.setOneLink(vert3)

                        vert1.setOneLink(vert0)
                        vert1.setOneLink(vert2)

                        vert2.setOneLink(vert1)
                        vert2.setOneLink(vert3)

                        vert3.setOneLink(vert0)
                        vert3.setOneLink(vert2)
                    }
                    else {
                        vert0.setTwoOppositeLinks(vert1, vert3)
                        vert1.setTwoOppositeLinks(vert2, vert0)
                        vert2.setTwoOppositeLinks(vert3, vert1)
                        vert3.setTwoOppositeLinks(vert0, vert2)
                    }

                    //this.mamesh.linksOK = true
                }
                //else this.mamesh.linksOK = false

            }
        }


        export class SingleSquareWithTwoDiag {
            makeLinks = true

            markCorners = true
            addALoopLineAround = false

            mamesh:Mamesh

            constructor(mamesh:Mamesh) {
                this.mamesh = mamesh
            }


            go():void {

                let vert0 = this.mamesh.newVertex(new XYZ(0, 0, 0))

                let vert1 = this.mamesh.newVertex(new XYZ(1, 0, 0))

                let vert2 = this.mamesh.newVertex(new XYZ(1, 1, 0))

                let vert3 = this.mamesh.newVertex(new XYZ(0, 1, 0))

                let vert4 = this.mamesh.newVertex(new XYZ(0.5, 0.5, 0))


                //let triangulatedRect=new Polygone([vert1,vert2,vert3])
                //this.IN_mamesh.polygones.push(triangulatedRect)

                this.mamesh.addATriangle(vert0, vert1, vert4)
                this.mamesh.addATriangle(vert1, vert2, vert4)
                this.mamesh.addATriangle(vert2, vert3, vert4)
                this.mamesh.addATriangle(vert4, vert3, vert0)

                if (this.markCorners) {
                    vert0.markers.push(Vertex.Markers.corner)
                    vert1.markers.push(Vertex.Markers.corner)
                    vert2.markers.push(Vertex.Markers.corner)
                    vert3.markers.push(Vertex.Markers.corner)

                }

                if (this.makeLinks) {

                    vert0.setOneLink(vert4)
                    vert1.setOneLink(vert4)
                    vert2.setOneLink(vert4)
                    vert3.setOneLink(vert4)
                    vert4.setTwoOppositeLinks(vert0, vert2)
                    vert4.setTwoOppositeLinks(vert1, vert3)

                    if (!this.addALoopLineAround) {
                        vert0.setOneLink(vert1)
                        vert0.setOneLink(vert3)

                        vert1.setOneLink(vert0)
                        vert1.setOneLink(vert2)


                        vert2.setOneLink(vert1)
                        vert2.setOneLink(vert3)


                        vert3.setOneLink(vert0)
                        vert3.setOneLink(vert2)
                    }
                    else {
                        vert0.setTwoOppositeLinks(vert1, vert3)
                        vert1.setTwoOppositeLinks(vert2, vert0)
                        vert2.setTwoOppositeLinks(vert3, vert1)
                        vert3.setTwoOppositeLinks(vert0, vert2)
                    }

                    //this.mamesh.linksOK = true
                }
                //else this.mamesh.linksOK = false

            }
        }

        export class SingleSquare {
            makeLinks = true

            markCorners = true
            addALoopLineAround = false

            mamesh:Mamesh

            constructor(mamesh:Mamesh) {
                this.mamesh = mamesh
            }


            go():void {

                let vert0 = this.mamesh.newVertex(new XYZ(0, 0, 0))

                let vert1 = this.mamesh.newVertex(new XYZ(1, 0, 0))

                let vert2 = this.mamesh.newVertex(new XYZ(1, 1, 0))

                let vert3 = this.mamesh.newVertex(new XYZ(0, 1, 0))


                //let triangulatedRect=new Polygone([vert1,vert2,vert3])
                //this.IN_mamesh.polygones.push(triangulatedRect)

                this.mamesh.addASquare(vert0, vert1, vert2, vert3)

                if (this.markCorners) {
                    vert0.markers.push(Vertex.Markers.corner)
                    vert1.markers.push(Vertex.Markers.corner)
                    vert2.markers.push(Vertex.Markers.corner)
                    vert3.markers.push(Vertex.Markers.corner)

                }

                if (this.makeLinks) {
                    if (!this.addALoopLineAround) {
                        vert0.setOneLink(vert1)
                        vert1.setOneLink(vert2)
                        vert2.setOneLink(vert3)
                        vert3.setOneLink(vert0)

                        vert0.setOneLink(vert3)
                        vert3.setOneLink(vert2)
                        vert2.setOneLink(vert1)
                        vert1.setOneLink(vert0)
                    }
                    else {
                        vert0.setTwoOppositeLinks(vert1, vert3)
                        vert1.setTwoOppositeLinks(vert2, vert0)
                        vert2.setTwoOppositeLinks(vert3, vert1)
                        vert3.setTwoOppositeLinks(vert0, vert2)

                    }
                    //this.mamesh.linksOK = true
                }
                //else this.mamesh.linksOK = false

            }

        }
    }



    export function linkerTest():Bilan {


        let bilan = new Bilan()
        
        {
            
            let creator=new reseau.Regular2d()
            let mamesh=creator.go()
            
            let linker=new linkModule.SimpleLinkFromPolygonCreator(mamesh)
            linker.goChanging()
            mamesh.fillLineCatalogue()
            
            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,1]","[0,3]","[1,2]","[1,4]","[2,5]","[3,4]","[3,6]","[4,5]","[4,7]","[5,8]","[6,7]","[7,8]"]')

        }

        {

            let creator=new reseau.Regular2d()
            creator.squareVersusTriangleMaille=false
            let mamesh=creator.go()

            let linker=new linkModule.SimpleLinkFromPolygonCreator(mamesh)
            linker.goChanging()
            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,1]","[0,3]","[0,4]","[1,2]","[1,4]","[2,4]","[2,5]","[3,4]","[3,6]","[3,7]","[4,5]","[4,7]","[5,7]","[5,8]","[6,7]","[7,8]"]')


        }


        

        {
            let mamesh=new Mamesh()
            let single=new creationFlat.SingleSquare(mamesh)
            single.makeLinks=false
            single.go()
            new mameshModification.SquareDichotomer(mamesh).go()
            new linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh).goChanging()

            mamesh.clearOppositeInLinks()
            new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices).goChanging()

            mathis.debug.checkTheRegularityOfAGraph(mamesh.vertices)


        }


        {
            
            let generator=new reseau.BasisForRegularReseau()
            generator.nbVerticalDecays=1
            generator.nbHorizontalDecays=1
            generator.nbI=4
            generator.nbJ=4
            let VV=generator.go()
            
            let meshMaker = new reseau.Regular2d()
            meshMaker.makeLinks=true
            meshMaker.nbI=4
            meshMaker.nbJ=4
            meshMaker.Vi=VV.Vi
            meshMaker.Vj=VV.Vj
            let mamesh =meshMaker.go()

            mamesh.clearOppositeInLinks()

            let oppositeLinkAssocier=new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
            /**un angle trop grand associe les angles*/
            oppositeLinkAssocier.maxAngleToAssociateLinks=Math.PI/6
            oppositeLinkAssocier.goChanging()
            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,1,2,3]","[0,4,8,12]","[1,5,9,13]","[12,13,14,15]","[2,6,10,14]","[3,7,11,15]","[4,5,6,7]","[8,9,10,11]"]')

            mathis.debug.checkTheRegularityOfAGraph(mamesh.vertices)


        }

        {
            
            
            function torusDecayBySquare(nbX,nbY,nbVerticalDecays,nbHorizontalDecays):string {


                let generator=new reseau.BasisForRegularReseau()
                generator.nbI=nbX
                generator.nbJ=nbY
                generator.end=new XYZ(2*Math.PI,2*Math.PI,0)
                generator.nbVerticalDecays=nbVerticalDecays
                generator.nbHorizontalDecays=nbHorizontalDecays
                let VV=generator.go()
                
                
                let r=0.8
                let a=2
                let meshMaker = new reseau.Regular2d()
                meshMaker.makeLinks=false
                meshMaker.nbI=nbX
                meshMaker.nbJ=nbY
                meshMaker.Vi=VV.Vi
                meshMaker.Vj=VV.Vj
                let mamesh2 =meshMaker.go()


                mamesh2.vertices.forEach((vertex:Vertex)=>{

                    let u=vertex.position.x
                    let v=vertex.position.y

                    vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
                    vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
                    vertex.position.z=r*Math.sin(u)

                })



                mamesh2.clearLinksAndLines()


                let merger=new grateAndGlue.Merger(mamesh2,null,null)
                //merger.cleanDoubleLinks=false
                merger.mergeLink=false
                merger.goChanging()



                let linkFromPoly=new linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh2)
                linkFromPoly.forceOppositeLinksAtCorners=true
                linkFromPoly.goChanging()

                mamesh2.fillLineCatalogue()

                //cc('mamesh2',mamesh2.toString())
                return mamesh2.allLinesAsASortedString()
            }

            function torusDecayByLinks(nbX, nbY,nbVerticalDecays,nbHorizontalDecays,angleToAssociateOpposite):string {

                let generator=new reseau.BasisForRegularReseau()
                generator.nbI=nbX
                generator.nbJ=nbY
                generator.end=new XYZ(2*Math.PI,2*Math.PI,0)
                generator.nbVerticalDecays=nbVerticalDecays
                generator.nbHorizontalDecays=nbHorizontalDecays
                let VV=generator.go()
                
                
                let r=0.8
                let a=2

                let meshMaker = new reseau.Regular2d()
                meshMaker.makeLinks=true
                meshMaker.nbI=nbX
                meshMaker.nbJ=nbY
                meshMaker.Vi=VV.Vi
                meshMaker.Vj=VV.Vj
                let mamesh =meshMaker.go()


                mamesh.vertices.forEach((vertex:Vertex)=>{

                    let u=vertex.position.x
                    let v=vertex.position.y

                    vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
                    vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
                    vertex.position.z=r*Math.sin(u)

                })


                let merger=new grateAndGlue.Merger(mamesh,null,null)
                //merger.cleanDoubleLinks=true
                merger.mergeLink=true
                merger.goChanging()

                //new linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(IN_mamesh).goChanging()
                let oppositeAssocier=new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
                oppositeAssocier.maxAngleToAssociateLinks=angleToAssociateOpposite
                oppositeAssocier.goChanging()

                mamesh.fillLineCatalogue()

                return mamesh.allLinesAsASortedString()

            }

            /**with small nbX, nbY, we must accept large angle between opposites because the torus is very un-smooth*/
            //TODO ces tests ne marche plus depuis la modification du merger
            //  bilan.assertTrue(torusDecayByLinks(4,4,1,1,Math.PI)==torusDecayBySquare(4,4,1,1))
            //  bilan.assertTrue(torusDecayByLinks(6,6,1,1,Math.PI/2)==torusDecayBySquare(6,6,1,1))
            //  bilan.assertTrue(torusDecayByLinks(9,9,2,1,Math.PI/3)==torusDecayBySquare(9,9,2,1))
            // bilan.assertTrue(torusDecayByLinks(11,9,2,3,Math.PI/3)==torusDecayBySquare(11,9,2,3))


        }
        
        /**we test that exterior vertex are not taken in count when we use {@link LineComputer.computeAllLinesVersusInnerLines}==false */
        {
            let mamesh=new Mamesh()
            let v0=mamesh.newVertex(new XYZ(1,0,0))
            //IN_mamesh.paramToVertex.putValue(v0.param,v0)
            
            let v1=mamesh.newVertex(new XYZ(2,0,0))
            //IN_mamesh.paramToVertex.putValue(v1.param,v1)

            v0.setOneLink(v1)
            v1.setOneLink(v0)

            //mamesh.linksOK=true

            let v2=new Vertex()
            v2.param=new XYZ(1,2,3)
            

            v2.setOneLink(v1)
            v1.setOneLink(v2)


            let lineMaker=new lineModule.LineComputer(mamesh)
            lineMaker.restrictLinesToTheseVertices=mamesh.vertices
            lineMaker.go()


            bilan.assertTrue(mamesh.getStraightLines().length==1)

            

        }



        return bilan
    }
}