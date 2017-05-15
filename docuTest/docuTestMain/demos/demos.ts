/**
 * Created by vigon on 30/11/2016.
 */


module mathis{
    
    
    export module appli{


        export class InfiniteWordOnIndex implements PieceOfCode{

            NAME="InfiniteWordOnIndex"
            nameOfResau3d=infiniteWorlds.NameOfReseau3D.cube
            $$$nameOfResau3d=new Choices(allIntegerValueOfEnume(infiniteWorlds.NameOfReseau3D),{'visualValues':allStringValueOfEnume(infiniteWorlds.NameOfReseau3D)})

            seeFromInside=true
            $$$seeFromInside=new Choices([true,false],{'before':'view from:','visualValues':['inside','outside'],'onchange':()=>{this.go2()}})

            infinite:infiniteWorlds.InfiniteCartesian

            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.infinite=new infiniteWorlds.InfiniteCartesian(this.mathisFrame)
                this.infinite.buildLightCameraSkyboxAndFog=true
                this.common()
            }

            go(){
                this.mathisFrame.clearScene(false,false,false)
                //this.infinite=new infiniteWorlds.InfiniteCartesian(this.mathisFrame)
                this.infinite.buildLightCameraSkyboxAndFog=false
                this.common()

            }

            private common(){
                this.infinite.nameOfResau3d=this.nameOfResau3d
                this.infinite.go()
            }



            //private weAreInside=true
            go2(){

                if (this.seeFromInside) this.infinite.seeWorldFromInside()
                else this.infinite.seeWorldFromOutside()

            }






        }

        
        export class IsingOnIndex implements PieceOfCode{
            NAME="IsingOnIndex"
            beta=0.5
            $$$beta=new Choices([0,0.5,1,3],{'before':"repulsion force:"})
            q=1
            $$$q=new Choices([0.1,0.5,1,3],{'before':"density:"})

            nbDicho=4
            $$$nbDicho=new Choices([2,3,4],{'before':"nb particles:"})
            
            
            constructor(private mathisFrame:MathisFrame){}
            
            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                let ising=new mecaStat.IsingOnMesh(this.mathisFrame);
                ising.defineLightAndCamera=true
                this.common(ising)
                
            }

            go(){
                this.mathisFrame.clearScene(false,false)

                let ising=new mecaStat.IsingOnMesh(this.mathisFrame)
                ising.defineLightAndCamera=false
                this.common(ising)

            }

            private common(ising){
                ising.beta=this.beta
                ising.q=this.q
                ising.nbDicho=this.nbDicho
                ising.go()
            }
            
        }


        export class DifferentialOnIndex implements PieceOfCode{
            NAME="DifferentialOnIndex"

            vectorField=2//Math.floor(Math.random()*3)
            $$$vectorField=new Choices([0,1,2],{label:'vector field:'})

            noiseIntensity=0
            $$$noiseIntensity=new Choices([0,0.01,0.02,0.05,0.1],{'onchange':this.changeNoise,label:'noise'})


            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()

                this.common(true)
            }

            go(){
                this.mathisFrame.clearScene(false,false)

                this.common(false)

            }

            private changeNoise(){
                if (this.diffsyst!=null){
                    this.diffsyst.vectorFieldForNoise=(t:number, p:XYZ, res:XYZ)=>{res.copyFromFloats(this.noiseIntensity,this.noiseIntensity,0)}
                    this.diffsyst.loadVectorFields()
                }

            }

            private diffsyst:differentialSystem.TwoDim
            private common(makeCam:boolean){

                /**vecter field périodique*/
                let vectorField0:(t:number, p:XYZ, res:XYZ)=>void
                {
                    //let scaled = new XYZ(0, 0, 0)
                    let A1 = t=>0.4 * Math.sin(0.5 * t)
                    let A2 = t=>0.2 * Math.sin(0.5 * t)
                    let a11 = t=>0
                    let a12 = t=>0
                    let a21 = t=>0
                    let a22 = t=>0
                    vectorField0 =  (t:number, p:XYZ, res:XYZ)=> {
                        //to01(p, scaled)
                        /**potential part*/
                        let raX = (p.x - 0.5) * 2
                        let raY = (p.y - 0.5) * 4

                        res.x = -raX * raY * raY
                        res.y = -raX * raX * raY

                        /**excitation part*/
                        res.x += p.x * ( A1(t) + a11(t) * p.x + a12(t) * p.y)
                        res.y += p.y * ( A2(t) + a21(t) * p.x + a22(t) * p.y)

                    }
                }
                let vectorField1:(t:number, p:XYZ, res:XYZ)=>void
                {
                    let A1 = t=>0.4 * Math.sin( t)
                    let A2 = t=>0.2 * Math.sin(0.5 * t)
                    let a11 = t=>0.1* Math.sin( t)
                    let a12 = t=>-0.1* Math.sin( t)
                    let a21 = t=>-0.1* Math.sin( t)
                    let a22 = t=>0.1* Math.sin( t)
                    vectorField1 =  (t:number, p:XYZ, res:XYZ)=> {
                        /**potential part*/
                        let raX = (p.x - 0.5) * 2
                        let raY = (p.y - 0.5) * 4

                        res.x = -raX * raY * raY
                        res.y = -raX * raX * raY

                        /**exitation part*/
                        res.x += p.x * ( A1(t) + a11(t) * p.x + a12(t) * p.y)
                        res.y += p.y * ( A2(t) + a21(t) * p.x + a22(t) * p.y)

                    }
                }
                let vectorField2:(t:number, p:XYZ, res:XYZ)=>void
                {
                    let A1 = t=>0.4 * Math.sin(0.5 * t)
                    let A2 = t=>0.2 * Math.sin(0.3 * t)
                    let a11 = t=>0
                    let a12 = t=>0
                    let a21 = t=>0
                    let a22 = t=>0.1* Math.sin( t)
                    vectorField2 =  (t:number, p:XYZ, res:XYZ)=> {
                        /**potential part*/
                        let raX = (p.x - 0.5) * 2
                        let raY = (p.y - 0.5) * 4

                        res.x = -raX * raY * raY
                        res.y = -raX * raX * raY

                        /**exitation part*/
                        res.x += p.x * ( A1(t) + a11(t) * p.x + a12(t) * p.y)
                        res.y += p.y * ( A2(t) + a21(t) * p.x + a22(t) * p.y)
                    }
                }

                let vectorField
                if (this.vectorField==0) vectorField=vectorField0
                else if (this.vectorField==1) vectorField=vectorField1
                else if (this.vectorField==2) vectorField=vectorField2

                let vectorFieldForNoise=(t:number, p:XYZ, res:XYZ)=>{res.copyFromFloats(this.noiseIntensity,this.noiseIntensity,0)}

                this.diffsyst=new differentialSystem.TwoDim(vectorField,this.mathisFrame)
                this.diffsyst.originView=new XYZ(-1,-1,0)
                this.diffsyst.endView=new XYZ(1,1,0)

                this.diffsyst.vectorFieldForNoise=vectorFieldForNoise

                this.diffsyst.makeLightAndCamera=makeCam
                this.diffsyst.go()



            }
        }


        export class FractalOnIndex implements PieceOfCode{
            NAME="FractalOnIndex"


            alpha=1.2
            $$$alpha=new Choices([0.8,1,1.2,1.5,1.7,1.9],{label:'alpha'})

            beta=0.
            $$$beta=new Choices([-1,-0.7,-0.5,-0.2,0,0.2,0.5,0.7,1],{label:'beta'})


            nbDicho=4
            $$$nbDicho=new Choices([2,3,4,5],{label:'nb dichotomy'})

            showLine=false
            $$$showLine=new Choices([true,false],{label:"showLines:"})


            shape='plan'
            $$$shape=new Choices(['sphere','plan'],{label:'shape:'})




            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-7))
                this.go()

            }

            go(){
                this.mathisFrame.clearScene(false,false)

                let mamesh:Mamesh
                if (this.shape=='sphere') {
                    let creator = new polyhedron.Polyhedron("dodecahedron")
                    mamesh = creator.go()
                }
                else{
                    let basis=new reseau.BasisForRegularReseau()
                    basis.squareMailleInsteadOfTriangle=false
                    basis.origin=new XYZ(-1,-1,0)
                    basis.end=new XYZ(1,1,0)
                    basis.nbI=4
                    basis.nbJ=4
                    let creator=new reseau.Regular(basis)
                    mamesh=creator.go()
                }

                for (let i=0;i<this.nbDicho;i++) new mameshModification.TriangleDichotomer(mamesh).go()

                if (this.shape=='sphere') for (let vertex of mamesh.vertices) vertex.position.normalize()


                let fractalModifier=new fractal.StableRandomFractal(mamesh)
                fractalModifier.referenceDistanceBetweenVertexWithZeroDichoLevel=0.005
                fractalModifier.alpha=this.alpha
                fractalModifier.beta=this.beta
                fractalModifier.deformationFromCenterVersusFromDirection=(this.shape=='sphere')
                fractalModifier.go()

                if (this.shape=='plan'){
                    let positioning=new Positioning()
                    positioning.upVector=new XYZ(0,0,1)
                    positioning.applyToVertices(mamesh.vertices)
                }


                let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)
                surfaceViewer.alpha=1
                //surfaceViewer.normalDuplication=visu3d.NormalDuplication.none
                surfaceViewer.sideOrientation=BABYLON.Mesh.DOUBLESIDE
                surfaceViewer.go()

                if (this.showLine) {
                    let lineViewer = new visu3d.LinesViewer(mamesh, this.mathisFrame.scene)
                    lineViewer.interpolationOption.interpolationStyle = geometry.InterpolationStyle.none
                    lineViewer.isThin = true
                    lineViewer.color = color.thema.defaultLinkColor
                    lineViewer.go()
                }





            }


        }



        export class PolyhedronOnIndex implements PieceOfCode{

            NAME="PolyhedronOnIndex"

            chosenType="dodecahedron"

            name:string="platonic"
            $$$name=new Choices(["platonic","archimedean","prisms","antiprisms","johnson"],{label:''})

            platonicType="dodecahedron"
            $$$platonicType=new Choices(polyhedron.platonic)

            archimedeanType="rhombicuboctahedron"
            $$$archimedeanType=new Choices(polyhedron.archimedean)

            prismsType="octagonal prism"
            $$$prismsType=new Choices(polyhedron.prisms)

            antiprismsType="pentagonal antiprism"
            $$$antiprismsType=new Choices(polyhedron.antiprisms)


            johnsonType="elongated triangular bipyramid"
            $$$johnsonType=new Choices(polyhedron.johnson)


            constructor(private mathisFrame:MathisFrame){

                this.$$$name.options.onchange=()=>{
                    this.showAndHide()
                }

                this.$$$platonicType.options.onchange=()=>{
                    //if(this.platonicType!="") {
                        this.chosenType=this.platonicType
                        this.go()
                    //}
                }
                this.$$$archimedeanType.options.onchange=()=>{
                    this.chosenType=this.archimedeanType
                    this.go()
                }
                this.$$$prismsType.options.onchange=()=>{
                    this.chosenType=this.prismsType
                    this.go()
                }
                this.$$$antiprismsType.options.onchange=()=>{
                    this.chosenType=this.antiprismsType
                    this.go()
                }
                this.$$$johnsonType.options.onchange=()=>{
                    this.chosenType=this.johnsonType
                    this.go()
                }


            }

            showAndHide(){
                this.$$$platonicType.hide()
                this.$$$archimedeanType.hide()
                this.$$$johnsonType.hide()
                this.$$$prismsType.hide()
                this.$$$antiprismsType.hide()



                if (this.name=="platonic"){
                    this.$$$platonicType.show()
                }
                else if (this.name=="archimedean"){
                    this.$$$archimedeanType.show()
                }
                else if (this.name=="prisms"){
                    this.$$$prismsType.show()
                }
                else if (this.name=="antiprisms"){
                    this.$$$antiprismsType.show()
                }
                else if (this.name=="johnson"){
                    this.$$$johnsonType.show()
                }

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-7))

                this.showAndHide()

                this.go()

            }

            go() {
                this.mathisFrame.clearScene(false, false)

                this.mathisFrame.clearScene(false,false)

                polyhedron.getPolyhedronAsync(this.chosenType,(mamesh)=>{

                    let vertices=[]
                    for (var i=0;i<mamesh.vertices.length;i++){
                        var vertex=mamesh.vertices[i]
                        if (!vertex.hasMark(Vertex.Markers.polygonCenter)) vertices.push(vertex)
                    }
                    let verticesViewer = new mathis.visu3d.VerticesViewer(vertices, this.mathisFrame.scene);
                    verticesViewer.go();

                    let linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                    linksViewer.segmentOrientationFunction=function(v0,v1){
                        if (v0.hasMark(Vertex.Markers.polygonCenter)||v1.hasMark(Vertex.Markers.polygonCenter)) return 0
                        return 1
                    }
                    linksViewer.go();

                    let surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                    surfaceViewer.go();

                })


            }


        }


        export class SeveralDemo implements PieceOfCode{

            NAME="SeveralDemo"
            demoChoice=Math.floor(Math.random()*6)
            $$$demoChoice=new Choices([0,1,2,3,4,5],{'visualValues':["infinite world","ising model",'2d differential','alpha fractal','random graph',"polyhedrons"]})

            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){

                this.go()
            }

            go(){
                let pieceOfCode:PieceOfCode
                if (this.demoChoice==0) pieceOfCode=new InfiniteWordOnIndex(this.mathisFrame)
                else if(this.demoChoice==1) pieceOfCode=new IsingOnIndex(this.mathisFrame)
                else if (this.demoChoice==2) pieceOfCode=new DifferentialOnIndex(this.mathisFrame)
                else if (this.demoChoice==3) pieceOfCode=new FractalOnIndex(this.mathisFrame)
                else if (this.demoChoice==4) pieceOfCode=new smallProject.RandomSpacialGraph(this.mathisFrame)
                    else if (this.demoChoice==5) pieceOfCode=new PolyhedronOnIndex(this.mathisFrame)

                else throw "boum"

                indexPage.eventManager.fireEvent(new Event('changeDemo',pieceOfCode.NAME))



                //let attributeChoices=buildChoicesFromPieceOfCode(pieceOfCode)
                //let $divForDemoSelect=$('#divForDemoSelects').empty()
                let binder=new Binder(pieceOfCode,this.mathisFrame.subWindow_NW.$visual,this.mathisFrame)
                binder.pushState=false//TODO
                binder.selectAndAroundClassName="spanForDemoSelects"
                binder.go()

                pieceOfCode.goForTheFirstTime()


            }
        }



        export function startDemo(mathisFrame){

            let pieceOfCode=new SeveralDemo(mathisFrame)
            //let attributeChoices=buildChoicesFromPieceOfCode(pieceOfCode)
            let binder=new Binder(pieceOfCode,$('#demoChoice'),this.mathisFrame)
            binder.pushState=false
            binder.go()

            pieceOfCode.goForTheFirstTime()

        }


        
        
        
        
        
        
    }
}