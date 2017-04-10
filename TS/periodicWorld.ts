
module mathis {

    export module periodicWorld {

        import Vector3 = BABYLON.Vector3;
        import StandardMaterial = BABYLON.StandardMaterial;



        export class FundamentalDomain {


            constructor(public vecA:XYZ, public vecB:XYZ, public vecC:XYZ) {
                geo.matrixFromLines(vecA, vecB, vecC, this.matWebCoordinateToPoint)
                geo.inverse(this.matWebCoordinateToPoint, this.matPointToWebCoordinate)
            }

            private  matWebCoordinateToPoint= new MM()
            private  matPointToWebCoordinate= new MM()
            public isCartesian:boolean = false


            public contains(point:XYZ):boolean {
                throw "must be override"
            }
            
            public webCoordinateToPoint(webCoordinate:WebCoordinate, result:XYZ):void {
                return geo.multiplicationMatrixVector(this.matWebCoordinateToPoint, webCoordinate, result)//XYZ.TransformCoordinates(webCoordinate, this.matWebCoordinateToPoint);
            }
            
            public pointToWebCoordinate(point:XYZ, result:WebCoordinate):void {
                geo.multiplicationMatrixVector(this.matPointToWebCoordinate, point, result)
            }


            private pointWC = new XYZ(0, 0, 0)

            public getDomainContaining(point:XYZ) {

                this.pointToWebCoordinate(point, this.pointWC)
                //var pointWC = this.pointToWebCoordinate(point);

                if (this.isCartesian) return new Domain(this.pointWC.x, this.pointWC.y, this.pointWC.z);
                else {
                    for (var i = -1; i <= 1; i++) {
                        for (var j = -1; j <= 1; j++) {
                            for (var k = -1; k <= 1; k++) {
                                var domainAround = new Domain(this.pointWC.x + i, this.pointWC.y + j, this.pointWC.z + k);
                                if (domainAround.contains(point, this)) return domainAround;
                            }
                        }
                    }
                }

            }


            private domainCenter = new XYZ(0, 0, 0)
            private domainAroundCenter = new XYZ(0, 0, 0)


            public getDomainsAround(nbRepetitions:number, distMax:number, exludeCentralDomain=true):Domain[] {

                // domain.getCenter(this, this.domainCenter);
                var result : Domain[]=[]
                // var bounding = this.getBounding(distMax);
                // bounding.x = Math.ceil(bounding.x);
                // bounding.y = Math.ceil(bounding.y);
                // bounding.z = Math.ceil(bounding.z);

                let intRep=Math.floor(nbRepetitions/=2)

                let bounding=new XYZ(intRep,intRep,intRep)


                for (var i = -bounding.x; i <= bounding.x; i++) {
                    for (var j = -bounding.y; j <= bounding.y; j++) {
                        for (var k = -bounding.z; k <= bounding.z; k++) {
                            
                            var domainAround = new Domain( i,  j,  k);
                            
                            if (!(exludeCentralDomain && i==0 && j==0 && k==0)){
                                domainAround.getCenter(this, this.domainAroundCenter)
                                if (XYZ.DistanceSquared(this.domainAroundCenter, this.domainCenter) < distMax * distMax) result.push(domainAround);

                            }
                            
                            
                        }

                    }

                }


                return result;

            }


            // le nombre de domaine pour courvir la distMax.
            // private  bounding:XYZ;
            // private formerDistMax:number;
            // private tempV = new XYZ(0, 0, 0)
            //
            //
            // public getBounding(distMax:number):XYZ {
            //     if (this.bounding != undefined && this.formerDistMax == distMax) return this.bounding;
            //     if (this.isCartesian) {
            //         this.formerDistMax = distMax;
            //         this.tempV.x = 1;
            //         this.tempV.y = 1;
            //         this.tempV.z = 1;
            //         this.webCoordinateToPoint(this.tempV, this.tempV)
            //         //this.webCoordinateToPointToRef(this.tempV, this.tempV);
            //         this.bounding = new XYZ((Math.abs(this.tempV.x)), ( Math.abs(this.tempV.y)), (Math.abs(this.tempV.z)));
            //         this.bounding.scaleInPlace(distMax);
            //         return this.bounding;
            //     }
            //     throw "for non paralleoid, must be rewrited"
            //
            // }

            
            private _positionWC=new WebCoordinate(0,0,0)
            private _domainPosition=new Domain(0,0,0)
            private _domainPositioncenter=new XYZ(0,0,0)
            private _zero=new XYZ(0,0,0)
            public modulo(position:XYZ,positionInsideFD:XYZ):void{

                this.pointToWebCoordinate(position, this._positionWC);
                this._domainPosition.whichContains(this._positionWC);

                this._domainPosition.getCenter(this, this._domainPositioncenter);

                positionInsideFD.copyFrom(position).substract(this._domainPositioncenter)
                //if (!geo.xyzAlmostEquality(this._domainPositioncenter,this._zero) )  positionInsideFD
                
                
            }
            
            
            

        }

        export class CartesianFundamentalDomain extends FundamentalDomain {

            constructor(vecA:XYZ, vecB:XYZ, vecC:XYZ) {
                super(vecA, vecB, vecC);
                this.isCartesian = true;
            }

            private pointWC2 = new XYZ(0, 0, 0)

            public contains(point:XYZ):boolean {
                super.pointToWebCoordinate(point, this.pointWC2)
                //var pointWC = this.pointToWebCoordinate(point);
                if (Math.abs(this.pointWC2.x) > 1 / 2) return false;
                if (Math.abs(this.pointWC2.y) > 1 / 2) return false;
                if (Math.abs(this.pointWC2.z) > 1 / 2) return false;
                return true;
            }
            
            
            public drawMe(scene){
                
                let box=BABYLON.Mesh.CreateBox('',1,scene)
                box.scaling=new Vector3(this.vecA.length(), this.vecB.length(), this.vecC.length())
                box.material=new StandardMaterial('',scene)
                box.material.alpha=0.2

                // let corner=this.getCorner()
                // box.position=corner
                

            }
            
            public getCorner():XYZ{
                var corner = new XYZ(0, 0, 0);
                corner.add(this.vecA).add(this.vecB).add(this.vecC)
                corner.scaleInPlace(-0.5);
                return corner
            }
            
            
            
            
            public getArretes(scene):Array<BABYLON.AbstractMesh> {

                let corner=this.getCorner()
                

                
                var result = new Array<BABYLON.AbstractMesh>();

                let radius=1
                let originalMesh=BABYLON.Mesh.CreateCylinder('',1,radius,radius,12,null,scene)
                let originalMesh1=BABYLON.Mesh.CreateCylinder('',1,radius,radius,12,null,scene)
                let originalMesh2=BABYLON.Mesh.CreateCylinder('',1,radius,radius,12,null,scene)

                new visu3d.ElongateAMeshFromBeginToEnd(corner, XYZ.newFrom(corner).add(this.vecA),originalMesh).goChanging()
                new visu3d.ElongateAMeshFromBeginToEnd(corner, XYZ.newFrom(corner).add(this.vecB),originalMesh1).goChanging()
                new visu3d.ElongateAMeshFromBeginToEnd(corner, XYZ.newFrom(corner).add(this.vecC),originalMesh2).goChanging()
                result.push(originalMesh)
                result.push(originalMesh1)
                result.push(originalMesh2)


                return result;
            }
            
        }

        export class WebCoordinate extends XYZ {
        }

        //TODO maitre FD en champs
        export class Domain extends WebCoordinate {

            constructor(i:number, j:number, k:number) {
                super(Math.round(i), Math.round(j), Math.round(k));
            }

            public whichContains(webCo:WebCoordinate):Domain {
                this.x = Math.round(webCo.x);
                this.y = Math.round(webCo.y);
                this.z = Math.round(webCo.z);
                return this;
            }


            public equals(otherDomain:Domain) {
                if (otherDomain.x != this.x) return false;
                if (otherDomain.y != this.y) return false;
                if (otherDomain.z != this.z) return false;
                return true;
            }


            public getCenter(fundamentalDomain:FundamentalDomain, result:XYZ):void {
                fundamentalDomain.webCoordinateToPoint(this, result);
            }


            private _point = new XYZ(0, 0, 0)
            private _domainCenter = new XYZ(0, 0, 0)

            public contains(point:XYZ, fundamentalDomain:FundamentalDomain):boolean {
                this._point.copyFrom(point);
                this.getCenter(fundamentalDomain, this._domainCenter)
                this._point.substract(this._domainCenter)
                return fundamentalDomain.contains(this._point);
            }

        }



        export class Multiply {
            public fd:FundamentalDomain
            public maxDistance:number
            public nbRepetitions:number

            constructor(fd:FundamentalDomain, maxDistance:number,nbRepetitions) {
                this.fd=fd
                this.maxDistance=maxDistance
                this.nbRepetitions=nbRepetitions
            }

            
            public addMesh(mesh:BABYLON.Mesh) {
                //mesh.isVisible = false;
                //mesh.visibility=0

                var visibleDomains:Domain[] = this.fd.getDomainsAround(this.nbRepetitions, this.maxDistance);
                
                visibleDomains.forEach((domain:Domain)=> {
                    let domainCenter = new XYZ(0, 0, 0)
                    var clone:BABYLON.InstancedMesh = mesh.createInstance('');
                    
                    domain.getCenter(this.fd, domainCenter)
                    clone.position.addInPlace(domainCenter);
                    clone.visibility=1
                    clone.isVisible=true

                });

            }

            public addInstancedMesh(mesh:BABYLON.InstancedMesh) {

                var visibleDomains:Domain[] = this.fd.getDomainsAround(this.nbRepetitions, this.maxDistance);

                visibleDomains.forEach((domain:Domain)=> {
                    let domainCenter = new XYZ(0, 0, 0)

                    var clone:BABYLON.InstancedMesh = mesh.sourceMesh.createInstance('');
                    clone.scaling.copyFrom(mesh.scaling)
                    clone.position.copyFrom(mesh.position)
                    clone.rotationQuaternion=new BABYLON.Quaternion(0,0,0,0)
                    clone.rotationQuaternion.copyFrom(mesh.rotationQuaternion)

                    domain.getCenter(this.fd, domainCenter)
                    clone.position.addInPlace(domainCenter)
                    clone.visibility=1
                    clone.isVisible=true


                });

            }

            public addAbstractMesh(abMesh:BABYLON.AbstractMesh) {
                
                if (abMesh instanceof BABYLON.Mesh) this.addMesh(abMesh)
                else if (abMesh instanceof BABYLON.InstancedMesh) this.addInstancedMesh(abMesh)

            }
            

        }



    }

}