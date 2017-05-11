/**
 * Created by vigon on 16/12/2015.
 */
var mathis;
(function (mathis) {
    var visu3d;
    (function (visu3d) {
        var VerticesViewer = (function () {
            function VerticesViewer(mameshOrVertices, scene, positionings) {
                this.nbSegments = 32;
                /**if null, default model will be used*/
                this.meshModel = null;
                this.meshModels = null;
                this.useCloneInsteadOfInstances = false;
                this.checkCollision = false;
                this.color = mathis.color.thema.defaultVertexColor;
                this.constantRadius = null;
                /**if no constantRadius and no positioning.size is given, the radius of vertex representation is a proportion of the distance
                 * between two linked vertices*/
                this.radiusProp = 0.1;
                this.vertexToCopiedMeshes = new mathis.HashMap();
                if (mathis.deconnectViewerForTest)
                    return;
                if (mameshOrVertices instanceof mathis.Mamesh)
                    this.vertices = mameshOrVertices.vertices;
                else
                    this.vertices = mameshOrVertices;
                if (scene == null)
                    throw 'scene is null';
                else
                    this.scene = scene;
                this.positionings = positionings;
            }
            VerticesViewer.prototype.checkArgs = function () {
                if (this.vertices == null || this.vertices[0] == null)
                    cc('no vertex to draw');
            };
            VerticesViewer.prototype.go = function () {
                if (mathis.deconnectViewerForTest)
                    return;
                this.checkArgs();
                if (this.meshModel == null && this.meshModels == null) {
                    /**diameter of model : 0.5 because then, we think of radius*/
                    this.meshModel = BABYLON.Mesh.CreateSphere('', this.nbSegments, 2, this.scene);
                    this.meshModels = [this.meshModel];
                }
                else {
                    if (this.meshModels == null)
                        this.meshModels = [];
                    if (this.meshModel != null)
                        this.meshModels.push(this.meshModel);
                    for (var _i = 0, _a = this.meshModels; _i < _a.length; _i++) {
                        var mesh = _a[_i];
                        mesh.bakeCurrentTransformIntoVertices();
                    }
                }
                //if (this.material==null) this.material=new BABYLON.StandardMaterial('',this.scene)
                for (var _b = 0, _c = this.meshModels; _b < _c.length; _b++) {
                    var mesh = _c[_b];
                    if (mesh.material == null) {
                        var material = new BABYLON.StandardMaterial("", this.scene);
                        material.diffuseColor = this.color.toBABYLON_Color3();
                        mesh.material = material;
                    }
                }
                /**models are hidden*/
                for (var _d = 0, _e = this.meshModels; _d < _e.length; _d++) {
                    var mesh = _e[_d];
                    mesh.scaling = new mathis.XYZ(0, 0, 0);
                }
                if (this.positionings == null) {
                    // if (this.mamesh != null) {
                    //     logger.c('no positioning given: it is computed from mamesh')
                    //     let posi = new mameshAroundComputations.PositioningComputerForMameshVertices(this.mamesh)
                    //     this.vertexToPositioning = posi.goChanging()
                    // }
                    // else {
                    //logger.c('no positioning given: elementary positioning is compute from vertex position. This positioning is only convenient for spherical representation of vertices')
                    this.positionings = new mathis.HashMap();
                    for (var _f = 0, _g = this.vertices; _f < _g.length; _f++) {
                        var v = _g[_f];
                        var radius = void 0;
                        if (this.constantRadius == null) {
                            var minDist = Number.MAX_VALUE;
                            if (v.links.length != 0) {
                                for (var _h = 0, _j = v.links; _h < _j.length; _h++) {
                                    var li = _j[_h];
                                    var d = mathis.geo.distance(v.position, li.to.position);
                                    if (d < minDist)
                                        minDist = d;
                                }
                            }
                            else {
                                for (var _k = 0, _l = this.vertices; _k < _l.length; _k++) {
                                    var other = _l[_k];
                                    if (!other.position.almostEqual(v.position)) {
                                        var d = mathis.geo.distance(v.position, other.position);
                                        if (d < minDist)
                                            minDist = d;
                                    }
                                }
                            }
                            radius = minDist * this.radiusProp;
                        }
                        else
                            radius = this.constantRadius;
                        var pos = new mathis.Positioning();
                        pos.frontDir = new mathis.XYZ(1, 0, 0);
                        pos.upVector = new mathis.XYZ(0, 1, 0);
                        pos.scaling = new mathis.XYZ(radius, radius, radius);
                        this.positionings.putValue(v, pos);
                    }
                }
                this.buildVertexVisu();
            };
            VerticesViewer.prototype.clear = function () {
                var _this = this;
                this.vertices.forEach(function (vertex) {
                    if (_this.vertexToCopiedMeshes.getValue(vertex) != null) {
                        for (var _i = 0, _a = _this.vertexToCopiedMeshes.getValue(vertex); _i < _a.length; _i++) {
                            var mesh = _a[_i];
                            mesh.dispose();
                        }
                    }
                });
            };
            /**can also be use to rebuild a part of the visualisation */
            VerticesViewer.prototype.buildVertexVisu = function (verticesToUpdate, verticesToClear) {
                var _this = this;
                if (verticesToUpdate === void 0) { verticesToUpdate = this.vertices; }
                if (verticesToClear === void 0) { verticesToClear = []; }
                verticesToClear.forEach(function (vertex) {
                    if (_this.vertexToCopiedMeshes.getValue(vertex) != null) {
                        for (var _i = 0, _a = _this.vertexToCopiedMeshes.getValue(vertex); _i < _a.length; _i++) {
                            var mesh = _a[_i];
                            mesh.dispose();
                        }
                    }
                    _this.vertexToCopiedMeshes.removeKey(vertex);
                });
                verticesToUpdate.forEach(function (vertex) {
                    var copiedMeshes = [];
                    if (_this.useCloneInsteadOfInstances) {
                        for (var _i = 0, _a = _this.meshModels; _i < _a.length; _i++) {
                            var mesh = _a[_i];
                            copiedMeshes.push(mesh.clone(''));
                        }
                    }
                    else {
                        for (var _b = 0, _c = _this.meshModels; _b < _c.length; _b++) {
                            var mesh = _c[_b];
                            copiedMeshes.push(mesh.createInstance(''));
                        }
                    }
                    for (var _d = 0, copiedMeshes_1 = copiedMeshes; _d < copiedMeshes_1.length; _d++) {
                        var mesh = copiedMeshes_1[_d];
                        mesh.checkCollisions = _this.checkCollision;
                        if (_this.parentNode != null)
                            mesh.parent = _this.parentNode;
                    }
                    if (_this.vertexToCopiedMeshes.getValue(vertex) != null) {
                        for (var _e = 0, _f = _this.vertexToCopiedMeshes.getValue(vertex); _e < _f.length; _e++) {
                            var mesh = _f[_e];
                            mesh.dispose();
                        }
                    }
                    _this.vertexToCopiedMeshes.putValue(vertex, copiedMeshes);
                    _this.updatePositioning(vertex);
                });
            };
            /**can also be used to modify a part of the visualisation*/
            VerticesViewer.prototype.updatePositionings = function (vertice) {
                var _this = this;
                if (vertice === void 0) { vertice = this.vertices; }
                vertice.forEach(function (v) { return _this.updatePositioning(v); });
            };
            VerticesViewer.prototype.updatePositioning = function (vertex) {
                var position = mathis.XYZ.newFrom(vertex.position);
                for (var _i = 0, _a = this.vertexToCopiedMeshes.getValue(vertex); _i < _a.length; _i++) {
                    var mesh = _a[_i];
                    if (this.positionings.getValue(vertex) == null)
                        throw "a vertex without associated positioning";
                    if (Math.abs(this.positionings.getValue(vertex).scaling.x) < mathis.geo.epsilon) {
                        mesh.visibility = 0;
                    }
                    else {
                        mesh.visibility = 1;
                        mesh.rotationQuaternion = this.positionings.getValue(vertex).quaternion();
                        mesh.position = position;
                        mesh.scaling = this.positionings.getValue(vertex).scaling;
                    }
                }
            };
            return VerticesViewer;
        }());
        visu3d.VerticesViewer = VerticesViewer;
        var SurfaceViewer = (function () {
            function SurfaceViewer(mamesh, scene) {
                //(IN_mamesh:Mamesh, scene:BABYLON.Scene, options?: {  sideOrientation?: number }, name='rectangleWithDifferentsParameters')
                this.parentNode = null;
                this.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                this.normalDuplication = NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr; //SurfaceVisuStatic.NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr
                this.maxAngleBetweenNormals = Math.PI / 4;
                this.color = mathis.color.thema.defaultSurfaceColor;
                this.alpha = 0.4;
                this.backFaceCulling = true;
                this.mamesh = mamesh;
                this.scene = scene;
            }
            SurfaceViewer.prototype.checkArgs = function () {
                if (this.scene == null)
                    throw 'the scene must but not null';
            };
            SurfaceViewer.prototype.go = function () {
                if (mathis.deconnectViewerForTest)
                    return;
                var positions = [];
                var uvs = [];
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    positions.push(v.position.x, v.position.y, v.position.z);
                }
                var hashToIndex = [];
                for (var index = 0; index < this.mamesh.vertices.length; index++)
                    hashToIndex[this.mamesh.vertices[index].hashNumber] = index;
                var indices = [];
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    var v0 = this.mamesh.smallestTriangles[i];
                    var v1 = this.mamesh.smallestTriangles[i + 1];
                    var v2 = this.mamesh.smallestTriangles[i + 2];
                    indices.push(hashToIndex[v0.hashNumber], hashToIndex[v1.hashNumber], hashToIndex[v2.hashNumber]);
                }
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    var v0 = this.mamesh.smallestSquares[i];
                    var v1 = this.mamesh.smallestSquares[i + 1];
                    var v2 = this.mamesh.smallestSquares[i + 2];
                    var v3 = this.mamesh.smallestSquares[i + 3];
                    indices.push(hashToIndex[v0.hashNumber], hashToIndex[v1.hashNumber], hashToIndex[v3.hashNumber]);
                    indices.push(hashToIndex[v1.hashNumber], hashToIndex[v2.hashNumber], hashToIndex[v3.hashNumber]);
                }
                var normalsOfTriangles = this.computeOneNormalPerTriangle(positions, indices);
                var normalsOfVertices = this.computeVertexNormalFromTrianglesNormal(positions, indices, normalsOfTriangles);
                /**must be done after the normal computations*/
                this._ComputeSides(this.sideOrientation, positions, indices, normalsOfVertices, uvs);
                var vertexData = new BABYLON.VertexData();
                vertexData.indices = indices;
                vertexData.positions = positions;
                vertexData.normals = normalsOfVertices;
                vertexData.uvs = uvs;
                var mesh = new BABYLON.Mesh('', this.scene);
                vertexData.applyToMesh(mesh);
                if (this.parentNode != null)
                    mesh.parent = this.parentNode;
                if (this.material == null) {
                    var material = new BABYLON.StandardMaterial('', this.scene);
                    material.diffuseColor = this.color.toBABYLON_Color3();
                    this.material = material;
                    /**put backFaceCulling=false if you want to allow clik on both sides*/
                    this.material.backFaceCulling = this.backFaceCulling;
                    if (!this.backFaceCulling)
                        mathis.logger.c("backFaceCulling is desactivate on this mamesh.");
                    this.material.sideOrientation = BABYLON.Mesh.BACKSIDE;
                    material.alpha = this.alpha;
                }
                mesh.material = this.material;
                return mesh;
                //if (this.scene!=null){
                //
                //    if (this.material==null) {
                //        this.material=new BABYLON.StandardMaterial("mat1", this.scene);
                //        this.material.alpha = this.alpha;
                //        this.material.diffuseColor = new BABYLON.Color3(1,0.2,0.2)
                //        this.material.backFaceCulling = true
                //    }
                //
                //
                //    let babMesh = new BABYLON.Mesh(name, this.scene)
                //    vertexData.applyToMesh(babMesh)
                //    babMesh.material=this.material
                //
                //
                //
                //}
            };
            SurfaceViewer.prototype._ComputeSides = function (sideOrientation, positions, indices, normals, uvs) {
                var li = indices.length;
                var ln = normals.length;
                var i;
                var n;
                sideOrientation = sideOrientation || BABYLON.Mesh.DEFAULTSIDE;
                switch (sideOrientation) {
                    case BABYLON.Mesh.FRONTSIDE:
                        // nothing changed
                        break;
                    case BABYLON.Mesh.BACKSIDE:
                        var tmp;
                        // indices
                        for (i = 0; i < li; i += 3) {
                            tmp = indices[i];
                            indices[i] = indices[i + 2];
                            indices[i + 2] = tmp;
                        }
                        // normals
                        for (n = 0; n < ln; n++) {
                            normals[n] = -normals[n];
                        }
                        break;
                    case BABYLON.Mesh.DOUBLESIDE:
                        // positions
                        var lp = positions.length;
                        var l = lp / 3;
                        for (var p = 0; p < lp; p++) {
                            positions[lp + p] = positions[p];
                        }
                        // indices
                        for (i = 0; i < li; i += 3) {
                            indices[i + li] = indices[i + 2] + l;
                            indices[i + 1 + li] = indices[i + 1] + l;
                            indices[i + 2 + li] = indices[i] + l;
                        }
                        // normals
                        for (n = 0; n < ln; n++) {
                            normals[ln + n] = -normals[n];
                        }
                        // uvs
                        var lu = uvs.length;
                        for (var u = 0; u < lu; u++) {
                            uvs[u + lu] = uvs[u];
                        }
                        break;
                }
            };
            SurfaceViewer.prototype.computeOneNormalPerTriangle = function (positions, indices) {
                var res = [];
                var p1p2x = 0.0;
                var p1p2y = 0.0;
                var p1p2z = 0.0;
                var p3p2x = 0.0;
                var p3p2y = 0.0;
                var p3p2z = 0.0;
                var faceNormalx = 0.0;
                var faceNormaly = 0.0;
                var faceNormalz = 0.0;
                var length = 0.0;
                var i1 = 0;
                var i2 = 0;
                var i3 = 0;
                // indice triplet = 1 face
                var nbFaces = indices.length / 3;
                for (var index = 0; index < nbFaces; index++) {
                    i1 = indices[index * 3]; // get the indexes of each vertex of the face
                    i2 = indices[index * 3 + 1];
                    i3 = indices[index * 3 + 2];
                    p1p2x = positions[i1 * 3] - positions[i2 * 3]; // compute two vectors per face
                    p1p2y = positions[i1 * 3 + 1] - positions[i2 * 3 + 1];
                    p1p2z = positions[i1 * 3 + 2] - positions[i2 * 3 + 2];
                    p3p2x = positions[i3 * 3] - positions[i2 * 3];
                    p3p2y = positions[i3 * 3 + 1] - positions[i2 * 3 + 1];
                    p3p2z = positions[i3 * 3 + 2] - positions[i2 * 3 + 2];
                    faceNormalx = p1p2y * p3p2z - p1p2z * p3p2y; // compute the face normal with cross product
                    faceNormaly = p1p2z * p3p2x - p1p2x * p3p2z;
                    faceNormalz = p1p2x * p3p2y - p1p2y * p3p2x;
                    length = Math.sqrt(faceNormalx * faceNormalx + faceNormaly * faceNormaly + faceNormalz * faceNormalz);
                    length = (length === 0) ? 1.0 : length;
                    faceNormalx /= length; // normalize this normal
                    faceNormaly /= length;
                    faceNormalz /= length;
                    res[index] = new mathis.XYZ(faceNormalx, faceNormaly, faceNormalz);
                }
                return res;
            };
            SurfaceViewer.prototype.computeVertexNormalFromTrianglesNormal = function (positions, indices, triangleNormals) {
                var _this = this;
                var positionNormals = [];
                //for (let i=0;i<lengthPosition;i++) res[i]=0
                for (var k = 0; k < positions.length / 3; k++)
                    positionNormals[k] = new mathis.XYZ(0, 0, 0);
                if (this.normalDuplication == NormalDuplication.none) {
                    for (var k = 0; k < indices.length; k += 3) {
                        var triangleIndex = Math.floor(k / 3);
                        positionNormals[indices[k]].add(triangleNormals[triangleIndex]);
                        positionNormals[indices[k + 1]].add(triangleNormals[triangleIndex]);
                        positionNormals[indices[k + 2]].add(triangleNormals[triangleIndex]);
                    }
                    positionNormals.forEach(function (v) {
                        v.normalize();
                    });
                }
                else if (this.normalDuplication == NormalDuplication.duplicateVertex || this.normalDuplication == NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr) {
                    var oneStep = function (vertexNormal, triangleNormal, posX, posY, posZ, indexInIndices) {
                        if (_this.normalDuplication == NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr) {
                            if (mathis.geo.xyzAlmostZero(vertexNormal) || mathis.geo.xyzAlmostZero(triangleNormal) || mathis.geo.angleBetweenTwoVectorsBetween0andPi(vertexNormal, triangleNormal) < _this.maxAngleBetweenNormals) {
                                vertexNormal.add(triangleNormal);
                            }
                            else {
                                var newIndex = positions.length / 3;
                                positions.push(posX, posY, posZ);
                                indices[indexInIndices] = newIndex;
                                positionNormals.push(triangleNormal);
                            }
                        }
                        else {
                            var newIndex = positions.length / 3;
                            positions.push(posX, posY, posZ);
                            indices[indexInIndices] = newIndex;
                            positionNormals.push(triangleNormal);
                        }
                    };
                    for (var k = 0; k < indices.length; k += 3) {
                        var triangleIndex = Math.floor(k / 3);
                        var positionIndex = indices[k];
                        oneStep(positionNormals[positionIndex], triangleNormals[triangleIndex], positions[3 * positionIndex], positions[3 * positionIndex + 1], positions[3 * positionIndex + 2], k);
                        positionIndex = indices[k + 1];
                        oneStep(positionNormals[positionIndex], triangleNormals[triangleIndex], positions[3 * positionIndex], positions[3 * positionIndex + 1], positions[3 * positionIndex + 2], k + 1);
                        positionIndex = indices[k + 2];
                        oneStep(positionNormals[positionIndex], triangleNormals[triangleIndex], positions[3 * positionIndex], positions[3 * positionIndex + 1], positions[3 * positionIndex + 2], k + 2);
                    }
                }
                else
                    throw 'wtf';
                var res = [];
                positionNormals.forEach(function (v) {
                    res.push(v.x, v.y, v.z);
                });
                return res;
            };
            return SurfaceViewer;
        }());
        visu3d.SurfaceViewer = SurfaceViewer;
        (function (NormalDuplication) {
            NormalDuplication[NormalDuplication["none"] = 0] = "none";
            NormalDuplication[NormalDuplication["duplicateOnlyWhenNormalsAreTooFarr"] = 1] = "duplicateOnlyWhenNormalsAreTooFarr";
            NormalDuplication[NormalDuplication["duplicateVertex"] = 2] = "duplicateVertex";
        })(visu3d.NormalDuplication || (visu3d.NormalDuplication = {}));
        var NormalDuplication = visu3d.NormalDuplication;
        var LinksViewer = (function () {
            function LinksViewer(mamesh, scene) {
                //lineRadius=0.05
                this.lateralScalingConstant = null;
                this.lateralScalingProp = 0.05;
                this.tesselation = 12;
                this.material = null;
                this.color = mathis.color.thema.defaultLinkColor;
                this.res = [];
                this.pairVertexToLateralDirection = null;
                /**if null (default) all segments will be drawn*/
                this.segmentOrientationFunction = null;
                this.clonesInsteadOfInstances = false;
                this.checkCollision = true;
                this.barycenter = null;
                this.middle = new mathis.XYZ(0, 0, 0);
                this.mamesh = mamesh;
                this.scene = scene;
            }
            LinksViewer.prototype.checkArgs = function () {
                if (this.scene == null)
                    throw 'scene is null';
                if (this.mamesh.vertices.length == 0)
                    cc('your IN_mamesh has no vertex');
            };
            LinksViewer.prototype.go = function () {
                if (mathis.deconnectViewerForTest)
                    return;
                this.checkArgs();
                //if (this.IN_mamesh.loopLines==null && this.IN_mamesh.straightLines==null) this.IN_mamesh.fillLineCatalogue()
                if (this.meshModel == null) {
                    if (this.material == null) {
                        this.material = new BABYLON.StandardMaterial('', this.scene);
                        this.material.diffuseColor = this.color.toBABYLON_Color3();
                    }
                    this.meshModel = BABYLON.Mesh.CreateCylinder('', 1, 1, 1, this.tesselation, 5, this.scene);
                    this.meshModel.material = this.material;
                }
                /**we hide the model*/
                this.meshModel.scaling = new mathis.XYZ(0, 0, 0);
                if (this.lateralScalingConstant == null) {
                    var distance = 0;
                    var nbVerticesWithLinks = 0;
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (v.links.length != 0) {
                            var minDist = Number.MAX_VALUE;
                            for (var _b = 0, _c = v.links; _b < _c.length; _b++) {
                                var li = _c[_b];
                                var d = mathis.geo.distance(v.position, li.to.position);
                                if (d < minDist)
                                    minDist = d;
                            }
                            distance += minDist;
                            nbVerticesWithLinks++;
                        }
                    }
                    distance /= nbVerticesWithLinks;
                    this.lateralScalingConstant = distance * this.lateralScalingProp;
                }
                var alreadyDraw = new mathis.StringMap();
                for (var _d = 0, _e = this.mamesh.vertices; _d < _e.length; _d++) {
                    var vertex = _e[_d];
                    for (var _f = 0, _g = vertex.links; _f < _g.length; _f++) {
                        var link = _g[_f];
                        var key = mathis.tab.indicesUpPermutationToString([vertex.hashNumber, link.to.hashNumber]);
                        if (alreadyDraw.getValue(key) == null) {
                            this.drawOneLink(vertex, link.to);
                            alreadyDraw.putValue(key, true);
                        }
                    }
                }
                return this.res;
            };
            LinksViewer.prototype.drawOneLink = function (beginVertex, endVertex) {
                if (this.segmentOrientationFunction != null) {
                    if (this.segmentOrientationFunction(beginVertex, endVertex) == 0)
                        return;
                    if (this.segmentOrientationFunction(beginVertex, endVertex) < 0) {
                        var temp = beginVertex;
                        beginVertex = endVertex;
                        endVertex = temp;
                    }
                }
                var segment;
                if (this.clonesInsteadOfInstances)
                    segment = this.meshModel.clone('');
                else
                    segment = this.meshModel.createInstance('');
                segment.checkCollisions = this.checkCollision;
                var elongateAMeshFromBeginToEnd = new ElongateAMeshFromBeginToEnd(beginVertex.position, endVertex.position, segment);
                elongateAMeshFromBeginToEnd.lateralScaling = this.lateralScalingConstant;
                if (this.pairVertexToLateralDirection != null) {
                    elongateAMeshFromBeginToEnd.lateralDirection = this.pairVertexToLateralDirection(beginVertex, endVertex);
                }
                else {
                    if (this.barycenter == null) {
                        this.barycenter = new mathis.XYZ(0, 0, 0);
                        for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                            var v = _a[_i];
                            this.barycenter.add(v.position);
                        }
                        this.barycenter.scale(1 / this.mamesh.vertices.length);
                    }
                    this.middle.copyFrom(beginVertex.position).add(endVertex.position).scale(0.5);
                    this.middle.substract(this.barycenter);
                    elongateAMeshFromBeginToEnd.lateralDirection.copyFrom(this.middle);
                }
                elongateAMeshFromBeginToEnd.goChanging();
                if (this.parentNode != null)
                    segment.parent = this.parentNode;
                this.res.push(segment);
            };
            return LinksViewer;
        }());
        visu3d.LinksViewer = LinksViewer;
        var LinesViewer = (function () {
            function LinesViewer(mameshOrLines, scene) {
                /**only useful to compute  a  line-radius which is proportional to the mean-vertex-spacing*/
                this.vertices = null;
                this.doNotDrawLinesContainingOnlyInvisibleVertices = true;
                /**priority 1*/
                this.color = null;
                /**priority 2*/
                this.lineToColor = null;
                /**priority 3*/
                this.lineToLevel = null;
                this.levelPropToColorFunc = function (prop) { return new mathis.Color(new mathis.HSV_01(prop * 0.7, 1, 0.8)); };
                this.cap = BABYLON.Mesh.NO_CAP;
                this.tesselation = 10;
                /**if null, no interpolation*/
                this.interpolationOption = new mathis.geometry.InterpolationOption();
                this.isThin = false;
                this.constantRadius = null;
                this.radiusProp = 0.05;
                this.radiusFunction = null;
                this.res = [];
                if (mameshOrLines instanceof mathis.Mamesh) {
                    var mamesh = mameshOrLines;
                    if (!mamesh.linesWasMade)
                        mamesh.fillLineCatalogue();
                    this.lines = mamesh.lines;
                }
                else {
                    this.lines = mameshOrLines;
                }
                this.scene = scene;
            }
            //
            // static directionnalLineSelector=(nbExceptionAllowed:number,direction:Direction)=>{
            //     return (index: number,line:Vertex[])=>{
            //         let referenceParam=line[0].param
            //         let exceptionCount=0
            //         for (let vertex of line){
            //             if (vertex.param==null) throw 'no param, we can not see vertical lines'
            //
            //             let a,b=-1
            //             if (direction==Direction.vertical){
            //                 a=vertex.param.x
            //                 b=referenceParam.x
            //             }
            //             else if (direction==Direction.horizontal){
            //                 a=vertex.param.y
            //                 b=referenceParam.y
            //             }
            //             else throw 'not yet done'
            //
            //             cc(referenceParam,vertex.param)
            //             if (! geo.almostEquality(a,b)) {
            //                 exceptionCount++
            //                 referenceParam=vertex.param
            //             }
            //             if (exceptionCount>nbExceptionAllowed) {
            //                 cc('false')
            //                 return false
            //             }
            //         }
            //         return (exceptionCount<=nbExceptionAllowed)
            //     }
            // }
            LinesViewer.prototype.go = function () {
                /**even when viewer is de-connected, we can use lineToColor during test*/
                this.buildLineToColor();
                if (mathis.deconnectViewerForTest)
                    return;
                if (this.scene == null)
                    throw 'scene is null';
                /**OLD: very small rotation because of a bug of babylon : Some strictly vertical lines disappear
                 * */
                //new spacialTransformations.Similitude(this.mamesh.vertices,0.0001).goChanging()
                for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                    var line = _a[_i];
                    if (this.lineToColor.getValue(line) != null)
                        this.drawOneLine(line);
                }
                return this.res;
            };
            LinesViewer.prototype.clear = function () {
                for (var _i = 0, _a = this.res; _i < _a.length; _i++) {
                    var mesh = _a[_i];
                    mesh.dispose();
                }
            };
            LinesViewer.prototype.buildLineToColor = function () {
                /**priority 1*/
                if (this.color != null) {
                    this.lineToColor = new mathis.HashMap();
                    for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                        var line = _a[_i];
                        this.lineToColor.putValue(line, this.color);
                    }
                    return;
                }
                /**priority 2*/
                if (this.lineToColor != null)
                    return;
                /**priority 3*/
                /**nothing is specified. The level is the index of the line*/
                if (this.lineToLevel == null) {
                    this.lineToLevel = new mathis.HashMap();
                    for (var i = 0; i < this.lines.length; i++)
                        this.lineToLevel.putValue(this.lines[i], i);
                }
                /**from level to color*/
                var max = mathis.tab.maxValue(this.lineToLevel.allValues());
                var min = mathis.tab.minValue(this.lineToLevel.allValues());
                this.lineToColor = new mathis.HashMap();
                for (var _b = 0, _c = this.lines; _b < _c.length; _b++) {
                    var line = _c[_b];
                    var value = this.lineToLevel.getValue(line);
                    if (value != null) {
                        var prop = (value - min) / (max - min);
                        this.lineToColor.putValue(line, this.levelPropToColorFunc(prop));
                    }
                    else
                        this.lineToColor.putValue(line, null);
                }
            };
            LinesViewer.prototype.drawOneLine = function (line) {
                var path = [];
                var onlyInvisible = true;
                line.vertices.forEach(function (v) {
                    path.push(v.position);
                    if (!v.isInvisible)
                        onlyInvisible = false;
                });
                if (onlyInvisible && this.doNotDrawLinesContainingOnlyInvisibleVertices)
                    return;
                var mesh = this.drawOnePath(line, path);
                this.res.push(mesh);
            };
            LinesViewer.prototype.drawOnePath = function (line, path) {
                var _this = this;
                var res;
                var smoothPath;
                if (this.interpolationOption != null && this.interpolationOption.interpolationStyle != mathis.geometry.InterpolationStyle.none) {
                    var lineInterpoler = new mathis.geometry.LineInterpoler(path);
                    lineInterpoler.options = this.interpolationOption;
                    if (line.isLoop)
                        lineInterpoler.options.loopLine = true;
                    smoothPath = lineInterpoler.go();
                }
                else {
                    smoothPath = path;
                    if (line.isLoop)
                        smoothPath.push(path[0]);
                }
                path = smoothPath;
                var color = this.lineToColor.getValue(line).toBABYLON_Color3();
                if (this.isThin) {
                    var aa = BABYLON.Mesh.CreateLines('', path, this.scene);
                    aa.color = color;
                    res = aa;
                }
                else {
                    var modifiedFunction = null;
                    if (this.radiusFunction != null) {
                        var pathTotalLength_1 = 0;
                        for (var i = 0; i < path.length - 1; i++) {
                            pathTotalLength_1 += mathis.geo.distance(path[i], path[i + 1]);
                        }
                        modifiedFunction = function (ind, alphaProp) { return _this.radiusFunction(ind, alphaProp / pathTotalLength_1); };
                        res = BABYLON.Mesh.CreateTube('', path, null, this.tesselation, modifiedFunction, this.cap, this.scene, true, BABYLON.Mesh.FRONTSIDE);
                    }
                    else {
                        if (this.constantRadius == null) {
                            var totalLength = 0;
                            var nbVertices = 0;
                            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                                var line_1 = _a[_i];
                                for (var i = 0; i < line_1.vertices.length - 1; i++) {
                                    totalLength += mathis.geo.distance(line_1.vertices[i].position, line_1.vertices[i + 1].position);
                                    nbVertices++;
                                }
                            }
                            this.constantRadius = totalLength / nbVertices * this.radiusProp;
                        }
                        res = BABYLON.Mesh.CreateTube('', path, this.constantRadius, this.tesselation, null, this.cap, this.scene, true, BABYLON.Mesh.FRONTSIDE);
                    }
                }
                var material = new BABYLON.StandardMaterial('', this.scene);
                material.diffuseColor = color;
                res.material = material;
                if (this.parentNode != null)
                    res.parent = this.parentNode;
                return res;
            };
            return LinesViewer;
        }());
        visu3d.LinesViewer = LinesViewer;
        //
        // class OneLineVisuMaker {
        //
        //     private path:XYZ[]
        //    
        //     isLoop:boolean
        //     babMesh:BABYLON.Mesh
        //     parentNode:BABYLON.Node
        //    
        //     constructor(path:XYZ[],isLoop:boolean,scene:BABYLON.Scene){
        //        
        //         this.scene=scene
        //         this.path=path
        //         this.isLoop=isLoop
        //        
        //     }
        //
        //    
        //
        //
        //
        // }
        var ElongateAMeshFromBeginToEnd = (function () {
            function ElongateAMeshFromBeginToEnd(begin, end, originalMesh) {
                this.lateralScaling = 0.05;
                /**if the orignal is a round-cylinder, this do not change nothing*/
                this.lateralDirection = new mathis.XYZ(0, 0, 1);
                this.yAxis = new mathis.XYZ(0, 1, 0);
                this.zAxis = new mathis.XYZ(0, 0, 1);
                this.direction = new mathis.XYZ(0, 0, 0);
                this.nothing = new mathis.XYZ(0, 0, 0);
                this.begin = begin;
                this.end = end;
                this.modelMesh = originalMesh;
            }
            ElongateAMeshFromBeginToEnd.prototype.goChanging = function () {
                this.direction.copyFrom(this.end).substract(this.begin);
                var length = this.direction.length();
                this.direction.normalize();
                var middle = new mathis.XYZ(0, 0, 0);
                middle.add(this.begin).add(this.end).scale(0.5);
                this.modelMesh.scaling = new mathis.XYZ(this.lateralScaling, length, this.lateralScaling);
                this.modelMesh.position = middle;
                var anOrtho = new mathis.XYZ(0, 0, 0);
                var copyOfLateralDirection = new mathis.XYZ(0, 0, 0);
                mathis.geo.cross(this.direction, this.lateralDirection, this.nothing);
                if (this.nothing.lengthSquared() < mathis.geo.epsilon)
                    copyOfLateralDirection.copyFromFloats(Math.random(), Math.random(), Math.random());
                else
                    copyOfLateralDirection.copyFrom(this.lateralDirection);
                mathis.geo.orthonormalizeKeepingFirstDirection(this.direction, copyOfLateralDirection, this.nothing, anOrtho);
                var quat = new mathis.XYZW(0, 0, 0, 0);
                mathis.geo.aQuaternionMovingABtoCD(this.yAxis, this.zAxis, this.direction, anOrtho, quat, true);
                this.modelMesh.rotationQuaternion = quat;
                return this.modelMesh;
            };
            return ElongateAMeshFromBeginToEnd;
        }());
        visu3d.ElongateAMeshFromBeginToEnd = ElongateAMeshFromBeginToEnd;
    })(visu3d = mathis.visu3d || (mathis.visu3d = {}));
})(mathis || (mathis = {}));
