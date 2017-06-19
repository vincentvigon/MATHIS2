/**
 * Created by vigon on 06/05/2016.
 */

module mathis{



    /**
     *
     * from http://bugman123.com/Physics/index.html
     *
     *
     * Clear[x, y, t, p, v]; mu = 0.0123001; x1 = -mu; x2 = 1 - mu; r1 = Sqrt[(x - x1)^2 + y^2]; r2 = Sqrt[(x - x2)^2 + y^2];
     {x0, y0} = {x, y} /.

     Last[NSolve[{-x == -x2(x - x1)/r1^3 + x1(x - x2)/r2^3, -y == -(x2/r1^3 - x1/r2^3) y}, {x, y}]];

     JacobianMatrix[p_, q_] := Outer[D, p, q];

     vlist = Eigenvectors[JacobianMatrix[{xdot, -x2(x - x1)/r1^3 + x1(x - x2)/r2^3 + 2ydot + x, ydot, -(x2/r1^3 - x1/r2^3)y - 2xdot + y}, {x, xdot, y, ydot}] /. {x -> x0, xdot -> 0, y -> y0, ydot -> 0}];
     r1 = Sqrt[(x[t] - x1)^2 + y[t]^2]; r2 = Sqrt[(x[t] - x2)^2 + y[t]^2];
     tmax = 355;
     p0 = {x0, y0, 0, 0} + Re[0.5 vlist[[1]] + vlist[[3]]]/3.84400*^5;
     p[t_] = {x[t], y[t]} /. NDSolve[{x''[t] - 2y'[t] - x[t] == -x2(x[t] - x1)/r1^3 + x1(x[t] - x2)/r2^3, y''[t] + 2x'[t] - y[t] == -(x2/r1^3 - x1/r2^3)y[t], x[0] == p0[[1]], y[0] == p0[[2]], x'[0] == p0[[3]], y'[0] == p0[[4]]}, {x[t], y[t]}, {t, 0, tmax}, MaxSteps -> 100000, AccuracyGoal -> 10][[1]];
     v[t_] = D[p[t], t];
     ParametricPlot3D[Append[p[t], v[t][[1]]], {t, 0, tmax}, Compiled -> False, PlotPoints -> 1000, BoxRatios -> {1, 1, 1}, ViewPoint -> {0, 10, 0}]
     *
     *
     * */

        // ImplicitPlot3D.m,  http://www2.math.umd.edu/~jmr/241/mfiles/implicitplot3d.m


    //deformation de la sphère
    //https://en.wikipedia.org/wiki/Roman_surface


        //plein de surface paramétriques
        //http://faculty.ms.u-tokyo.ac.jp/users/urabe/geom/param1E.html


        //Deformation of the Catenoid to the Helicoid






    export namespace equations{




        export class SurfaceEquation{
            rangeU
            rangeV

            X:(u:number,v:number)=>number
            Y:(u:number,v:number)=>number
            Z:(u:number,v:number)=>number

            permuteXYZ(xyzOrder:string[]){

                if (xyzOrder.length!=3) throw "xyzOrder must be an array of size 3 made with letter X,Y,Z"


                let X=this[xyzOrder[0]]
                let Y=this[xyzOrder[1]]
                let Z=this[xyzOrder[2]]

                this.X=X
                this.Y=Y
                this.Z=Z

                if (this.X==null || this.Y==null || this.Z==null ) throw "xyzOrder must be an array of size 3 made with letter X,Y,Z"

                return this
            }

            //Xperm=(u,v)=>this.X(u,v)


        }

        export class KleinBottle extends SurfaceEquation{



            rangeU=[-PI,PI]
            rangeV=[-PI,PI]


            X= function(u,v){

                return -(2/15)*cos(u)*(3*cos(v)-30*sin(u)+90*cos(u)**4.*sin(u)- 60*cos(u)**6.*sin(u)+5*cos(u)*cos(v)*sin(u))}

            Y= function(u,v){

                return -(1/15)*sin(u)*(3*cos(v)-3*cos(u)**2.*cos(v)-48*cos(u)**4.*cos(v)+48*cos(u)**6.*cos(v)-60*sin(u)+5*cos(u)*cos(v)*sin(u)
            -5*cos(u)**3.*cos(v)*sin(u) -80*cos(u)**5.*cos(v)*sin(u)+80*cos(u)**7*cos(v)*sin(u))}

            Z= function(u,v){

                return (2/15)*(3+5*cos(u)*sin(u))*sin(v)}
        }


        export class KleinBagel extends SurfaceEquation{



            rangeU=[0,2*PI]
            rangeV=[0,2*PI]
            r = 2.1
            X = (u, v) => ( this.r + cos(u/2) * sin(v) - sin(u/2) * sin(2 * v)) * cos(u)
            Y = (u, v) => (this.r + cos(u/2) * sin(v) - sin(u/2) * sin(2 * v)) * sin(u)
            Z = (u, v) => sin(u/2) * sin(v) + cos(u/2) * sin(2 * v)
        }

        export class Cylinder extends SurfaceEquation{

            rangeU=[0,2*PI]
            rangeV=[0,2*PI]
            X=function(u,v){return cos(u)}
            Y=function(u,v){return v}
            Z=function(u,v){return sin(u)}
        }


        export class Moebius extends SurfaceEquation{

            rangeU=[-PI,PI]
            rangeV=[-0.5,0.5]

            X=function(u,v){return (1-1*v*sin(u/2))*sin(u)}
            Y=function(u,v){return (1-1*v*sin(u/2))*cos(u)}
            Z=function(u,v){return 1*v*cos(u/2)}

        }


        export class Torus extends SurfaceEquation{

            rangeU=[0,2*PI]
            rangeV=[0,2*PI]

            r=0.3
            a=0.7
            X = (u, v) =>(this.r*cos(u)+this.a)*cos(v)
            Y = (u, v) =>(this.r*cos(u)+this.a)*sin(v)
            Z = (u, v) =>this.r*sin(u)

        }

        export class Boy extends SurfaceEquation{

            rangeU=[0,2*PI]
            rangeV=[0,2*PI]

            X = (u, v) => 2 / 3. * (cos(u) * cos(2 * v) + sqrt(2) * sin(u) * cos(v)) * cos(u) / (sqrt(2) - sin(2 * u) * sin(3 * v))
            Y = (u, v) => 2 / 3. * (cos(u) * sin(2 * v) - sqrt(2) * sin(u) * sin(v)) * cos(u) / (sqrt(2) - sin(2 * u) * sin(3 * v))
            Z = (u, v) => -sqrt(2) * cos(u) * cos(u) / (sqrt(2) - sin(2 * u) * sin(3 * v))

        }

        export class BoyAppery extends SurfaceEquation{

            //https://matematiku.wordpress.com/2011/05/26/boy-surface/

            rangeU=[0,2*PI]
            rangeV=[0,2*PI]

            a=0.5
            D=  (u, v) => 2-this.a*sqrt(2)*sin(3*u)*sin(2*v)

            X = (u, v) => sqrt(2)*cos(2*u)*cos(v)**2+cos(u)*sin(2*v)
            Y = (u, v) => sqrt(2)*sin(2*v)*cos(v)**2-sin(u)*sin(2*v)
            Z = (u, v) => 3*cos(v)**2/this.D(u,v)

        }

        // export class BourMinimalSurface extends SurfaceEquation{
        //
        //     //http://www.csl.mtu.edu/cs3621/www/PROBS/PROB-5/prob-5.html
        //
        //     rangeU=[0,Number.POSITIVE_INFINITY]
        //     rangeV=[0,2*PI]
        //
        //     n=4
        //
        //     X = (u, v) => (u**(this.n-1)*cos((this.n-1)*v)/(2*(this.n-1))-u**(this.n+1)*cos((this.n+1)*v)/(2*(this.n+1)))*3*this.n
        //     Y = (u, v) => (u**(this.n-1)*sin((this.n-1)*v)/(2*(this.n-1))+u**(this.n+1)*sin((this.n+1)*v)/(2*(this.n+1)))*3*this.n
        //     Z = (u, v) => (u**this.n*cos(this.n*v)/this.n)*3*this.n
        //
        // }


        /**une paramétrisation for the real projective plan
         * https://en.wikipedia.org/wiki/Real_projective_plane*/
        export class CrossCappedDisk extends SurfaceEquation{

            rangeU=[0,2*PI]
            rangeV=[0,2*PI]
            X = (u, v) =>(1+cos(v))*cos(u)
            Y= (u, v) => (1+cos(v))*sin(u)
            Z= (u, v) => specialFunctions.tanh(u-PI)*sin(v)

        }


        export class SelfIntersectingDisk extends SurfaceEquation{
            rangeU=[0,2*PI]
            rangeV=[0,2*PI]

            X = (u, v) => v*cos(2*u)
            Y = (u, v) => v*sin(2*u)
            Z = (u, v) => v*cos(u)
        }









        /**not a real spherical Harmonic*/
        export class SphericalHarmonic{
            m=[]

            XYZ(phi,theta) {
                let p=new XYZ(0,0,0)

                var r = 0;
                r += (sin(this.m[0] * theta)** this.m[1]);
                r += (cos(this.m[2] * theta)** this.m[3]);
                r += (sin(this.m[4] * phi)** this.m[5]);
                r += (cos(this.m[6] * phi)** this.m[7]);

                var sinTheta = sin(theta);
                p.x = r * sinTheta * cos(phi);
                p.y = r * cos(theta);
                p.z = r * sinTheta * sin(phi);
                return p;
            }
        }


        export class SurfaceEquationModified extends SurfaceEquation{

            constructor(private originalEquation){
                super()
            }

            scale(lambda:number|XYZ){
                if (lambda instanceof XYZ){
                    let scale =<XYZ> lambda
                    this.X=(u,v)=>scale.x*this.originalEquation.X()
                    this.Y=(u,v)=>scale.y*this.originalEquation.Y()
                    this.Z=(u,v)=>scale.z*this.originalEquation.Z()
                }
                else{
                    let scale =<number> lambda
                    this.X=(u,v)=>scale*this.originalEquation.X()
                    this.Y=(u,v)=>scale*this.originalEquation.Y()
                    this.Z=(u,v)=>scale*this.originalEquation.Z()
                }
                return this


            }

            permuteXYZ(xyzOrder:string[]){

                if (xyzOrder.length!=3) throw "xyzOrder must be an array of size 3 made with letter X,Y,Z"

                this.X=this.originalEquation[xyzOrder[0]]
                this.Y=this.originalEquation[xyzOrder[1]]
                this.Z=this.originalEquation[xyzOrder[2]]
                if (this.X==null || this.Y==null || this.Z==null ) throw "xyzOrder must be an array of size 3 made with letter X,Y,Z"

                return this
            }


        }















    }





    export module specialFunctions{

        export let sinh=x=>(exp(x)-exp(-x))/2

        export let cosh=x=>(exp(x)+exp(-x))/2


        export let tanh=x=>(exp(x)-exp(-x))/(exp(x)+exp(-x))

        export let sech=x=>2/(exp(x)+exp(-x))

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
            let cosThe=cos(theta)
            let sinThe=sin(theta)
            
            geo.numbersToMM(
                cosThe,    0,  sinThe,   0,
                0,      1,  0,      0,
                -sinThe,    0,  cosThe,    0,
                0,      0,  0,      1,
                res)
            
            
            return res
        }
        export let rotationYAxisP= (theta)=> {
            let res=new MM()
            let cosThe=cos(theta)
            let sinThe=sin(theta)

            geo.numbersToMM(
                -sinThe,    0,  cosThe,   0,
                0,      0,  0,      0,
                -cosThe,    0,  -sinThe,    0,
                0,      0,  0,      1,
                res)
            
            return res
        }
        export let rotationYAxisPP= (theta)=> {
            let res=new MM()
            let cosThe=cos(theta)
            let sinThe=sin(theta)

            geo.numbersToMM(
                -cosThe,    0,  -sinThe,   0,
                0,      0,  0,      0,
                sinThe,    0,  -cosThe,    0,
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
                lin.radiusAbsolute=0.01
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
                        gene.nbU = 32
                        gene.nbV = 64
                
                        let departureMesh =new reseau.Regular2d( gene).go()
                        let arrivalMesh =new reseau.Regular2d( gene).go()
                
                
                        let r = 0.3 
                        let a = 0.7 
                
                        let carte0 = new Carte()
                        carte0.maillage = departureMesh
                        carte0.arrivalOpenMesh = arrivalMesh
                
                        carte0.X = (u, v)=>new XYZ((r * cos(u) + a) * cos(v), (r * cos(u) + a) * sin(v), r * sin(u))
                        carte0.Xu = (u, v)=>new XYZ(-r * sin(u) * cos(v), -r * sin(u) * sin(v), r * cos(u))
                        carte0.Xv = (u, v)=>new XYZ(-(r * cos(u) + a) * sin(v), (r * cos(u) + a) * cos(v), 0)
                
                        carte0.Xuu = (u, v)=>new XYZ(-r * cos(u) * cos(v), -r * cos(u) * sin(v), -r * sin(u))
                        carte0.Xuv = (u, v)=>new XYZ(r * sin(u) * sin(v), -r * sin(u) * cos(v), 0)
                        carte0.Xvv = (u, v)=>new XYZ(-(r * cos(u) + a) * cos(v), -(r * cos(u) + a) * sin(v), 0)
                
                        arrivalMesh.vertices.forEach(vert=>{
                            let u=vert.position.x
                            let v=vert.position.y
                            vert.position=carte0.X(u,v)
                        })
                
                        return carte0
                
                    }
                
                    let delta=0.1
                    this.surface.cartes.push(oneCarte(new XYZ(delta, delta, 0),new XYZ(2 * PI-delta, 2 * PI-delta, 0)))
                    this.surface.cartes.push(oneCarte(new XYZ(-PI+delta, -PI+delta, 0),new XYZ( PI-delta, PI-delta, 0)))
                    this.surface.wholeSurfaceMesh=oneCarte(new XYZ(0, 0, 0),new XYZ(2 * PI, 2 * PI, 0)).arrivalOpenMesh
                
                
                }
                else if (this.surfaceName==SurfaceName.cylinder){


                    let nb=40
                    let oneCarte=(origin:XYZ,end:XYZ)=>{
                        let gene = new reseau.BasisForRegularReseau()
                        gene.origin = origin
                        gene.end = end
                        gene.nbU = nb + 1
                        gene.nbV = nb + 1

                        
                        let departureMesh =new reseau.Regular2d( gene).go()
                        let arrivalMesh=new reseau.Regular2d( gene).go()


                        let rad=0.5

                        let carte0 = new Carte()
                        carte0.maillage = departureMesh
                        carte0.arrivalOpenMesh = arrivalMesh

                        carte0.X = (u, v)=>new XYZ(rad*cos(u),v, rad*sin(u))
                        carte0.Xu = (u, v)=>new XYZ(-rad*sin(u),0,rad*cos(u))
                        carte0.Xv = (u, v)=>new XYZ(0, 1, 0)

                        carte0.Xuu = (u, v)=>new XYZ(-rad*cos(u),0, -rad*sin(u))
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
                    this.surface.cartes.push(oneCarte(new XYZ(delta,-1/2, 0),new XYZ(2*PI -delta, 1/2 , 0)))
                    this.surface.cartes.push(oneCarte(new XYZ(delta-PI,-1/2, 0),new XYZ(PI-delta , 1/2 , 0)))



                    this.surface.wholeSurfaceMesh=oneCarte(new XYZ(0,-1/2, 0),new XYZ(2*Math.PI , 1/2 , 0)).arrivalOpenMesh


                }
                else if (this.surfaceName==SurfaceName.pseudoSphere){
                
                
                    let oneCarte=(origin:XYZ,end:XYZ)=>{
                        let gene = new reseau.BasisForRegularReseau()
                        gene.origin = origin
                        gene.end = end
                        gene.nbU = 32 + 1
                        gene.nbV = 20 + 1
                
                       
                        let departureMesh =new reseau.Regular2d(gene).go()
                        let arrivalMesh =new reseau.Regular2d(gene).go()
                
                
                
                        let rotationCarteMaker=new riemann.RotationCarteMaker(specialFunctions.tractrice)
                        rotationCarteMaker.translation=new XYZ(0,-1,0)
                        let sc=1
                        rotationCarteMaker.scaling=new XYZ(sc,sc,sc)
                        rotationCarteMaker.curveP=specialFunctions.tractriceP
                        rotationCarteMaker.curvePP=specialFunctions.tractricePP
                
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
                    this.surface.cartes.push(oneCarte(new XYZ(delta,0.1, 0),new XYZ(2*PI-delta , 3.5 , 0)))
                    this.surface.cartes.push(oneCarte(new XYZ(-PI+delta,0.1, 0),new XYZ(PI-delta , 3.5 , 0)))
                    this.surface.wholeSurfaceMesh=oneCarte(new XYZ(0,0.1, 0),new XYZ(2*PI , 3.5 , 0) ).arrivalOpenMesh
                
                
                }
                else if (this.surfaceName==SurfaceName.selle){
                
                
                    let oneCarte=(origin:XYZ,end:XYZ)=>{
                        let gene = new reseau.BasisForRegularReseau()
                        gene.origin = origin
                        gene.end = end
                        gene.nbU = 40 + 1
                        gene.nbV = 40 + 1
                
                       
                        let departureMesh =new reseau.Regular2d( gene).go()
                        let arrivalMesh =new reseau.Regular2d( gene).go()
                
                
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
                    //this.surface.cartes.push(oneCarte(new XYZ(delta,-1/2, 0),new XYZ(2*PI -delta, 1/2 , 0)))
                    //this.surface.cartes.push(oneCarte(new XYZ(delta-PI,-1/2, 0),new XYZ(PI-delta , 1/2 , 0)))
                
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
                //             carte0.X = (u, v)=>new XYZ(a*cos(u)*Math.cos(v),b*Math.cos(u)*Math.sin(v),c*Math.sin(u))
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
                    geo.multiplicationMatrixVector(specialFunctions.rotationYAxis(u),this.curve(v),r)
                    r.resizes(this.scaling).add(this.translation)
                    return r
                }

                res.Xu=(u,v)=>{
                    let r=new XYZ(0,0,0)
                    geo.multiplicationMatrixVector(specialFunctions.rotationYAxisP(u),this.curve(v),r)
                    r.resizes(this.scaling)
                    return r
                }
                res.Xuu=(u,v)=>{
                    let r=new XYZ(0,0,0)
                    geo.multiplicationMatrixVector(specialFunctions.rotationYAxisPP(u),this.curve(v),r)
                    r.resizes(this.scaling)
                    return r
                }

                res.Xv=(u,v)=>{
                    let r=new XYZ(0,0,0)
                    geo.multiplicationMatrixVector(specialFunctions.rotationYAxis(u),this.curveP(v),r)
                    r.resizes(this.scaling)
                    return r
                }

                res.Xvv=(u,v)=>{
                    let r=new XYZ(0,0,0)
                    geo.multiplicationMatrixVector(specialFunctions.rotationYAxis(u),this.curvePP(v),r)
                    r.resizes(this.scaling)
                    return r
                }
                res.Xuv=(u,v)=>{
                    let r=new XYZ(0,0,0)
                    geo.multiplicationMatrixVector(specialFunctions.rotationYAxisP(u),this.curveP(v),r)
                    r.resizes(this.scaling)
                    return r
                }







                
                return res
                
            }
            
        }
        
        








    }
}