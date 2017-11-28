module mathis {


    export module polymer {


        export function start() {



            var mathisFrame = new mathis.MathisFrame();
            var interpolationStyle = geometry.InterpolationStyle.none;
            var chainSize = 50;
            var dims = 3;
            var mamesh = new mathis.Mamesh();



            //
            // for (var i = 0; i < dims; i++) {
            //     ALLcoordinates[i] = [];
            //     for (var j = 0; j < chainSize; j++) {
            //         ALLcoordinates[i][j] = 0;
            //     }
            // }


            /**check if a raw belong to a matrix*/
            function contains(points: XYZ[], onePoint: XYZ) :boolean{
                for (let point of points){
                    if (geo.distance(point,onePoint)<0.001) {
                        return true
                    }
                }
                return false
            }

            var x = 0;
            var y = 0;
            var z = 0;
            var min = -1;
            var max = 2;
//how to initialise?

            let  ALLcoordinates: XYZ[]
            let security=1000
            let nonFinished=true
            var attempts = 0;


            while (nonFinished&&attempts<security){
                ALLcoordinates=[]
                ALLcoordinates[0]=new XYZ(x,y,z)

                for (var i = 1; i < chainSize; i++) {

                    var alea1 = Math.floor(Math.random() * (max - min)) + min;
                    var alea2 = Math.floor(Math.random() * (max - min)) + min;
                    var alea3 = Math.floor(Math.random() * (max - min)) + min;
                    cc(alea1,alea2,alea3)
                    //var alea3=0;
                    var coordinates=new XYZ(alea1,alea2,alea3).add(ALLcoordinates[i-1])

                    if (!contains(ALLcoordinates, coordinates) ) {
                        var vertex = new mathis.Vertex()
                        vertex.position=coordinates
                        ALLcoordinates.push(coordinates);
                        mamesh.vertices.push(vertex);
                    }
                    else {
                        attempts++;
                        break
                    }
                }
                nonFinished=(ALLcoordinates.length<chainSize)


            }

            if (attempts==security) logger.c('non Finished chain')



            for (var i = 1; i < mamesh.vertices.length - 1; i++) {
                mamesh.vertices[i].setTwoOppositeLinks(mamesh.vertices[i - 1], mamesh.vertices[i + 1]);
            }
            mamesh.vertices[0].setOneLink(mamesh.vertices[1]);
            mamesh.vertices[mamesh.vertices.length - 1].setOneLink(mamesh.vertices[mamesh.vertices.length - 2]);


            console.log(mamesh.toString())
            cc('ALLcoordinates',ALLcoordinates)





            // var distances = new mathis.graph.DistancesBetweenAllVertices(mamesh.vertices);
            // distances.go();
            // //distance en pas
            // mathisFrame.messageDiv.append("distance between origin and end(steps):" + distances.OUT_distance(mamesh.vertices[0], mamesh.vertices[chainSize - 1]));
            // //distance absolut
            // mathisFrame.messageDiv.append("distance between origin and end(real):" + (geo.distance(mamesh.vertices[chainSize - 1].position, mamesh.vertices[0].position)));
            //
            // /*    for (var i=0; i <chainSize; i++){
            //  mathisFrame.messageDiv.append("Coordinates :" + "("+ (ALLcoordinates[i]) +")" )
            //  }
            //  */
            // mathisFrame.messageDiv.append("Attempts before success:" + (attempts));
            // //mathisFrame.messageDiv.append("Coordinates :"+(ALLcoordinates[i]) );



            let linkViewer =new visu3d.LinksViewer(mamesh,mathisFrame.scene)
            linkViewer.go()

            let vertexViewer=new mathis.visu3d.VerticesViewer(mamesh, mathisFrame.scene)
            //vertexViewer.go();

            console.log(attempts);

            /*   //first vertex
             var verticesViewer0 = new mathis.visu3d.VerticesViewer(mamesh,mathisFrame.scene);
             verticesViewer0.vertices = mamesh.vertices[0];
             verticesViewer0.color = new mathis.Color(mathis.Color.names.blueviolet);
             verticesViewer0.go();

             //others
             var verticesViewer1 = new mathis.visu3d.VerticesViewer(mamesh,mathisFrame.scene);
             verticesViewer1.vertices = [];
             verticesViewer1.go();
             */
        }
    }
}