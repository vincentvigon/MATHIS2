/**
 * Created by vigon on 25/04/2016.
 */

module mathis{
    
    
    export module symmetries{


        export var squareMainSymmetries=[ (a:XYZ)=>new XYZ(1-a.x,a.y,a.z),(a:XYZ)=>new XYZ(a.x,1-a.y,a.z),(a:XYZ)=>new XYZ(1-a.x,1-a.y,a.z)]//,(a:XYZ)=>new XYZ(a.y,a.x,a.z),(a:XYZ)=>new XYZ(1-a.y,1-a.x,a.z)  ]
        
        export module keyWords{
            export var verticalAxis='symI'
            export var horizontalAxis='symJ'
            export var slashAxis='symIJ'
            export var rotation='rotation'
        }


        export function cartesian(nbI:number,nbJ:number,oneMoreVertexForOddLine=false):StringMap<(param:XYZ)=>XYZ>{


            let symmetries=new StringMap<(param:XYZ)=>XYZ>()

            symmetries.putValue(keyWords.verticalAxis,(v:XYZ)=>{
                let hereNbI=nbI
                if (v.y % 2 == 1 && oneMoreVertexForOddLine) hereNbI++;
                return new XYZ(hereNbI - 1 - v.x, v.y, v.z)
            })
            symmetries.putValue(keyWords.horizontalAxis,(v:XYZ)=>{
                return new XYZ(v.x , nbJ - 1 - v.y, v.z)
            })
            symmetries.putValue(keyWords.slashAxis,(v:XYZ)=>{

                let hereNbI=nbI
                if (v.y % 2 == 1 && oneMoreVertexForOddLine) hereNbI++;
                return new XYZ(hereNbI - 1 - v.x, nbJ - 1 - v.y, v.z)
            })

            return symmetries
        }

        export function cartesianAsArray(nbI:number,nbJ:number,oneMoreVertexForOddLine=false):((param:XYZ)=>XYZ)[]{
            let symDic=cartesian(nbI,nbJ,oneMoreVertexForOddLine)
            let res=[]
            for (let sym of symDic.allValues()) res.push(sym)
            return res
        }





        export function polygonRotations(nbSides:number):StringMap<(param:XYZ)=>XYZ>{

            let symmetries=new StringMap<(param:XYZ)=>XYZ>()

            for(let t=1;t<nbSides;t++){
                let angle=Math.PI*2/nbSides*t
                symmetries.putValue(keyWords.rotation+t,(param:XYZ)=>{
                    let res=new XYZ(0,0,0)
                    res.x=param.x*Math.cos(angle)-param.y*Math.sin(angle)
                    res.y=param.x*Math.sin(angle)+param.y*Math.cos(angle)
                    res.z=param.z
                    return res
                })
            }
            return symmetries
        }
        
        
        export function getAllPolygonalRotations(nbSides:number):((param:XYZ)=>XYZ)[]{
            
            let symMap=polygonRotations(nbSides)
            let res:((param:XYZ)=>XYZ)[]=[]
            for (let sym of symMap.allValues()) res.push(sym)
            
            return res
            
        }
        
        
        


        






    }
}