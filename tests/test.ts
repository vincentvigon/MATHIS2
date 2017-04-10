


module mathis{
    //
    // class Tata{}
    //
    // class Toto extends Tata{}
    //
    //
    //
    // class CanEat {
    //     public eat() {
    //         cc('Munch Munch.');
    //     }
    // }
    //
    // class CanSleep {
    //     age:number
    //
    //     sleep() {
    //         cc('Zzzzzzz.'+this.age);
    //     }
    // }
    //
    // function applyMixins(derivedCtor: any, baseCtors: any[]) {
    //     baseCtors.forEach(baseCtor => {
    //         Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
    //             if (name !== 'constructor') {
    //                 derivedCtor.prototype[name] = baseCtor.prototype[name];
    //             }
    //         });
    //     });
    // }
    //
    //
    // class Being implements CanEat, CanSleep {
    //     age:number
    //
    //     eat: () => void;
    //     sleep: () => void;
    //
    //     static mixinsWasMade=false
    //
    //     constructor(){
    //         if(!Being.mixinsWasMade) {
    //             applyMixins (Being, [CanEat, CanSleep]);
    //             Being.mixinsWasMade=true
    //         }
    //
    //     }
    //
    // }
    //
    //
    //
    // function compareArrayVersusDico() {
    //     let t1 = performance.now()
    //     var maxNbData = 10000
    //     var nbCreation = 100000
    //     var nbIntero = 10000
    //
    //     function oneIndex() {
    //         return Math.floor(Math.random() * maxNbData)
    //     }
    //
    //     var trueTab = new Array<string>(maxNbData * maxNbData)
    //     for (var i = 0; i < nbCreation; i++) {
    //         let a = oneIndex()
    //         let b = oneIndex()
    //         trueTab[a * maxNbData + b] = a + ',' + b
    //     }
    //
    //
    //     for (let j = 0; j < nbIntero; j++) {
    //         let a = oneIndex()
    //         let b = oneIndex()
    //         let k = trueTab[a * maxNbData + b]
    //     }
    //     let perfTab = t1 - performance.now()
    //
    //
    //     let s1 = performance.now()
    //     var dictionnary = []
    //
    //
    //     for (var i = 0; i < nbCreation; i++) {
    //         let a = oneIndex()
    //         let b = oneIndex()
    //         dictionnary[a + "," + b] = a + ',' + b
    //     }
    //
    //
    //     for (let j = 0; j < nbIntero; j++) {
    //         let a = oneIndex()
    //         let b = oneIndex()
    //         let k = dictionnary[a + "," + b]
    //     }
    //     console.log('ratio', (s1 - performance.now()) / perfTab)
    //
    //
    // }
    //
    //


    export function doAllTest():void {

        let visualization=true
        if (visualization){

            var mathisFrame = new MathisFrame(null,false)
            let grabber0 = new macamera.SphericalGrabber(mathisFrame.scene)
            mathisFrame.scene.activeCamera = new macamera.GrabberCamera(mathisFrame, grabber0)

            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(1, 1, 1);
            light0.groundColor = new BABYLON.Color3(0, 0, 0);

        }


        var bilanGlobal = new Bilan()
        bilanGlobal.add(linkerTest())
        
        bilanGlobal.add(testCreation3D(mathisFrame))

        bilanGlobal.add(testCreation(mathisFrame))
        bilanGlobal.add(testMameshModification(mathisFrame))
        bilanGlobal.add(informatisTest())
        bilanGlobal.add(geometryTest())
        bilanGlobal.add(symmetriesTest())
        bilanGlobal.add(testRiemann(mathisFrame))


        console.log('bilanGlobal',bilanGlobal.toString())
        return
        

        //console.log('bilanGlobal',bilanGlobal)





    }


}