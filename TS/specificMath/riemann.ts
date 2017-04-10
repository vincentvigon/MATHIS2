/**
 * Created by vigon on 06/05/2016.
 */

module mathis{



    export module usualFunction{

        export let sinh=x=>(Math.exp(x)-Math.exp(-x))/2

        export let tanh=x=>(Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x))

        export let sech=x=>2/(Math.exp(x)+Math.exp(-x))

        export let sechP=x=> -tanh(x)*sech(x)

        export let sechPP=x=> -tanhP(x)*sech(x)-tanh(x)*sechP(x)


        export let tanhP=x=>{
            let ta= tanh(x)
            return 1-ta*ta
        }
        export let tanhPP=x=>-2*tanh(x)*tanhP(x)



        export let tractrice= (x)=> new XYZ(sech(x),x-tanh(x),0)
        export let tractriceP= (x)=> new XYZ(sechP(x),1-tanhP(x),0)
        export let tractricePP= (x)=> new XYZ(sechPP(x),-tanhPP(x),0)


        export let rotationYAxis= (theta)=> {
            let res=new MM()
            let cos=Math.cos(theta)
            let sin=Math.sin(theta)
            
            geo.numbersToMM(
                cos,    0,  sin,   0,
                0,      1,  0,      0,
                -sin,    0,  cos,    0,
                0,      0,  0,      1,
                res)
            
            
            return res
        }
        export let rotationYAxisP= (theta)=> {
            let res=new MM()
            let cos=Math.cos(theta)
            let sin=Math.sin(theta)

            geo.numbersToMM(
                -sin,    0,  cos,   0,
                0,      0,  0,      0,
                -cos,    0,  -sin,    0,
                0,      0,  0,      1,
                res)
            
            return res
        }
        export let rotationYAxisPP= (theta)=> {
            let res=new MM()
            let cos=Math.cos(theta)
            let sin=Math.sin(theta)

            geo.numbersToMM(
                -cos,    0,  -sin,   0,
                0,      0,  0,      0,
                sin,    0,  -cos,    0,
                0,      0,  0,      1,
                res)

            return res
        }



    }


    export module riemann{


        export class Carte{

            name:string
            
            X:(u:number,v:number)=>XYZ
            Xu:(u:number,v:number)=>XYZ
            Xv:(u:number,v:number)=>XYZ
            Xuu:(u:number,v:number)=>XYZ
            Xuv:(u:number,v:number)=>XYZ
            Xvv:(u:number,v:number)=>XYZ

            /** -1 to inverse orientation*/
            orientationCoef=+1
            unit=1

            maillage:Mamesh
            arrivalOpenMesh:Mamesh


            private point=new XYZ(0,0,0)
            private _meanLinkLengthAtArrival:number=null
            
            xyzToUV(xyz:XYZ,recomputeStandartDevialtion=false):{uv:UV;distToBorder:number;distToNearestArrivalMesh:number}{
                if (this.maillage==null) throw 'you must give a maillage to use xyzToUV '

                let uv=new UV(0,0)
                let shortestDist=Number.MAX_VALUE
                let minDistToBorder=Number.MAX_VALUE

                let vertex:Vertex=null
                for (vertex of this.maillage.vertices){
                    let u=vertex.position.x
                    let v=vertex.position.y
                    this.point.copyFrom(this.X(u,v))
                    let dist=geo.distance(this.point,xyz)
                    if (dist<shortestDist){
                        shortestDist=dist
                        uv.u=u
                        uv.v=v
                    }

                    /**the distance to border is computed from the clicked xyz (and not from the choosen point) but that is without importance
                     * this distance can be used to chose the right cart among several*/
                    if (vertex.hasMark(Vertex.Markers.border)){
                        let distToBorder=geo.distance(xyz,this.point)
                        if (distToBorder<minDistToBorder) minDistToBorder=distToBorder
                    }
                }


                if (recomputeStandartDevialtion||this._meanLinkLengthAtArrival==null) this._meanLinkLengthAtArrival=this.meanLinkLengthAtArrival()
                if (shortestDist<1.1*this._meanLinkLengthAtArrival) return {uv:uv,distToBorder:minDistToBorder,distToNearestArrivalMesh:shortestDist}
                else {
                    //cc('in xyzTouV',this.name,xyz,shortestDist,this._meanLinkLengthAtArrival)
                    return null
                }
            }
            
            
            private e(u:number,v:number):number{
                return geo.dot(this.newN(u,v),this.Xuu(u,v))
            }
            private f(u:number,v:number):number{
                return geo.dot(this.newN(u,v),this.Xuv(u,v))
            }
            private g(u:number,v:number):number{
                return geo.dot(this.newN(u,v),this.Xvv(u,v))
            }
            private E(u:number,v:number):number{
                return geo.dot(this.Xu(u,v),this.Xu(u,v))
            }
            private F(u:number,v:number):number{
                return geo.dot(this.Xu(u,v),this.Xv(u,v))
            }
            private G(u:number,v:number):number{
                return geo.dot(this.Xv(u,v),this.Xv(u,v))
            }

            
            createArrivalMeshFromMaillage():void{
                
                let mameshDeepCopier=new mameshModification.MameshDeepCopier(this.maillage)
                mameshDeepCopier.copyCutSegmentsDico=false
                this.arrivalOpenMesh=mameshDeepCopier.go()
                this.arrivalOpenMesh.vertices.forEach(vertex=>{
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position=this.X(u,v)
                })
                
                
            }
            
            
            dNinTangentBasis(u:number,v:number):M22{
                let res=new M22()

                let e=this.e(u,v)
                let f=this.f(u,v)
                let g=this.g(u,v)
                let E=this.E(u,v)
                let F=this.F(u,v)
                let G=this.G(u,v)

                let det=E*G-F*F
                res.m11=(f*F-e*G)/det
                res.m12=(g*F-f*G)/det
                res.m21=(e*F-f*E)/det
                res.m22=(f*F-g*E)/det

                return res
            }


            dNaction(u:number,v:number,vect:XYZ):XYZ{

                let a=this.dNinTangentBasis(u,v)
                let vectUV=this.canonicalToTangentBasis(u,v,vect)
                let trans=a.multiplyUV(vectUV)
                return this.tagentToCanonicalBasis(u,v,trans)

            }


            private canonicalToTangentBasis(u:number,v:number,vect:XYZ):UV{

                let Xu=this.Xu(u,v)
                let Xv=this.Xv(u,v)
                let mat=new M22()
                mat.m11=Xu.x
                mat.m21=Xu.y
                mat.m21=Xv.x
                mat.m22=Xv.y


                let inv=mat.inverse()
                cc(inv.determinant())

                let vect2=new UV(vect.x,vect.y)
                return inv.multiplyUV(vect2)

            }
            private tagentToCanonicalBasis(u:number,v:number,vect:UV):XYZ{

                let Xu=this.Xu(u,v)
                let Xv=this.Xv(u,v)
                Xu.scale(vect.u)
                Xv.scale(vect.v)

                return Xu.add(Xv)

            }



            newN(u:number,v:number):XYZ{
                let res=new XYZ(0,0,0)
                geo.cross(this.Xu(u,v),this.Xv(u,v),res)
                res.normalize().scale(this.unit*this.orientationCoef)
                return res
            }

            meanLinkLengthAtArrival():number{
                let res=0
                let nb=0

                this.maillage.vertices.forEach(v=>{
                    v.links.forEach(l=>{
                        nb++
                        res+=geo.distance(this.X(v.position.x,v.position.y),this.X(l.to.position.x,l.to.position.y))
                    })

                })

                return res/nb

            }
            
        }
        
        
        export class Surface{

            cartes:Carte[]=[]

            wholeSurfaceMesh:Mamesh
           

            drawTheWholeSurface(scene:BABYLON.Scene){
                this.drawOneMesh(this.wholeSurfaceMesh,scene)
            }

            drawOneCarte(carteIndex:number,scene:BABYLON.Scene){
                this.drawOneMesh(this.cartes[carteIndex].arrivalOpenMesh,scene)
            }

            drawOneMesh(mesh:Mamesh,scene:BABYLON.Scene):void{

                
                
                function lineIsChosen(line:Vertex[],space:number):boolean{

                    let vertOk=true
                    for (let vert of line){
                        if (vert.param.x%space!=0 ) {
                            vertOk=false
                            break
                        }
                    }
                    let horOk=true
                    for (let vert of line){
                        if (vert.param.y%space!=0 ) {
                            horOk=false
                            break
                        }
                    }

                    return vertOk||horOk
                }


                let lin=new visu3d.LinesViewer(mesh,scene)
                lin.constantRadius=0.01
                let linesOnSurf=lin.go()
                linesOnSurf.forEach(mesh=>mesh.isPickable=false)


                let surf=new visu3d.SurfaceViewer(mesh,scene)
                surf.alpha=0.5
                //surf.normalDuplication=visu3d.SurfaceVisuStatic.NormalDuplication.none
                //surf.sideOrientation=BABYLON.Mesh.BACKSIDE
                let meshSurf=surf.go()


                // let mat=new BABYLON.StandardMaterial('',this.surfaceMathisFrame.scene)
                // mat.diffuseColor=new Color3(0,1,1)
                // mat.backFaceCulling=true
                // mat.sideOrientation=BABYLON.Mesh.BACKSIDE
                // this.meshSurf.material=mat


            }


            findBestCarte(xyz:XYZ):{uv:UV,carte:Carte}{

                let maxDistToBorder=-1
                let chosenCarte:Carte=null
                let chosenUV:UV=null

                this.cartes.forEach(carte=>{
                    //cc('in find',carte.name)
                    let uvAndDist= carte.xyzToUV(xyz)
                    //cc('in find',uvAndDist,uvAndDist.distToBorder,'maxDistToBorder',maxDistToBorder)

                    /** we chose the carte for which the point is the most central (the further from the border)*/
                    if (uvAndDist!=null && uvAndDist.distToBorder>maxDistToBorder) {

                        maxDistToBorder=uvAndDist.distToBorder
                        chosenCarte=carte
                        chosenUV=uvAndDist.uv

                        //cc('chosenUV',chosenUV)
                    }
                })

                /**do not change at all the following error  message, it is tested in riemann-test*/
                if (chosenUV==null) {
                    cc('the point which is not in any cart arrival is:',xyz.toString())
                    throw 'strange, the xyz do not belong to any carte-arrival'
                }

                return {uv:chosenUV,carte:chosenCarte}

            }


        }
        
        

        export enum SurfaceName{selle,cylinder,torus,pseudoSphere}//ellipsoide
        
        
        
        export class SurfaceMaker{


            private surface:Surface
            private surfaceName:SurfaceName
            private vertexToCarte=new HashMap<Vertex,Carte>()
            carteIndexToMinimalArrivalMesh:Mamesh[]=[]
            
            constructor(surfaceName:SurfaceName){
                
                this.surfaceName=surfaceName
                
            }

            
             go():Surface{
                 
                 this.surface=new Surface()

                this.surface.cartes=[]

                if (this.surfaceName==SurfaceName.torus){
                
                
                    let oneCarte=(origin:XYZ,end:XYZ)=>{
                        let gene = new reseau.BasisForRegularReseau()
                        gene.origin = origin
                        gene.end = end
                        gene.nbI = 32
                        gene.nbJ = 64
                
                        let departureMesh =new reseau.Regular( gene).go()
                        let arrivalMesh =new reseau.Regular( gene).go()
                
                
                        let r = 0.3 
                        let a = 0.7 
                
                        let carte0 = new Carte()
                        carte0.maillage = departureMesh
                        carte0.arrivalOpenMesh = arrivalMesh
                
                        carte0.X = (u, v)=>new XYZ((r * Math.cos(u) + a) * Math.cos(v), (r * Math.cos(u) + a) * Math.sin(v), r * Math.sin(u))
                        carte0.Xu = (u, v)=>new XYZ(-r * Math.sin(u) * Math.cos(v), -r * Math.sin(u) * Math.sin(v), r * Math.cos(u))
                        carte0.Xv = (u, v)=>new XYZ(-(r * Math.cos(u) + a) * Math.sin(v), (r * Math.cos(u) + a) * Math.cos(v), 0)
                
                        carte0.Xuu = (u, v)=>new XYZ(-r * Math.cos(u) * Math.cos(v), -r * Math.cos(u) * Math.sin(v), -r * Math.sin(u))
                        carte0.Xuv = (u, v)=>new XYZ(r * Math.sin(u) * Math.sin(v), -r * Math.sin(u) * Math.cos(v), 0)
                        carte0.Xvv = (u, v)=>new XYZ(-(r * Math.cos(u) + a) * Math.cos(v), -(r * Math.cos(u) + a) * Math.sin(v), 0)
                
                        arrivalMesh.vertices.forEach(vert=>{
                            let u=vert.position.x
                            let v=vert.position.y
                            vert.position=carte0.X(u,v)
                        })
                
                        return carte0
                
                    }
                
                    let delta=0.1
                    this.surface.cartes.push(oneCarte(new XYZ(delta, delta, 0),new XYZ(2 * Math.PI-delta, 2 * Math.PI-delta, 0)))
                    this.surface.cartes.push(oneCarte(new XYZ(-Math.PI+delta, -Math.PI+delta, 0),new XYZ( Math.PI-delta, Math.PI-delta, 0)))
                    this.surface.wholeSurfaceMesh=oneCarte(new XYZ(0, 0, 0),new XYZ(2 * Math.PI, 2 * Math.PI, 0)).arrivalOpenMesh
                
                
                }
                else if (this.surfaceName==SurfaceName.cylinder){


                    let nb=40
                    let oneCarte=(origin:XYZ,end:XYZ)=>{
                        let gene = new reseau.BasisForRegularReseau()
                        gene.origin = origin
                        gene.end = end
                        gene.nbI = nb + 1
                        gene.nbJ = nb + 1

                        
                        let departureMesh =new reseau.Regular( gene).go()
                        let arrivalMesh=new reseau.Regular( gene).go()


                        let rad=0.5

                        let carte0 = new Carte()
                        carte0.maillage = departureMesh
                        carte0.arrivalOpenMesh = arrivalMesh

                        carte0.X = (u, v)=>new XYZ(rad*Math.cos(u),v, rad*Math.sin(u))
                        carte0.Xu = (u, v)=>new XYZ(-rad*Math.sin(u),0,rad*Math.cos(u))
                        carte0.Xv = (u, v)=>new XYZ(0, 1, 0)

                        carte0.Xuu = (u, v)=>new XYZ(-rad*Math.cos(u),0, -rad*Math.sin(u))
                        carte0.Xuv = (u, v)=>new XYZ(0, 0, 0)
                        carte0.Xvv = (u, v)=>new XYZ(0, 0, 0)

                        arrivalMesh.vertices.forEach(vert=>{
                            let u=vert.position.x
                            let v=vert.position.y
                            vert.position=carte0.X(u,v)
                        })

                        return carte0

                    }

                    let delta=0.3
                    this.surface.cartes.push(oneCarte(new XYZ(delta,-1/2, 0),new XYZ(2*Math.PI -delta, 1/2 , 0)))
                    this.surface.cartes.push(oneCarte(new XYZ(delta-Math.PI,-1/2, 0),new XYZ(Math.PI-delta , 1/2 , 0)))


                    // delta=0.8
                    // let ma1=oneCarte(new XYZ(delta,-1/2, 0),new XYZ(2*Math.PI -delta, 1/2 , 0)).arrivalOpenMesh
                    // let ma2=oneCarte(new XYZ(delta-Math.PI,-1/2, 0),new XYZ(Math.PI-delta , 1/2 , 0)).arrivalOpenMesh
                    // let concurenter=new mameshModification.ConcurrentMameshesGraterAndSticker([ma1,ma2])
                    // concurenter.duringGratingSeedAreComputedFromBarycentersVersusFromAllPossibleCells=false
                    // concurenter.toleranceToBeOneOfTheClosest=0


                    this.surface.wholeSurfaceMesh=oneCarte(new XYZ(0,-1/2, 0),new XYZ(2*Math.PI , 1/2 , 0)).arrivalOpenMesh


                }
                else if (this.surfaceName==SurfaceName.pseudoSphere){
                
                
                    let oneCarte=(origin:XYZ,end:XYZ)=>{
                        let gene = new reseau.BasisForRegularReseau()
                        gene.origin = origin
                        gene.end = end
                        gene.nbI = 32 + 1
                        gene.nbJ = 20 + 1
                
                       
                        let departureMesh =new reseau.Regular(gene).go()
                        let arrivalMesh =new reseau.Regular(gene).go()
                
                
                
                        let rotationCarteMaker=new riemann.RotationCarteMaker(usualFunction.tractrice)
                        rotationCarteMaker.translation=new XYZ(0,-1,0)
                        let sc=1
                        rotationCarteMaker.scaling=new XYZ(sc,sc,sc)
                        rotationCarteMaker.curveP=usualFunction.tractriceP
                        rotationCarteMaker.curvePP=usualFunction.tractricePP
                
                        let carte0 =rotationCarteMaker.go()
                        carte0.maillage = departureMesh
                        carte0.arrivalOpenMesh = arrivalMesh
                
                        
                        arrivalMesh.vertices.forEach(vert=>{
                            let u=vert.position.x
                            let v=vert.position.y
                            vert.position=carte0.X(u,v)
                        })
                
                        return carte0
                
                    }
                
                    let delta=0.3
                    this.surface.cartes.push(oneCarte(new XYZ(delta,0.1, 0),new XYZ(2*Math.PI-delta , 3.5 , 0)))
                    this.surface.cartes.push(oneCarte(new XYZ(-Math.PI+delta,0.1, 0),new XYZ(Math.PI-delta , 3.5 , 0)))
                    this.surface.wholeSurfaceMesh=oneCarte(new XYZ(0,0.1, 0),new XYZ(2*Math.PI , 3.5 , 0) ).arrivalOpenMesh
                
                
                }
                else if (this.surfaceName==SurfaceName.selle){
                
                
                    let oneCarte=(origin:XYZ,end:XYZ)=>{
                        let gene = new reseau.BasisForRegularReseau()
                        gene.origin = origin
                        gene.end = end
                        gene.nbI = 40 + 1
                        gene.nbJ = 40 + 1
                
                       
                        let departureMesh =new reseau.Regular( gene).go()
                        let arrivalMesh =new reseau.Regular( gene).go()
                
                
                        let carte0 = new Carte()
                        carte0.maillage = departureMesh
                        carte0.arrivalOpenMesh = arrivalMesh
                
                        carte0.X = (u, v)=>new XYZ(u, v, v * v - u * u)
                        carte0.Xu = (u, v)=>new XYZ(1, 0, -2 * u)
                        carte0.Xv = (u, v)=>new XYZ(0, 1, 2 * v)
                
                        carte0.Xuu = (u, v)=>new XYZ(0, 0, -2)
                        carte0.Xuv = (u, v)=>new XYZ(0, 0, 0)
                        carte0.Xvv = (u, v)=>new XYZ(0, 0, 2)
                
                        //     carte0.X = (u, v)=>new XYZ(u, v, v * v - u * u)
                        //     carte0.Xu = (u, v)=>new XYZ(1, 0, -2 * u)
                        //     carte0.Xv = (u, v)=>new XYZ(0, 1, 2 * v)
                        //
                        //     carte0.Xuu = (u, v)=>new XYZ(0, 0, -2)
                        //     carte0.Xuv = (u, v)=>new XYZ(0, 0, 0)
                        //     carte0.Xvv = (u, v)=>new XYZ(0, 0, 2)
                
                
                
                        arrivalMesh.vertices.forEach(vert=>{
                            let u=vert.position.x
                            let v=vert.position.y
                            vert.position=carte0.X(u,v)
                        })
                
                        return carte0
                
                    }
                
                    //let delta=0.1
                    //this.surface.cartes.push(oneCarte(new XYZ(delta,-1/2, 0),new XYZ(2*Math.PI -delta, 1/2 , 0)))
                    //this.surface.cartes.push(oneCarte(new XYZ(delta-Math.PI,-1/2, 0),new XYZ(Math.PI-delta , 1/2 , 0)))
                
                    let coef = 0.7
                    this.surface.cartes.push(oneCarte(new XYZ(- coef, - coef, 0),new XYZ(coef,  coef, 0)))
                    this.surface.wholeSurfaceMesh=oneCarte(new XYZ(- coef, - coef, 0),new XYZ(coef,  coef, 0)).arrivalOpenMesh
                
                
                }
                // else if (this.surfaceName==SurfaceName.ellipsoide){
                //
                //
                //     let oneCarte=(origin:XYZ,end:XYZ,permute=false)=>{
                //         let gene = new reseau.BasisForRegularReseau()
                //         gene.origin = origin
                //         gene.end = end
                //         gene.nbI = 32 + 1
                //         gene.nbJ = 32 + 1
                //
                //
                //         let departureMesh =new reseau.Regular( gene).go()
                //         let arrivalMesh =new reseau.Regular( gene).go()
                //
                //
                //         let a=1
                //         let b=0.75
                //         let c=0.5
                //
                //         let carte0 = new Carte()
                //         carte0.maillage = departureMesh
                //         carte0.arrivalOpenMesh = arrivalMesh
                //
                //         if(!permute) {
                //             carte0.X = (u, v)=>new XYZ(a*Math.cos(u)*Math.cos(v),b*Math.cos(u)*Math.sin(v),c*Math.sin(u))
                //             carte0.Xu = (u, v)=>new XYZ(-a*Math.sin(u)*Math.cos(v),-b*Math.sin(u)*Math.sin(v),c*Math.cos(u))
                //             carte0.Xv = (u, v)=>new XYZ(-a*Math.cos(u)*Math.sin(v),b*Math.cos(u)*Math.cos(v),0)
                //
                //             carte0.Xuu = (u, v)=>new XYZ(-a*Math.cos(u)*Math.cos(v),-b*Math.cos(u)*Math.sin(v),-c*Math.sin(u))
                //             carte0.Xuv = (u, v)=>new XYZ(a*Math.sin(u)*Math.sin(v),-b*Math.sin(u)*Math.cos(v),0)
                //             carte0.Xvv = (u, v)=>new XYZ(-a*Math.cos(u)*Math.cos(v),-b*Math.cos(u)*Math.sin(v),0)
                //         }
                //         else {
                //             carte0.X = (u, v)=>new XYZ(a*Math.sin(u),b*Math.cos(u)*Math.cos(v),c*Math.cos(u)*Math.sin(v))
                //             carte0.Xu = (u, v)=>new XYZ(a*Math.cos(u),-b*Math.sin(u)*Math.cos(v),-c*Math.sin(u)*Math.sin(v))
                //             carte0.Xv = (u, v)=>new XYZ(0,-b*Math.cos(u)*Math.sin(v),c*Math.cos(u)*Math.cos(v))
                //
                //             carte0.Xuu = (u, v)=>new XYZ(-a*Math.sin(u),-b*Math.cos(u)*Math.cos(v),-c*Math.cos(u)*Math.sin(v))
                //             carte0.Xuv = (u, v)=>new XYZ(-a*Math.sin(u),b*Math.sin(u)*Math.sin(v),-c*Math.sin(u)*Math.cos(v))
                //             carte0.Xvv = (u, v)=>new XYZ(0,-b*Math.cos(u)*Math.cos(v),-c*Math.cos(u)*Math.sin(v))
                //         }
                //
                //
                //         arrivalMesh.vertices.forEach(vert=>{
                //             let u=vert.position.x
                //             let v=vert.position.y
                //             vert.position=carte0.X(u,v)
                //         })
                //
                //         return carte0
                //
                //     }
                //
                //     let delta=0.8
                //     this.surface.cartes.push(oneCarte(new XYZ(-Math.PI/2+delta,-Math.PI+delta, 0),new XYZ(Math.PI/2-delta , Math.PI-delta , 0)))
                //     this.surface.cartes.push(oneCarte(new XYZ(-Math.PI/2+delta,-Math.PI+delta, 0),new XYZ(Math.PI/2-delta , Math.PI-delta , 0),true))
                //
                //     let ma1=oneCarte(new XYZ(-Math.PI/2+delta,-Math.PI+delta, 0),new XYZ(Math.PI/2-delta , Math.PI-delta , 0)).arrivalOpenMesh
                //     let ma2=oneCarte(new XYZ(-Math.PI/2+delta,-Math.PI+delta, 0),new XYZ(Math.PI/2-delta , Math.PI-delta , 0),true).arrivalOpenMesh
                //
                //     let concurenter=new mameshModification.ConcurrentMameshesGraterAndSticker()
                //     concurenter.IN_mameshes=[ma1,ma2]
                //     concurenter.justGrateDoNotStick=false
                //     this.surface.wholeSurfaceMesh=concurenter.goChanging()//oneCarte(new XYZ(-Math.PI/2,-Math.PI, 0),new XYZ(Math.PI/2 , Math.PI , 0)).arrivalOpenMesh
                //
                //
                //
                //
                // }
                //

                else throw 'not yet'




                 this.makeMinimalMeshesForEachCarte()
                 
                 return this.surface






            }


            

            makeMinimalMeshesForEachCarte():void{

                //let selectedVertices:Vertex[]=[]

                for (let carteIndex=0;carteIndex<this.surface.cartes.length;carteIndex++){
                    let carte=this.surface.cartes[carteIndex]
                    let selectedVerticesForOneCart:Vertex[]=[]

                    carte.arrivalOpenMesh.vertices.forEach(vert=>{
                        let uvAndCarte=this.surface.findBestCarte(vert.position)
                        if (uvAndCarte.carte==carte){
                            //selectedVertices.push(vert)
                            this.vertexToCarte.putValue(vert,carte)
                            selectedVerticesForOneCart.push(vert)
                        }


                    })
                    
                    //cc('carte:',carte.name, carte.arrivalOpenMesh.vertices.length,'restricte',selectedVerticesForOneCart.length)


                    let subMamesh=new grateAndGlue.SubMameshExtractor(carte.arrivalOpenMesh,selectedVerticesForOneCart).go()

                    this.carteIndexToMinimalArrivalMesh[carteIndex]=subMamesh
                }
                
                
            }


        }
        
        
        export class RotationCarteMaker{
            
            translation=new XYZ(0,0,0)
            scaling=new XYZ(1,1,1)
            
            private curve:(x:number)=>XYZ
            curveP:(x:number)=>XYZ
            curvePP:(x:number)=>XYZ


            constructor(curve:(x:number)=>XYZ){
                this.curve=curve
            }
            
            go():Carte{
                let res=new Carte()
                res.X=(u,v)=>{
                    let r=new XYZ(0,0,0)
                    geo.multiplicationMatrixVector(usualFunction.rotationYAxis(u),this.curve(v),r)
                    r.resizes(this.scaling).add(this.translation)
                    return r
                }

                res.Xu=(u,v)=>{
                    let r=new XYZ(0,0,0)
                    geo.multiplicationMatrixVector(usualFunction.rotationYAxisP(u),this.curve(v),r)
                    r.resizes(this.scaling)
                    return r
                }
                res.Xuu=(u,v)=>{
                    let r=new XYZ(0,0,0)
                    geo.multiplicationMatrixVector(usualFunction.rotationYAxisPP(u),this.curve(v),r)
                    r.resizes(this.scaling)
                    return r
                }

                res.Xv=(u,v)=>{
                    let r=new XYZ(0,0,0)
                    geo.multiplicationMatrixVector(usualFunction.rotationYAxis(u),this.curveP(v),r)
                    r.resizes(this.scaling)
                    return r
                }

                res.Xvv=(u,v)=>{
                    let r=new XYZ(0,0,0)
                    geo.multiplicationMatrixVector(usualFunction.rotationYAxis(u),this.curvePP(v),r)
                    r.resizes(this.scaling)
                    return r
                }
                res.Xuv=(u,v)=>{
                    let r=new XYZ(0,0,0)
                    geo.multiplicationMatrixVector(usualFunction.rotationYAxisP(u),this.curveP(v),r)
                    r.resizes(this.scaling)
                    return r
                }







                
                return res
                
            }
            
        }
        
        








    }
}