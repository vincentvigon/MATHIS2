/**
 * Created by vigon on 30/11/2015.
 */
var mathis;
(function (mathis) {
    function geometryTest() {
        var bilanGeo = new mathis.Bilan();
        // {
        //
        //     let v0=new XYZ(0,0,0)
        //     let v1=new XYZ(0,2,0)
        //     let temps=new XYZ(0,0,0)
        //     geo.cross(v0,v1,temps)
        //     console.log(temps)
        //
        // }
        {
            var v0 = new mathis.XYZ(1, 0, 0);
            var v1 = new mathis.XYZ(10, 0, 0);
            var v2 = new mathis.XYZ(-10, 0, 0);
            bilanGeo.assertTrue(mathis.geo.almostParallel(v0, v1, true));
            bilanGeo.assertTrue(mathis.geo.almostParallel(v0, v2, true));
            bilanGeo.assertTrue(!mathis.geo.almostParallel(v0, v2, false));
            var creator = new mathis.polyhedron.Polyhedron("cube");
            var mamesh = creator.go();
            var count100 = 0;
            var count010 = 0;
            var count001 = 0;
            for (var _i = 0, _a = mamesh.segments; _i < _a.length; _i++) {
                var segment = _a[_i];
                var dir = mathis.XYZ.newFrom(segment[0].position).substract(segment[1].position);
                if (mathis.geo.almostParallel(dir, new mathis.XYZ(1, 0, 0), true, 0.001))
                    count100++;
                if (mathis.geo.almostParallel(dir, new mathis.XYZ(0, 1, 0)))
                    count010++;
                if (mathis.geo.almostParallel(dir, new mathis.XYZ(0, 0, 1)))
                    count001++;
            }
            bilanGeo.assertTrue(count100 == 4);
            bilanGeo.assertTrue(count010 == 4);
            bilanGeo.assertTrue(count001 == 4);
        }
        {
            var originIN = new mathis.XYZ(0, 0, 0);
            var endIN = new mathis.XYZ(2, 2, 0);
            var originOUT = new mathis.XYZ(0, 0, 0);
            var endOUT = new mathis.XYZ(0.5, 0.5, 0);
            var affine = mathis.geo.affineTransformGenerator(originIN, endIN, originOUT, endOUT);
            var res = new mathis.XYZ(0, 0, 0);
            affine(new mathis.XYZ(4, 4, 0), res);
            affine(res, res);
            bilanGeo.assertTrue(res.almostEqual(new mathis.XYZ(0.25, 0.25, 0)));
        }
        {
            var originIN = new mathis.XYZ(1, 1, 0);
            var endIN = new mathis.XYZ(2, 2, 0);
            var originOUT = new mathis.XYZ(-1, -1, 0);
            var endOUT = new mathis.XYZ(0.5, 0.5, 0);
            var affine = mathis.geo.affineTransformGenerator(originIN, endIN, originOUT, endOUT);
            var affineInv = mathis.geo.affineTransformGenerator(originOUT, endOUT, originIN, endIN);
            var res = new mathis.XYZ(0, 0, 0);
            affine(new mathis.XYZ(4, 4, 0), res);
            affineInv(res, res);
            bilanGeo.assertTrue(res.almostEqual(new mathis.XYZ(4, 4, 0)));
        }
        var xAxis = mathis.XYZ.newZero();
        var yAxis = mathis.XYZ.newZero();
        var zAxis = mathis.XYZ.newZero();
        xAxis.x = 1;
        yAxis.y = 1;
        zAxis.z = 1;
        var diag = mathis.XYZ.newZero();
        diag.x = 1;
        diag.y = 1;
        {
            var theta = Math.random() * 10;
            var mat = mathis.MM.newZero();
            mathis.geo.axisAngleToMatrix(zAxis, theta, mat);
            var matInv = mathis.MM.newZero();
            mathis.geo.axisAngleToMatrix(zAxis, -theta, matInv);
            bilanGeo.assertTrue(mathis.MM.newFrom(mat).inverse().almostEqual(matInv));
            var other = mathis.XYZ.newZero();
            mathis.geo.orthonormalizeKeepingFirstDirection(xAxis, diag, other, diag);
            bilanGeo.assertTrue(other.almostEqual(xAxis) && diag.almostEqual(yAxis));
            var aaa = mathis.MM.newRandomMat();
            bilanGeo.assertTrue(mathis.MM.newFrom(aaa).transpose().transpose().almostEqual(aaa));
            var rotMatrix = mathis.MM.newZero();
            var rotMatrixMinus = mathis.MM.newZero();
            var angle = Math.random() * 2 * Math.PI;
            var axis = mathis.XYZ.newRandom();
            mathis.geo.axisAngleToMatrix(axis, angle, rotMatrix);
            mathis.geo.axisAngleToMatrix(axis, -angle, rotMatrixMinus);
            bilanGeo.assertTrue(mathis.MM.newFrom(rotMatrix).transpose().almostEqual(rotMatrixMinus));
            bilanGeo.assertTrue(mathis.MM.newFrom(rotMatrix).inverse().almostEqual(rotMatrixMinus));
        }
        /**axisAngle <-> quaternion <-> rotation matrix*/
        {
            var nb = 10;
            var quat = new mathis.XYZW(0, 0, 0, 0);
            var quat2 = new mathis.XYZW(0, 0, 0, 0);
            var matQua = mathis.MM.newZero();
            var matQua2 = mathis.MM.newZero();
            var otherMatQua = mathis.MM.newZero();
            for (var i = 0; i <= nb; i++) {
                var axisForQuat = mathis.XYZ.newRandom().normalize();
                var theta = i * Math.PI * 2 / nb;
                mathis.geo.axisAngleToQuaternion(axisForQuat, theta, quat);
                mathis.geo.quaternionToMatrix(quat, matQua);
                mathis.geo.matrixToQuaternion(matQua, quat2);
                mathis.geo.quaternionToMatrix(quat2, matQua2);
                bilanGeo.assertTrue(mathis.geo.almostLogicalEqual(quat, quat2));
                bilanGeo.assertTrue(matQua.almostEqual(matQua2));
                mathis.geo.axisAngleToMatrix(axisForQuat, theta, otherMatQua);
                bilanGeo.assertTrue(otherMatQua.almostEqual(matQua));
            }
        }
        var ve = mathis.XYZ.newRandom();
        var veCopy = mathis.XYZ.newZero().copyFrom(ve);
        var ve2 = mathis.XYZ.newRandom();
        bilanGeo.assertTrue(ve.add(ve2).add(ve2.scale(-1)).almostEqual(veCopy));
        /**we rotate a basis, checking cross product, anglesComputation */
        var vv = mathis.XYZ.newZero();
        mathis.geo.cross(xAxis, yAxis, vv);
        bilanGeo.assertTrue(vv.almostEqual(zAxis));
        var xBase = mathis.XYZ.newFrom(xAxis);
        var yBase = mathis.XYZ.newFrom(yAxis);
        var zBase = mathis.XYZ.newFrom(zAxis);
        diag.x = 1;
        diag.y = 1;
        diag.z = 0;
        bilanGeo.assertTrue(mathis.geo.almostEquality(mathis.geo.angleBetweenTwoVectorsBetween0andPi(xAxis, diag), Math.PI / 4));
        bilanGeo.assertTrue(mathis.geo.almostEquality(mathis.geo.angleBetweenTwoVectorsBetween0andPi(yAxis, diag), Math.PI / 4));
        bilanGeo.assertTrue(mathis.geo.almostEquality(mathis.geo.angleBetweenTwoVectorsBetween0andPi(mathis.XYZ.newFrom(xAxis).scale(-1), diag), 3 * Math.PI / 4));
        //let angle=2*Math.PI/nb*i
        //let axx=new XYZ(0,0,1)
        //let Rot=MM.newZero()
        //geo.axisAngleToMatrix(axx,angle,Rot)
        //let xAxRot=XYZ.newFrom(xAxis)
        //geo.multiplicationMatrixVector(randRot,xBase,xBase)
        //
        //
        //return bilanGeo
        {
            var nb = 10;
            for (var i = 0; i < nb; i++) {
                var angle = 2 * Math.PI / nb * i * 12;
                var randAxis = mathis.XYZ.newRandom().normalize();
                var randRot = mathis.MM.newZero();
                mathis.geo.axisAngleToMatrix(randAxis, angle, randRot);
                mathis.geo.multiplicationMatrixVector(randRot, xAxis, xBase);
                mathis.geo.multiplicationMatrixVector(randRot, yAxis, yBase);
                mathis.geo.multiplicationMatrixVector(randRot, zAxis, zBase);
                bilanGeo.assertTrue(mathis.geo.almostEquality(mathis.geo.dot(xBase, yBase), 0) && mathis.geo.almostEquality(mathis.geo.dot(xBase, zBase), 0) && mathis.geo.almostEquality(mathis.geo.dot(yBase, zBase), 0));
                bilanGeo.assertTrue(mathis.geo.almostEquality(1, mathis.geo.norme(xBase)) && mathis.geo.almostEquality(1, mathis.geo.norme(yBase)) && mathis.geo.almostEquality(1, mathis.geo.norme(zBase)));
                var crossXYBase = mathis.XYZ.newZero();
                mathis.geo.cross(xBase, yBase, crossXYBase);
                bilanGeo.assertTrue(crossXYBase.almostEqual(zBase));
            }
        }
        /** test of the computation of angle.
         * Be carefull :  this can be the angle is between 0 and PI*/
        {
            var nb = 10;
            for (var i = 0; i < nb; i++) {
                var angle = 2 * Math.PI / nb * i * 12;
                var randAxis = new mathis.XYZ(0, 0, 1);
                var randRot = mathis.MM.newZero();
                mathis.geo.axisAngleToMatrix(randAxis, angle, randRot);
                mathis.geo.multiplicationMatrixVector(randRot, xAxis, xBase);
                var angleModule = mathis.modulo(angle, 2 * Math.PI);
                if (angleModule > Math.PI)
                    angleModule = 2 * Math.PI - angleModule;
                bilanGeo.assertTrue(mathis.geo.almostEquality(mathis.geo.angleBetweenTwoVectorsBetween0andPi(xBase, xAxis), angleModule));
            }
            var va = mathis.XYZ.newRandom();
            var vb = mathis.XYZ.newRandom();
            var vc = mathis.XYZ.newRandom();
            var bary = mathis.XYZ.newFrom(va);
            bary.add(vb).add(vc).scale(1 / 3);
            var bary2 = mathis.XYZ.newZero();
            mathis.geo.baryCenter([va, vb, vc], [1 / 3, 1 / 3, 1 / 3], bary2);
            bilanGeo.assertTrue(bary.almostEqual(bary2));
        }
        {
            var vect0 = new mathis.XYZ(0, 0, 0);
            var vect2 = new mathis.XYZ(2, 0, 0);
            var tan0 = new mathis.XYZ(0, 1, 0);
            var tan2 = new mathis.XYZ(0, -1, 0);
            var hermite = [];
            mathis.geo.hermiteSpline(vect0, tan0, vect2, tan2, 2, hermite);
            bilanGeo.assertTrue(hermite[1].almostEqual(new mathis.XYZ(1, 0.25, 0)));
        }
        /**close XYZ finder*/
        {
            var list = [new mathis.XYZ(0, 0, 0), new mathis.XYZ(0, 0, 1), new mathis.XYZ(0, 0, 2), new mathis.XYZ(-10, 0, 0), new mathis.XYZ(0, 0, 0), new mathis.XYZ(0, 0, 1), new mathis.XYZ(0, 0, 2), new mathis.XYZ(0, 0, 0)];
            var close_1 = new mathis.geometry.CloseXYZfinder(list, null, 1000);
            var res = close_1.go();
            bilanGeo.assertTrue(JSON.stringify({ 4: 0, 5: 1, 6: 2, 7: 0 }) == JSON.stringify(res));
        }
        {
            var recepterList = [new mathis.XYZ(0, 0, 0), new mathis.XYZ(0, 0, 1), new mathis.XYZ(0, 0, 2), new mathis.XYZ(-20, 0, 0)];
            var sourceList = [new mathis.XYZ(-0.000001, 0, 0), new mathis.XYZ(0, 0, 1.000001), new mathis.XYZ(0, 0, 2), new mathis.XYZ(-10, 0, 0), new mathis.XYZ(0, 0, 2)];
            var close2 = new mathis.geometry.CloseXYZfinder(recepterList, sourceList, 1000);
            close2.nbDistinctPoint = 10000;
            var res2 = close2.go();
            bilanGeo.assertTrue(JSON.stringify({ 0: 0, 1: 1, 2: 2, 4: 2 }) == JSON.stringify(res2));
        }
        {
            var list = [new mathis.XYZ(0, 0, 0), new mathis.XYZ(1, 0, 0), new mathis.XYZ(2, 0, 0), new mathis.XYZ(3, 0, 0), new mathis.XYZ(4, 0, 0),];
            var close_2 = new mathis.geometry.CloseXYZfinder(list, null, 1000);
            close_2.deformationFunction = function (point) { var res = mathis.XYZ.newFrom(point); res.x = mathis.modulo(res.x, 2); return res; };
            var res = close_2.go();
            bilanGeo.assertTrue(JSON.stringify({ 2: 0, 3: 1, 4: 0 }) == JSON.stringify(res));
        }
        {
            var A = new mathis.XYZ(1, 0, 0);
            var B = new mathis.XYZ(0, 0, 1);
            var C = new mathis.XYZ(1, 1, 0).normalize();
            var D = new mathis.XYZ(-1, 1, 0).normalize();
            var mat = new mathis.MM();
            mathis.geo.anOrthogonalMatrixMovingABtoCD(A, B, C, D, mat, true);
            var AA = mathis.XYZ.newZero();
            var BB = mathis.XYZ.newZero();
            mathis.geo.multiplicationMatrixVector(mat, A, AA);
            mathis.geo.multiplicationMatrixVector(mat, B, BB);
            bilanGeo.assertTrue(mathis.geo.xyzAlmostEquality(C, AA) && mathis.geo.xyzAlmostEquality(D, BB));
        }
        {
            var A = mathis.XYZ.newRandom().normalize();
            var B = new mathis.XYZ(-1, 1, 0);
            mathis.geo.getOneOrthonormal(A, B);
            B.normalize();
            var C = mathis.XYZ.newRandom().normalize();
            var D = new mathis.XYZ(0, 0, 0);
            mathis.geo.getOneOrthonormal(C, D);
            D.normalize();
            var mat = new mathis.MM();
            mathis.geo.anOrthogonalMatrixMovingABtoCD(A, B, C, D, mat, true);
            var AA = mathis.XYZ.newZero();
            var BB = mathis.XYZ.newZero();
            mathis.geo.multiplicationMatrixVector(mat, A, AA);
            mathis.geo.multiplicationMatrixVector(mat, B, BB);
            bilanGeo.assertTrue(mathis.geo.xyzAlmostEquality(C, AA) && mathis.geo.xyzAlmostEquality(D, BB));
        }
        {
            var mat = new mathis.MM();
            var A = mathis.XYZ.newRandom().normalize();
            var B = new mathis.XYZ(-1, 1, 0);
            mathis.geo.getOneOrthonormal(A, B);
            B.normalize();
            var C = new mathis.XYZ(0, 0, 0);
            mathis.geo.cross(A, B, C);
            mathis.geo.matrixFromLines(A, B, C, mat);
            var qua = new mathis.XYZW(0, 0, 0, 0);
            mathis.geo.matrixToQuaternion(mat, qua);
            var mat2 = new mathis.MM();
            mathis.geo.quaternionToMatrix(qua, mat2);
            bilanGeo.assertTrue(mat.almostEqual(mat2));
        }
        {
            var qua = new mathis.XYZW(0, 0, 0, 0);
            mathis.geo.axisAngleToQuaternion(new mathis.XYZ(1, 0, 0), 1.5, qua);
            var mat = new mathis.MM();
            mathis.geo.quaternionToMatrix(qua, mat);
            var qua2 = new mathis.XYZW(0, 0, 0, 0);
            mathis.geo.matrixToQuaternion(mat, qua2);
            bilanGeo.assertTrue(mathis.geo.xyzwAlmostEquality(qua, qua2));
        }
        {
            //let A=new XYZ(1,0,0)
            //let B=new XYZ(0,0,1)
            //
            //let C=new XYZ(1,1,0).normalize()
            //let D=new XYZ(-1,1,0).normalize()
            var A = mathis.XYZ.newRandom().normalize();
            var B = new mathis.XYZ(0, 0, 0);
            mathis.geo.getOneOrthonormal(A, B);
            B.normalize();
            var C = mathis.XYZ.newRandom().normalize();
            var D = new mathis.XYZ(0, 0, 0);
            mathis.geo.getOneOrthonormal(C, D);
            D.normalize();
            var qua = new mathis.XYZW(0, 0, 0, 0);
            mathis.geo.aQuaternionMovingABtoCD(A, B, C, D, qua, true);
            var AA = mathis.XYZ.newZero();
            var BB = mathis.XYZ.newZero();
            var mat = new mathis.MM();
            mathis.geo.quaternionToMatrix(qua, mat);
            mathis.geo.multiplicationMatrixVector(mat, A, AA);
            mathis.geo.multiplicationMatrixVector(mat, B, BB);
            bilanGeo.assertTrue(mathis.geo.xyzAlmostEquality(C, AA) && mathis.geo.xyzAlmostEquality(D, BB));
        }
        {
            var fd = new mathis.periodicWorld.CartesianFundamentalDomain(new mathis.XYZ(2, 0, 0), new mathis.XYZ(0, 2, 0), new mathis.XYZ(0, 0, 2));
            var res = new mathis.XYZ(0, 0, 0);
            fd.modulo(new mathis.XYZ(0.5, -1.75, 3.5), res);
            bilanGeo.assertTrue(mathis.geo.xyzAlmostEquality(res, new mathis.XYZ(0.5, 0.25, -0.5)));
        }
        /**orthogonals projections*/
        {
            var direction = new mathis.XYZ(1, 1, 0);
            var proj = new mathis.MM();
            mathis.geo.orthogonalProjectionOnLine(direction, proj);
            var vect = new mathis.XYZ(Math.random(), Math.random(), Math.random());
            var v2 = new mathis.XYZ(0, 0, 0);
            mathis.geo.multiplicationMatrixVector(proj, vect, v2);
            var v3 = new mathis.XYZ(0, 0, 0);
            mathis.geo.multiplicationMatrixVector(proj, v2, v3);
            bilanGeo.assertTrue(v3.almostEqual(v2));
        }
        {
            var direction = new mathis.XYZ(1, 1, 0);
            var direction2 = new mathis.XYZ(-1, 1, 2);
            var proj = new mathis.MM();
            mathis.geo.orthogonalProjectionOnPlane(direction, direction2, proj);
            var vect = new mathis.XYZ(Math.random(), Math.random(), Math.random());
            var v2 = new mathis.XYZ(0, 0, 0);
            mathis.geo.multiplicationMatrixVector(proj, vect, v2);
            var v3 = new mathis.XYZ(0, 0, 0);
            mathis.geo.multiplicationMatrixVector(proj, v2, v3);
            bilanGeo.assertTrue(v3.almostEqual(v2));
        }
        return bilanGeo;
    }
    mathis.geometryTest = geometryTest;
})(mathis || (mathis = {}));
