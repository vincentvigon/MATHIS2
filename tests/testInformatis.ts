/**
 * Created by vigon on 18/12/2015.
 */




module mathis{


    import VertexData = BABYLON.VertexData;
    class CanEat {
        public eat():string {
            return 'miam'
        }
    }

    class CanSleep {
        age:number

        sleep():string {
            return 'ZZZ'
        }
    }

    function applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }

    class Being implements CanEat, CanSleep {
        age:number

        eat: () => string;
        sleep: () => string;

        static mixinsWasMade=false

        constructor(){
            if(!Being.mixinsWasMade) {
                applyMixins (Being, [CanEat, CanSleep]);
                Being.mixinsWasMade=true
            }

        }

    }



    export function informatisTest():Bilan {

        var bilan = new Bilan()

        logger.c('this a warning which test that warning are fired')



        

        {
            let v0=new Vertex()
            v0.position=new XYZ(1,2,3)
            let v1=new Vertex()
            v1.position=new XYZ(1,2,4)
            let v2=new Vertex()
            v2.position=new XYZ(1,2,5)
            let v3=new Vertex()
            v3.position=new XYZ(1,2,5.5)

            let line0=new Line([v0,v1,v2,v3],false)
            let line1=new Line([v3,v2,v1,v0],false)
            bilan.assertTrue(line0.hashString==line1.hashString)

            let line0loop=new Line([v0,v1,v2,v3],true)
            let line1loop=new Line([v0,v3,v2,v1],false)
            bilan.assertTrue(line0.hashString==line1.hashString)


            let v0a=new Vertex()
            v0a.position=new XYZ(1,2,3)
            let v1a=new Vertex()
            v1a.position=new XYZ(1,2,4)
            let v2a=new Vertex()
            v2a.position=new XYZ(1,2,5)
            let v3a=new Vertex()
            v3a.position=new XYZ(1,2,5.5)

            let line0a=new Line([v0a,v1a,v2a,v3a],false)
            bilan.assertTrue(line0a.hashString!=line1.hashString)
            bilan.assertTrue(line0a.positionnalHash()==line1.positionnalHash())


        }


        {

            let gene = new reseau.BasisForRegularReseau()
            gene.nbI = 2
            gene.nbJ = 2
            let crea = new reseau.Regular(gene)
            let mamesh = crea.go()
            mamesh.fillLineCatalogue()
            new spacialTransformations.Similitude(mamesh.vertices,Math.PI/4).goChanging()
            spacialTransformations.adjustInASquare(mamesh,new XYZ(0,0,0),new XYZ(1,1,0))


            let crea2 = new reseau.Regular(gene)
            let mamesh2 = crea2.go()
            mamesh2.fillLineCatalogue()
            new spacialTransformations.Similitude(mamesh2.vertices,Math.PI/2).goChanging()
            spacialTransformations.adjustInASquare(mamesh2,new XYZ(0,0,0),new XYZ(1,1,0))


            let hashSet2=new StringMap<boolean>()
            for (let line of mamesh2.lines.concat(mamesh2.lines)) {
                hashSet2.putValue(line.hashString,true)
            }
            bilan.assertTrue(hashSet2.allValues().length==4)


            let hashSet=new StringMap<boolean>()
            for (let line of mamesh.lines) hashSet.putValue(line.hashStringUpToSymmetries(symmetries.squareMainSymmetries,true),true)
            bilan.assertTrue(hashSet.allValues().length==1)

        }





        
        
        
        {
            /**ArrayMinusBlocksElements*/
            let vertex0=new Vertex()
            let vertex1=new Vertex()
            let vertex2=new Vertex()
            let vertex3=new Vertex()
            let vertexA=new Vertex()
            let vertexB=new Vertex()
            let vertexC=new Vertex()
            let vertexD=new Vertex()
            let longList=[vertex0,vertex1,vertex2,vertex3,vertexA,vertexB,vertexC,vertexD]
            let newLongList:Vertex[]=new tab.ArrayMinusBlocksElements<Vertex>(longList,4,[vertex2,vertex3,vertex0,vertex1]).go()
            bilan.assertTrue(newLongList[0].hashString==vertexA.hashString && newLongList[1].hashString==vertexB.hashString && newLongList[2].hashString==vertexC.hashString && newLongList[3].hashString==vertexD.hashString  )
        }

        
        
        var being = new Being();
        being.age=37
        bilan.assertTrue(being.age==37)
        bilan.assertTrue(being.sleep()=='ZZZ')
        bilan.assertTrue(being.eat()=='miam')
        
        {
            let dico=new HashMap<Vertex,string>()
        
            let vertex0=new Vertex()
            let vertex1=new Vertex()
            let vertex2=new Vertex()
        
            dico.putValue(vertex0,'vertex0')
            dico.putValue(vertex1,'vertex1')
            dico.putValue(vertex2,'vertex2')
            dico.putValue(vertex0,'vertex0bis')
        
            bilan.assertTrue(dico.getValue(vertex0)=='vertex0bis')
        
        }
        

        /**testing the deep copy of IN_mamesh
         * this test follow the evolution of toString, this is a good idea: so if class {@link Mamesh} change, we have to change the deepCopy
         * */
        {
        
            let mamCrea=new reseau.Regular()
            mamCrea.nbI=3
            mamCrea.nbJ=2
            mamCrea.makeLinks=false
            let mamesh=mamCrea.go()
        
            let dicho=new mameshModification.SquareDichotomer(mamesh)
            dicho.go()
        
            let linkCrea=new linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh).goChanging()
            mamesh.fillLineCatalogue()
        

            let mameshCopy=new mameshModification.MameshDeepCopier(mamesh).go()
        
            bilan.assertTrue(mamesh.toString()==mameshCopy.toString())
        
        
        
        }
        
        /**test adding dynamicaly a new property to an object*/
        {
        
        
            var vertexData = new VertexData();
        
            /**alors ça, a quoi cela sert ???*/
                (<any>vertexData)._idx = 5;
        
        
            class AClass{
                aString='toto'
                aNumber=5
            }
        
            let anObject=new AClass()
        
            anObject.aString='mqlskdj'
        
            {
                (<any>anObject).newPro=5
            }
        
        
            bilan.assertTrue((<any>anObject).newPro==5)
        
        
        
        }





        return bilan
    }


}