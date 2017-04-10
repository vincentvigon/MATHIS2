// /**
//  * Created by vigon on 04/03/2016.
//  */
//
//
// module mathis{
//
//
//
//
//     //
//     // export class ICell extends GameO {
//     //
//     // }
//     //
//     //
//     // export class ISoldier extends GameO {
//     //
//     // }
//     //
//     //
//     // export class Soldier3D extends ISoldier{
//     //
//     //     babVisual:BABYLON.Mesh
//     //     heigth=1.
//     //     constructor(){
//     //         super();
//     //
//     //     }
//     //
//     //     locDraw(){
//     //
//     //
//     //         this.babVisual=BABYLON.Mesh.CreateCylinder("soldier",this.heigth,0.8,0.8,4,10,scene,true)
//     //         this.babVisual.convertToFlatShadedMesh()
//     //
//     //         var material = new BABYLON.StandardMaterial("texture1", scene);
//     //         this.babVisual.material=material;
//     //         material.diffuseColor = new BABYLON.Color3(0., 1., 0.);
//     //         this.locActualize();
//     //     }
//     //
//     //
//     //
//     //     locScale(alpha:number){
//     //         //var pos=this.pos()
//     //         //this.babVisual.position=new BABYLON.Vector3(pos.x,pos.y+this.heigth/2*alpha,pos.z)
//     //         this.babVisual.scaling.x*=alpha
//     //         this.babVisual.scaling.y*=alpha
//     //         this.babVisual.scaling.z*=alpha
//     //     }
//     //
//     //
//     //
//     //     locActualize(){
//     //
//     //         this.babVisual.position=this.pos()
//     //
//     //         var constantRadius=this.constantRadius()
//     //         this.babVisual.scaling.x=constantRadius
//     //         this.babVisual.scaling.y=constantRadius
//     //         this.babVisual.scaling.z=constantRadius
//     //
//     //         this.babVisual.rotationQuaternion=this.quaternion()
//     //
//     //     }
//     //
//     //
//     //     locClear(){
//     //     }
//     //
//     // }
//     //
//     //
//     //
//     // export class Cell3D extends ICell{
//     //
//     //     babVisual:BABYLON.Mesh
//     //
//     //
//     //
//     //     locDraw(){
//     //
//     //         this.babVisual=BABYLON.Mesh.CreateCylinder("cell",0.1,1,1,20,10,scene)
//     //         this.babVisual.convertToFlatShadedMesh()
//     //         var material = new BABYLON.StandardMaterial("texture1", scene);
//     //         this.babVisual.material=material;
//     //         material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
//     //
//     //         this.locActualize();
//     //
//     //     }
//     //
//     //     locScale(alpha:number){
//     //         this.babVisual.scaling.x*=alpha
//     //         this.babVisual.scaling.y*=alpha
//     //         this.babVisual.scaling.z*=alpha
//     //     }
//     //
//     //     locActualize(){
//     //
//     //         this.babVisual.position=this.pos()
//     //
//     //         var constantRadius=this.constantRadius()
//     //         this.babVisual.scaling.x=constantRadius
//     //         this.babVisual.scaling.y=constantRadius
//     //         this.babVisual.scaling.z=constantRadius
//     //
//     //         this.babVisual.rotationQuaternion=this.quaternion()
//     //
//     //     }
//     //
//     //
//     //
//     //     locClear(){
//     //     }
//     //
//     // }
//
//
//
//
//
//     export class GameoBab extends GameO{
//
//         babMesh:BABYLON.AbstractMesh
//
//         locDrawAlreadyFired=false
//
//
//         material:any
//         /**this default color is used if no material is defined*/
//         color = new BABYLON.Color3(1,0.2,0.2)
//
//
//         getAllAbstractMeshes():BABYLON.AbstractMesh[]{
//             let res=[]
//             if (this.babMesh!=null ) res.push(this.babMesh)
//             this.children.forEach(gam=>{
//                 if (gam instanceof GameoBab){
//                     if (gam.babMesh!=null) res=res.concat(gam.getAllAbstractMeshes())
//                 }
//             })
//
//             return res
//
//         }
//
//
//         // locDraw(){
//         //     /** without the following test, we fact to fire several times method draw() will create several meshes */
//         //     if (this.locDrawAlreadyFired) return
//         //     this.locDrawAlreadyFired=true
//         //
//         //     if (this.material==null) {
//         //         this.material=new BABYLON.StandardMaterial("mat1", this.scene);
//         //         this.material.alpha = this.locOpacity;
//         //         this.material.diffuseColor = this.color
//         //         this.material.backFaceCulling = true
//         //     }
//         //
//         // }
//
//
//         private putMaterial():void{
//
//
//             if (this.material==null) {
//                 this.material=new BABYLON.StandardMaterial("mat1", this.babMesh.getScene());
//                 this.material.alpha = this.locOpacity;
//                 this.material.diffuseColor = this.color
//                 this.material.backFaceCulling = true
//             }
//             this.babMesh.material=this.material
//
//
//
//         }
//
//
//
//         /**important, add this in class which extends BabylonGameO*/
//         afterLocDraw(){
//
//
//             this.babMesh.visibility=1
//             this.putMaterial()
//             this.locActualize()
//
//             if (this.isClickable){
//                 this.babMesh.isPickable=true
//                 /**we add dynamically a field*/
//                 {(<any>this.babMesh).gameo=this}
//             }
//             else this.babMesh.isPickable=false
//         }
//
//
//
//         clickMethod=()=>{cc('j ai ete clique')}
//
//         // //TODO Check this
//         // locScale(alpha:number){
//         //     //var pos=this.pos()
//         //     //this.babVisual.position=new BABYLON.Vector3(pos.x,pos.y+this.heigth/2*alpha,pos.z)
//         //     this.babMesh.scaling.x*=alpha
//         //     this.babMesh.scaling.y*=alpha
//         //     this.babMesh.scaling.z*=alpha
//         // }
//
//
//         locActualize():void{
//
//             this.babMesh.position=this.pos()
//
//             var constantRadius=this.constantRadius()
//             this.babMesh.scaling.x=constantRadius
//             this.babMesh.scaling.y=constantRadius
//             this.babMesh.scaling.z=constantRadius
//
//             this.babMesh.material.alpha=this.opacity()
//
//             this.babMesh.rotationQuaternion=this.quaternion()
//
//         }
//
//
//         locClear(){
//             this.babMesh.dispose()
//         }
//     }
//
//
//     export class GameoFromMesh extends GameoBab{
//
//
//         constructor(mesh:BABYLON.Mesh){
//             super();
//             this.babMesh=mesh
//         }
//
//
//         locDraw(){
//             if (this.locDrawAlreadyFired) return
//             this.locDrawAlreadyFired=true
//
//             super.afterLocDraw()
//
//
//
//             // if (this.isClickable){
//             //     this.babMesh.isPickable=true
//             //     /**we add dynamically a field*/
//             //     {(<any>this.babMesh).gameo=this}
//             // }
//             // else this.babMesh.isPickable=false
//         }
//
//
//         //clickMethod=()=>{cc('j ai ete clique')}
//
//         // private _scale=1
//         // locScale(alpha:number){
//         //     //var pos=this.pos()
//         //     //this.babVisual.position=new BABYLON.Vector3(pos.x,pos.y+this.heigth/2*alpha,pos.z)
//         //     this._scale=alpha
//         // }
//
//
//         // locActualize():void{
//         //
//         //     this.babMesh.position=this.pos()
//         //
//         //     var constantRadius=this.constantRadius()
//         //     this.babMesh.scaling.x=constantRadius
//         //     this.babMesh.scaling.y=constantRadius
//         //     this.babMesh.scaling.z=constantRadius
//         //
//         //     this.babMesh.rotationQuaternion=this.quaternion()
//         //
//         // }
//         //
//         //
//         // locClear(){
//         //     this.babMesh.dispose()
//         // }
//     }
//
//
//     //
//     //
//     // export class VertexDataGameo extends GameoBab{
//     //
//     //     vertexData:BABYLON.VertexData
//     //
//     //     constructor(vertexData:BABYLON.VertexData,scene:BABYLON.Scene,locPosition:XYZ,locQuaternion:XYZW){
//     //         super(scene,locPosition,locQuaternion)
//     //         this.vertexData=vertexData
//     //     }
//     //
//     //     locDraw(){
//     //
//     //
//     //         super.locDraw()
//     //
//     //         this.babMesh=new BABYLON.Mesh('VertexDataGameo',scene)
//     //         this.vertexData.applyToMesh(this.babMesh)
//     //         this.babMesh.material=this.material
//     //
//     //         super.afterLocDraw()
//     //
//     //
//     //     }
//     // }
//
//
//     export class InstanceMeshGameo extends GameoBab{
//
//         protected scene:BABYLON.Scene
//
//         locDrawAlreadyFired=false
//
//
//         constructor(babInstancedMesh:BABYLON.InstancedMesh){
//             super();
//             this.babMesh=babInstancedMesh
//         }
//
//
//
//         locDraw(){
//             if (this.locDrawAlreadyFired) return
//
//             this.locDrawAlreadyFired=true
//
//             super.afterLocDraw()
//
//
//             // if (this.isClickable){
//             //     this.babInstancedMesh.isPickable=true
//             //     /**we add dynamically a field*/
//             //     {(<any>this.babInstancedMesh).gameo=this}
//             // }
//             // else this.babInstancedMesh.isPickable=false
//         }
//
//
//         clickMethod=()=>{cc('j ai ete clique')}
//
//
//
//
//
//         // locActualize():void{
//         //
//         //     this.babInstancedMesh.position=this.pos()
//         //
//         //     var constantRadius=this.constantRadius()
//         //     this.babInstancedMesh.scaling.x=constantRadius
//         //     this.babInstancedMesh.scaling.y=constantRadius
//         //     this.babInstancedMesh.scaling.z=constantRadius
//         //
//         //     this.babInstancedMesh.rotationQuaternion=this.quaternion()
//         //
//         // }
//         //
//         //
//         // locClear(){
//         //     this.babInstancedMesh.dispose()
//         // }
//     }
//
//
//     //
//     //class GameOOLD{
//     //
//     //    parent:GameO;
//     //    children=new Array<GameO>();
//     //
//     //
//     //    attachTo(parent:GameO){
//     //
//     //        if (this.parent!=null) throw 'une gameO ne doit pas avoir de parent pour être attaché';
//     //        this.parent=parent;
//     //        parent.children.push(this);
//     //
//     //    }
//     //
//     //    detach(){
//     //        if (this.parent!=null) {
//     //            removeFromArray<GameO>(this.parent.children, this);
//     //            this.parent = null;
//     //        }
//     //    }
//     //
//     //
//     //    /** PROPAGATION MONTANTE
//     //     * on calcule une valeur en fonction des parent.
//     //     * les changement effectués ainsi nécessitent ensuite un draw, ou un actualize pour être visible*/
//     //    locPos=new XYZ(0,0,0);
//     //
//     //    posFromParent=(that:GameO)=>{
//     //        if (this.parent==null) throw 'il faut un parent non null';
//     //        var locPosScaled=this.locPos.scale(this.parent.constantRadius())
//     //
//     //        locPosScaled=rotateVectorByQuaternion(locPosScaled,this.parent.quaternion())
//     //
//     //        //console.log('this.locPos,this.parent.constantRadius(),locPosScaled,this.parent.pos().add(locPos)')
//     //        //console.log(this.locPos,this.parent.constantRadius(),locPosScaled,this.parent.pos().add(locPosScaled))
//     //        return this.parent.pos().add(locPosScaled);
//     //    };
//     //
//     //    posMethod:(gameO:GameO)=>XYZ=this.posFromParent;
//     //
//     //    pos():XYZ{
//     //        if (this.posMethod==null) throw 'la méthode pour calculer la position n est pas définie'
//     //        return this.posMethod(this);
//     //    }
//     //
//     //
//     //
//     //    locRadius=1;
//     //    static radiusFromParent=function(that:GameO):number{
//     //        if (that.parent==null) throw 'il faut un parent non null';
//     //        return that.parent.constantRadius()*that.locRadius;
//     //    };
//     //    radiusMethod:(gameO:GameO)=>number=GameO.radiusFromParent;
//     //    constantRadius():number{
//     //        if (this.radiusMethod==null) throw 'la méthode pour calculer le constantRadius n est pas définie'
//     //        return this.radiusMethod(this);
//     //    }
//     //
//     //    locOpacity=1;
//     //    opacity(){
//     //        if (this.parent==null) return this.locOpacity;
//     //        else return this.parent.opacity()*this.locOpacity;
//     //    }
//     //
//     //
//     //    clickMethod: ()=>void;
//     //
//     //    onClick():void{
//     //        if (this.clickMethod!=null)  this.clickMethod();
//     //        else if (this.parent!=null) this.parent.onClick();
//     //        //else nothing
//     //    }
//     //
//     //
//     //    locNoseDir=new BABYLON.Vector3(1,0,0)
//     //    locHeadDir=new BABYLON.Vector3(0,1,0)
//     //    quaternionMethodFromParent =()=>{
//     //        if (this.parent==null) throw "il faut avoir un parent"
//     //        var quaternionParent=this.parent.quaternion()
//     //        var locQuaternion=quaternionByGivingNewPositionForXandY(this.locNoseDir,this.locHeadDir)
//     //        return quaternionParent.multiply(locQuaternion)
//     //    }
//     //
//     //    quaternionMethodForRoot=()=>{
//     //        return quaternionByGivingNewPositionForXandY(this.locNoseDir,this.locHeadDir)
//     //    }
//     //
//     //    quaternionMethod=this.quaternionMethodFromParent
//     //
//     //
//     //    quaternion():BABYLON.Quaternion{
//     //        return this.quaternionMethod()
//     //    }
//     //
//     //
//     //
//     //
//     //    /**PROPAGATION DESCENDANTE*/
//     //
//     //    locDraw():void{}
//     //
//     //    putOverOrUnder(isOver:boolean){throw 'to override'}
//     //
//     //    draw():void{
//     //        //if (this.parent==null) console.log('un gameO sans parent est dessiné',this);
//     //        this.locDraw();
//     //        this.children.forEach((goChanging:GameO)=>{goChanging.draw()})
//     //    }
//     //
//     //    locActualize():void{
//     //    }
//     //
//     //    actualize():void{
//     //        this.locActualize();
//     //        this.children.forEach((goChanging:GameO)=>{goChanging.actualize()})
//     //    }
//     //
//     //    /**le scaling est superficiel et temporaire : il ne change pas du tout le constantRadius
//     //     * le scaling est utilise temporairement pour mettre en avant un gameO */
//     //    locScale(alpha:number):void{
//     //    }
//     //
//     //    scale(alpha:number):void{
//     //        this.locScale(alpha);
//     //        this.children.forEach((goChanging:GameO)=>{goChanging.scale(alpha)})
//     //    }
//     //
//     //
//     //    locClear():void{}
//     //
//     //    clear():void{
//     //        this.locClear();
//     //        for (var c in this.children) this.children[c].clear();
//     //    }
//     //
//     //    dispose(){
//     //        this.clear();
//     //        this.detach();
//     //    }
//     //
//     //
//     //    /**cette méthode détache l'objet de son parent*/
//     //    moveBetween(dep:GameO,arr:GameO,alpha:number):void{
//     //
//     //        var tempVec=new XYZ(0,0,0)
//     //
//     //        tempVec.x = (arr.pos().x - dep.pos().x) * alpha + dep.pos().x+this.locPos.x;
//     //        tempVec.y = (arr.pos().y - dep.pos().y) * alpha + dep.pos().y+this.locPos.y;
//     //        tempVec.z = (arr.pos().z - dep.pos().z) * alpha + dep.pos().z+this.locPos.z;
//     //
//     //
//     //        var constantRadius = (arr.constantRadius()*alpha + dep.constantRadius()*(1-alpha))*this.locRadius;
//     //
//     //        this.posMethod=(that:GameO)=>{return tempVec};
//     //        this.radiusMethod=(that:GameO)=>{return constantRadius};
//     //
//     //        this.actualize();
//     //    }
//     //
//     //    moveBetweenVec(dep:XYZ,arr:XYZ,radiusDep:number,radiusArr:number,alpha:number):void{
//     //
//     //        var bet=XYZ.between(alpha,dep,arr);
//     //        bet.add(this.locPos);
//     //
//     //        //tempVec.x = (arr.pos().x - dep.pos().x) * alpha + dep.pos().x+this.locPos.x;
//     //        //tempVec.y = (arr.pos().y - dep.pos().y) * alpha + dep.pos().y+this.locPos.y;
//     //        //tempVec.z = (arr.pos().z - dep.pos().z) * alpha + dep.pos().z+this.locPos.z;
//     //
//     //        var constantRadius = (radiusArr*alpha + radiusDep*(1-alpha))*this.locRadius;
//     //
//     //        this.posMethod=(that:GameO)=>{return bet};
//     //        this.radiusMethod=(that:GameO)=>{return constantRadius};
//     //
//     //        this.actualize();
//     //    }
//     //
//     //}
//    
//    
//    
//
//
// }