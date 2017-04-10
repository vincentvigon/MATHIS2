module mathis{
    
    
    export module fractal{


        export class StableRandomFractal{

            mamesh:Mamesh
            
            referenceDistanceBetweenVertexWithZeroDichoLevel=0.1
            
            
            deformationFromCenterVersusFromDirection=true
            center=new XYZ(0,0,0)
            direction=new XYZ(0,0,1)
            
            private simuStable:proba.StableLaw
 
            alpha=1.7
            beta=0.7
            
            seed=22345
            
            constructor(mamesh:Mamesh){
                this.mamesh=mamesh
                
            }

            go(){
                
                this.simuStable=new proba.StableLaw()
                this.simuStable.alpha=this.alpha
                this.simuStable.beta=this.beta
                this.simuStable.nbSimu=this.mamesh.vertices.length
                
                let generator=new proba.Random(this.seed)
                this.simuStable.basicGenerator=()=>generator.pseudoRand()
                let X=this.simuStable.go()

                let someThinerDichoLevels=true
                let randomCount=0
                let currentDichoLevel=0

                let newPosition=new XYZ(0,0,0)
                let temp=new XYZ(0,0,0)
                
                while (someThinerDichoLevels){

                    someThinerDichoLevels=false
                    for (let key in this.mamesh.cutSegmentsDico){
                        let segment:Segment=this.mamesh.cutSegmentsDico[key]

                        if (Math.max(segment.a.dichoLevel,segment.b.dichoLevel)==currentDichoLevel){
                            someThinerDichoLevels=true
                            let modif=X[randomCount++]*Math.pow(this.referenceDistanceBetweenVertexWithZeroDichoLevel/Math.pow(2,currentDichoLevel),1/this.simuStable.alpha)

                            geo.between(segment.a.position, segment.b.position, 1 / 2, newPosition)
                            if (this.deformationFromCenterVersusFromDirection) {
                                newPosition.substract(this.center)
                                newPosition.scale(1 + modif)
                            }
                            else{
                                temp.copyFrom(this.direction).scale(modif)
                                newPosition.add(temp)
                            }
                            segment.middle.position.copyFrom(newPosition)
                        }
                    }
                    currentDichoLevel++

                }


            }


        }

        

    }
    
    
}
