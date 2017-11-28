/**
 * Created by vigon on 12/09/2017.
 */
/// <reference path="../basic.ts"/>

module mathis{

    export module geo{

        export function copyXYZ(original:XYZ, result:XYZ):XYZ {
            result.x = original.x
            result.y = original.y
            result.z = original.z
            return result
        }

        export function copyXyzFromFloat(x:number, y:number, z:number, result:XYZ):XYZ {
            result.x = x
            result.y = y
            result.z = z
            return result
        }

        export function copyMat(original:MM,result:MM):MM{
            for (var i=0;i<16;i++) result.m[i]=original.m[i]
            return result
        }

        export function matEquality(mat1:MM,mat2:MM):boolean{
            for (var i=0;i<16;i++){
                if( mat1.m[i]!=mat2.m[i]) return false
            }
            return true
        }

        export function matAlmostEquality(mat1:MM,mat2:MM):boolean{
            for (var i=0;i<16;i++){
                if( !almostEquality(mat1.m[i],mat2.m[i])) return false
            }
            return true
        }

        export function xyzEquality(vec1:XYZ, vec2:XYZ) {
            return vec1.x == vec2.x && vec1.y == vec2.y && vec1.z == vec2.z
        }

        /**eg: for testing that a vector is not too small to be normalised */
        export var epsilon = 0.00000001
        export var epsilonSquare = epsilon*epsilon
        /**bigger epsilon. When testing almost equality after operation such inversing twice a matrix*/
        export var epsitlonForAlmostEquality=0.000001

        export function xyzAlmostEquality(vec1:XYZ, vec2:XYZ) {
            return Math.abs(vec1.x - vec2.x) < epsitlonForAlmostEquality && Math.abs(vec1.y - vec2.y) < epsitlonForAlmostEquality && Math.abs(vec1.z - vec2.z) < epsitlonForAlmostEquality
        }

        export function xyzwAlmostEquality(vec1:XYZW, vec2:XYZW) {
            return Math.abs(vec1.x - vec2.x) < epsitlonForAlmostEquality && Math.abs(vec1.y - vec2.y) < epsitlonForAlmostEquality && Math.abs(vec1.z - vec2.z) < epsitlonForAlmostEquality && Math.abs(vec1.w - vec2.w) < epsitlonForAlmostEquality
        }

        export function almostLogicalEqual(quat1:XYZW,quat2:XYZW){
            return xyzwAlmostEquality(quat1,quat2)||
                (almostEquality(quat1.x,-quat2.x)&&almostEquality(quat1.y,-quat2.y)&&almostEquality(quat1.z,-quat2.z)&&almostEquality(quat1.w,-quat2.w) )
        }




        export function xyzAlmostZero(vec:XYZ) {
            return Math.abs(vec.x) < epsilon && Math.abs(vec.y) < epsilon && Math.abs(vec.z) < epsilon
        }

        export function almostEquality(a:number,b:number){
            return Math.abs(b-a)<epsitlonForAlmostEquality
        }


        export function determinant(mat:MM): number {
            var temp1 = (mat.m[10] * mat.m[15]) - (mat.m[11] * mat.m[14]);
            var temp2 = (mat.m[9] * mat.m[15]) - (mat.m[11] * mat.m[13]);
            var temp3 = (mat.m[9] * mat.m[14]) - (mat.m[10] * mat.m[13]);
            var temp4 = (mat.m[8] * mat.m[15]) - (mat.m[11] * mat.m[12]);
            var temp5 = (mat.m[8] * mat.m[14]) - (mat.m[10] * mat.m[12]);
            var temp6 = (mat.m[8] * mat.m[13]) - (mat.m[9] * mat.m[12]);

            return ((((mat.m[0] * (((mat.m[5] * temp1) - (mat.m[6] * temp2)) + (mat.m[7] * temp3))) - (mat.m[1] * (((mat.m[4] * temp1) -
            (mat.m[6] * temp4)) + (mat.m[7] * temp5)))) + (mat.m[2] * (((mat.m[4] * temp2) - (mat.m[5] * temp4)) + (mat.m[7] * temp6)))) -
            (mat.m[3] * (((mat.m[4] * temp3) - (mat.m[5] * temp5)) + (mat.m[6] * temp6))));
        }

        export function inverse(m1:MM,result:MM):void {

            if (Math.abs(determinant(m1))<epsilon) throw " you try to inverse a singular matrix"

            var l1 = m1.m[0];
            var l2 = m1.m[1];
            var l3 = m1.m[2];
            var l4 = m1.m[3];
            var l5 = m1.m[4];
            var l6 = m1.m[5];
            var l7 = m1.m[6];
            var l8 = m1.m[7];
            var l9 = m1.m[8];
            var l10 = m1.m[9];
            var l11 = m1.m[10];
            var l12 = m1.m[11];
            var l13 = m1.m[12];
            var l14 = m1.m[13];
            var l15 = m1.m[14];
            var l16 = m1.m[15];
            var l17 = (l11 * l16) - (l12 * l15);
            var l18 = (l10 * l16) - (l12 * l14);
            var l19 = (l10 * l15) - (l11 * l14);
            var l20 = (l9 * l16) - (l12 * l13);
            var l21 = (l9 * l15) - (l11 * l13);
            var l22 = (l9 * l14) - (l10 * l13);
            var l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
            var l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
            var l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
            var l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
            var l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
            var l28 = (l7 * l16) - (l8 * l15);
            var l29 = (l6 * l16) - (l8 * l14);
            var l30 = (l6 * l15) - (l7 * l14);
            var l31 = (l5 * l16) - (l8 * l13);
            var l32 = (l5 * l15) - (l7 * l13);
            var l33 = (l5 * l14) - (l6 * l13);
            var l34 = (l7 * l12) - (l8 * l11);
            var l35 = (l6 * l12) - (l8 * l10);
            var l36 = (l6 * l11) - (l7 * l10);
            var l37 = (l5 * l12) - (l8 * l9);
            var l38 = (l5 * l11) - (l7 * l9);
            var l39 = (l5 * l10) - (l6 * l9);

            result.m[0] = l23 * l27;
            result.m[4] = l24 * l27;
            result.m[8] = l25 * l27;
            result.m[12] = l26 * l27;
            result.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
            result.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
            result.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
            result.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
            result.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
            result.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
            result.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
            result.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
            result.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
            result.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
            result.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
            result.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
        }


        var  _resultTransp=new MM()
        export function transpose(matrix: MM,result:MM ):void{

            _resultTransp.m[0] = matrix.m[0];
            _resultTransp.m[1] = matrix.m[4];
            _resultTransp.m[2] = matrix.m[8];
            _resultTransp.m[3] = matrix.m[12];

            _resultTransp.m[4] = matrix.m[1];
            _resultTransp.m[5] = matrix.m[5];
            _resultTransp.m[6] = matrix.m[9];
            _resultTransp.m[7] = matrix.m[13];

            _resultTransp.m[8] = matrix.m[2];
            _resultTransp.m[9] = matrix.m[6];
            _resultTransp.m[10] = matrix.m[10];
            _resultTransp.m[11] = matrix.m[14];

            _resultTransp.m[12] = matrix.m[3];
            _resultTransp.m[13] = matrix.m[7];
            _resultTransp.m[14] = matrix.m[11];
            _resultTransp.m[15] = matrix.m[15];
            copyMat(_resultTransp,result)

        }

        export function multiplyMatMat(m1:MM,other:MM, result:MM): void {

            var tm0 = m1.m[0];
            var tm1 = m1.m[1];
            var tm2 = m1.m[2];
            var tm3 = m1.m[3];
            var tm4 = m1.m[4];
            var tm5 = m1.m[5];
            var tm6 = m1.m[6];
            var tm7 = m1.m[7];
            var tm8 = m1.m[8];
            var tm9 = m1.m[9];
            var tm10 = m1.m[10];
            var tm11 = m1.m[11];
            var tm12 = m1.m[12];
            var tm13 = m1.m[13];
            var tm14 = m1.m[14];
            var tm15 = m1.m[15];

            var om0 = other.m[0];
            var om1 = other.m[1];
            var om2 = other.m[2];
            var om3 = other.m[3];
            var om4 = other.m[4];
            var om5 = other.m[5];
            var om6 = other.m[6];
            var om7 = other.m[7];
            var om8 = other.m[8];
            var om9 = other.m[9];
            var om10 = other.m[10];
            var om11 = other.m[11];
            var om12 = other.m[12];
            var om13 = other.m[13];
            var om14 = other.m[14];
            var om15 = other.m[15];

            result.m[0] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12;
            result.m[1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13;
            result.m[2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14;
            result.m[3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15;

            result.m[4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12;
            result.m[5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13;
            result.m[6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14;
            result.m[7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15;

            result.m[8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12;
            result.m[9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13;
            result.m[10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14;
            result.m[11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15;

            result.m[12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12;
            result.m[13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13;
            result.m[14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14;
            result.m[15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15;

        }




        var baryResult=new XYZ(0,0,0)
        var _scaled=new XYZ(0,0,0)
        export function baryCenter(xyzs:XYZ[],weights:number[],result:XYZ):void{
            baryResult.x=0
            baryResult.y=0
            baryResult.z=0

            if (weights==null){
                weights=[]
                for (let i=0;i<xyzs.length;i++) weights.push(1/xyzs.length)
            }

            for (var i=0;i<xyzs.length;i++){
                copyXYZ(xyzs[i],_scaled)
                scale(_scaled,weights[i],_scaled)
                add(baryResult,_scaled,baryResult)
            }
            copyXYZ(baryResult,result)

        }

//var betweenRes=new XYZ(0,0,0)

        export function between(v1:XYZ,v2:XYZ,alpha:number,res:XYZ):void{
            res.x=v1.x*(1-alpha)+v2.x*alpha;
            res.y=v1.y*(1-alpha)+v2.y*alpha;
            res.z=v1.z*(1-alpha)+v2.z*alpha;

        }
        export function betweenUV(v1:UV,v2:UV,alpha:number,res:UV):void{
            res.u=v1.u*(1-alpha)+v2.u*alpha;
            res.v=v1.v*(1-alpha)+v2.v*alpha;

        }


        var _matUn=new MM()
        var _source=new XYZ(0,0,0)
        export function unproject(source: XYZ, viewportWidth: number, viewportHeight: number,world:MM,  view:MM, projection:MM,result:XYZ): void {
            copyXYZ(source,_source)
            if (world!=null){
                multiplyMatMat(world,view,_matUn)
                multiplyMatMat(_matUn,projection,_matUn)
            }
            else{
                multiplyMatMat(view,projection,_matUn)
            }

            inverse(_matUn,_matUn)

            _source.x = _source.x / viewportWidth * 2 - 1;
            _source.y = -(_source.y / viewportHeight * 2 - 1);
            multiplicationVectorMatrix(_matUn,_source,result)

            var num = source.x * _matUn.m[3] + source.y * _matUn.m[7] + source.z * _matUn.m[11] + _matUn.m[15];

            if (withinEpsilon(num, 1.0)) {
                scale(result, 1.0 / num, result)
            }

        }


//public static Unproject(source: BABYLON.Vector3, viewportWidth: number, viewportHeight: number, world: BABYLON.Matrix, view: BABYLON.Matrix, projection: BABYLON.Matrix): BABYLON.Vector3 {
//    var matrix = world.multiply(view).multiply(projection);
//
//
//    matrix.invert();
//
//    source.x = source.x / viewportWidth * 2 - 1;
//    source.y = -(source.y / viewportHeight * 2 - 1);
//    var vector = BABYLON.Vector3.TransformCoordinates(source, matrix);
//    var num = source.x * matrix.m[3] + source.y * matrix.m[7] + source.z * matrix.m[11] + matrix.m[15];
//
//
//    console.log("vec",vector)
//    if (BABYLON.Tools.WithinEpsilon(num, 1.0)) {
//        vector = vector.scale(1.0 / num);
//    }
//    return vector;
//}



        /**??? */
        function withinEpsilon(a: number, b: number): boolean {
            var num = a - b;
            return -1.401298E-45 <= num && num <= 1.401298E-45;
        }


        var _axis=new XYZ(0,0,0)
        export function axisAngleToMatrix(axis: XYZ, angle: number,result:MM): void {
            var s = Math.sin(-angle);
            var c = Math.cos(-angle);
            var c1 = 1 - c;

            copyXYZ(axis,_axis)
            normalize(_axis,_axis)


            result.m[0] = (_axis.x * _axis.x) * c1 + c;
            result.m[1] = (_axis.x * _axis.y) * c1 - (_axis.z * s);
            result.m[2] = (_axis.x * _axis.z) * c1 + (_axis.y * s);
            result.m[3] = 0.0;

            result.m[4] = (_axis.y * _axis.x) * c1 + (_axis.z * s);
            result.m[5] = (_axis.y * _axis.y) * c1 + c;
            result.m[6] = (_axis.y * _axis.z) * c1 - (_axis.x * s);
            result.m[7] = 0.0;

            result.m[8] = (_axis.z * _axis.x) * c1 - (_axis.y * s);
            result.m[9] = (_axis.z * _axis.y) * c1 + (_axis.x * s);
            result.m[10] = (_axis.z * _axis.z) * c1 + c;
            result.m[11] = 0.0;

            result.m[12] = 0.0;
            result.m[13] = 0.0;
            result.m[14] = 0.0;
            result.m[15] = 1.0;

        }


        export function multiplicationVectorMatrix(transformation:MM, vector: XYZ, result: XYZ): void {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
            var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];

            result.x = x / w;
            result.y = y / w;
            result.z = z / w;
        }

        export function axisAngleToQuaternion(axis: XYZ, angle: number,result:XYZW): void {
            var sin = Math.sin(angle / 2);

            result.w = Math.cos(angle / 2);
            result.x = axis.x * sin;
            result.y = axis.y * sin;
            result.z = axis.z * sin;
        }

        export function matrixToQuaternion(m:MM, result:XYZW):void {

            //m=Matrix.Transpose(m);

            //attention, il y a une transposition cachée
            var m00, m01, m02, m10, m11, m12, m20, m21, m22;
            m00 = m.m[0];
            m10 = m.m[1];
            m20 = m.m[2];
            m01 = m.m[4];
            m11 = m.m[5];
            m21 = m.m[6];
            m02 = m.m[8];
            m12 = m.m[9];
            m22 = m.m[10];

            var qx, qy, qz, qw;
            var tr = m00 + m11 + m22;

            if (tr > 0) {
                var S = Math.sqrt(tr + 1.0) * 2; // S=4*qw
                qw = 0.25 * S;
                qx = (m21 - m12) / S;
                qy = (m02 - m20) / S;
                qz = (m10 - m01) / S;
            } else if ((m00 > m11) && (m00 > m22)) {
                var S = Math.sqrt(1.0 + m00 - m11 - m22) * 2; // S=4*qx

                qw = (m21 - m12) / S;
                qx = 0.25 * S;
                qy = (m01 + m10) / S;
                qz = (m02 + m20) / S;
            } else if (m11 > m22) {
                var S = Math.sqrt(1.0 + m11 - m00 - m22) * 2; // S=4*qy

                qw = (m02 - m20) / S;
                qx = (m01 + m10) / S;
                qy = 0.25 * S;
                qz = (m12 + m21) / S;
            } else {
                var S = Math.sqrt(1.0 + m22 - m00 - m11) * 2; // S=4*qz

                qw = (m10 - m01) / S;
                qx = (m02 + m20) / S;
                qy = (m12 + m21) / S;
                qz = 0.25 * S;
            }


            result.x = qx
            result.y = qy
            result.z = qz
            result.w = qw


        }

        var _ortBasisV1=new XYZ(0,0,0)
        var _ortBasisV2=new XYZ(0,0,0)
        var _ortBasisV3=new XYZ(0,0,0)
        var _ortBasisAll=new MM()

        export function twoVectorsToQuaternion(v1:XYZ,v2:XYZ,firstIsPreserved:boolean,result:XYZW):void{
            if (firstIsPreserved){
                orthonormalizeKeepingFirstDirection(v1,v2,_ortBasisV1,_ortBasisV2)

            }
            else{
                orthonormalizeKeepingFirstDirection(v2,v1,_ortBasisV2,_ortBasisV1)

            }
            cross(_ortBasisV1,_ortBasisV2,_ortBasisV3)
            matrixFromLines(_ortBasisV1,_ortBasisV2,_ortBasisV3,_ortBasisAll)
            matrixToQuaternion(_ortBasisAll,result)
        }

        var _basisOrtho0=new XYZ(0,0,0)
        var _basisOrtho1=new XYZ(0,0,0)
        var _basisOrtho2=new XYZ(0,0,0)
        var _basisMatrix=new MM()
        var _transposedBasisMatrix=new MM()
        var _diagoMatrix=new MM()
        export function orthogonalProjectionOnLine(direction:XYZ,result:MM):void{

            normalize(direction,_basisOrtho0)
            getOneOrthonormal(direction,_basisOrtho1)
            cross(_basisOrtho0,_basisOrtho1,_basisOrtho2)
            matrixFromLines(_basisOrtho0,_basisOrtho1,_basisOrtho2,_basisMatrix)
            transpose(_basisMatrix,_transposedBasisMatrix)
            _diagoMatrix.m[0]=1
            _diagoMatrix.m[15]=1
            multiplyMatMat(_transposedBasisMatrix,_diagoMatrix,result)
            multiplyMatMat(result,_basisMatrix,result)

        }
        export function orthogonalProjectionOnPlane(direction:XYZ,otherDirection:XYZ,result:MM):void{

            orthonormalizeKeepingFirstDirection(direction,otherDirection,_basisOrtho0,_basisOrtho1)
//normalize(direction,_basisOrtho0)
//getOneOrthonormal(direction,_basisOrtho1)
            cross(_basisOrtho0,_basisOrtho1,_basisOrtho2)
            matrixFromLines(_basisOrtho0,_basisOrtho1,_basisOrtho2,_basisMatrix)
            transpose(_basisMatrix,_transposedBasisMatrix)
            _diagoMatrix.m[0]=1
            _diagoMatrix.m[5]=1
            _diagoMatrix.m[15]=1
            multiplyMatMat(_transposedBasisMatrix,_diagoMatrix,result)
            multiplyMatMat(result,_basisMatrix,result)

        }


        //
        //
        // export function translationOnMatrix(vector3: XYZ,result:MM): void {
        //     result.m[12] = vector3.x;
        //     result.m[13] = vector3.y;
        //     result.m[14] = vector3.z;
        // }

        export function quaternionToMatrix(quaternion:XYZW, result:MM):void {
            var xx = quaternion.x * quaternion.x;
            var yy = quaternion.y * quaternion.y;
            var zz = quaternion.z * quaternion.z;
            var xy = quaternion.x * quaternion.y;
            var zw = quaternion.z * quaternion.w;
            var zx = quaternion.z * quaternion.x;
            var yw = quaternion.y * quaternion.w;
            var yz = quaternion.y * quaternion.z;
            var xw = quaternion.x * quaternion.w;

            result.m[0] = 1.0 - (2.0 * (yy + zz));
            result.m[1] = 2.0 * (xy + zw);
            result.m[2] = 2.0 * (zx - yw);
            result.m[3] = 0;
            result.m[4] = 2.0 * (xy - zw);
            result.m[5] = 1.0 - (2.0 * (zz + xx));
            result.m[6] = 2.0 * (yz + xw);
            result.m[7] = 0;
            result.m[8] = 2.0 * (zx + yw);
            result.m[9] = 2.0 * (yz - xw);
            result.m[10] = 1.0 - (2.0 * (yy + xx));
            result.m[11] = 0;
            result.m[12] = 0;
            result.m[13] = 0;
            result.m[14] = 0;
            result.m[15] = 1.0;
        }


        export function quaternionMultiplication(q0:XYZW,q1: XYZW, result: XYZW):void {
            var x = q0.x * q1.w + q0.y * q1.z - q0.z * q1.y + q0.w * q1.x;
            var y = -q0.x * q1.z + q0.y * q1.w + q0.z * q1.x + q0.w * q1.y;
            var z = q0.x * q1.y - q0.y * q1.x + q0.z * q1.w + q0.w * q1.z;
            var w = -q0.x * q1.x - q0.y * q1.y - q0.z * q1.z + q0.w * q1.w;
            result.x=x
            result.y=y
            result.z=z
            result.w=w
        }


        /**a and b must be orthogonal
         * c and d must be orthogonal*/

//var tempVa=new XYZ(0,0,0)
//var tempVb=new XYZ(0,0,0)
//var tempVc=new XYZ(0,0,0)
//var tempVd=new XYZ(0,0,0)
//var tempVbb=new XYZ(0,0,0)
//var tempMatrix1=new MM()
//var cross1=new XYZ(0,0,0)
//var cross2=new XYZ(0,0,0)
//
//var quaternion1=new XYZW(0,0,0,0)
//var quaternion2=new XYZW(0,0,0,0)
//
//aQuaternionMovingABtoCD(a:XYZ,b:XYZ,c:XYZ,d:XYZ,result:XYZW):void{
//    /**saving, and normalising*/
//    tempVa.copyFrom(a).normalize();
//    tempVb.copyFrom(b).normalize();
//    tempVc.copyFrom(c).normalize();
//    tempVd.copyFrom(d).normalize();
//
//    /**first rotation*/
//    cross(tempVa,tempVc,cross1)
//    var angle1=angleBetweenTwoVectorsBetween0andPi(a,b) //Math.acos(dot(a, c))
//    axisAngleToQuaternion(cross1,angle1,quaternion1)
//    axisAngleToMatrix(cross1,angle1,tempMatrix1)
//
//    /**we have to transform tempVb */
//    multiplicationMatrixVector(tempMatrix1,tempVb,tempVbb)
//
//    /**second rotation*/
//    cross(tempVbb,tempVd,cross2)
//    var angle2=Math.acos(dot(tempVbb,tempVd))
//    axisAngleToQuaternion(cross2,angle2,quaternion2)
//
//    quaternionMultiplication(quaternion1,quaternion2,result)
//
//
//}


        var matt1=new MM()
        var matt2=new MM()
        var oor1=new XYZ(0,0,0)
        var oor2=new XYZ(0,0,0)
        var copA=new XYZ(0,0,0)
        var copB=new XYZ(0,0,0)
        var copC=new XYZ(0,0,0)
        var copD=new XYZ(0,0,0)

        export function anOrthogonalMatrixMovingABtoCD(a:XYZ,b:XYZ,c:XYZ,d:XYZ,result:MM,argsAreOrthonormal=false):void{

            if (argsAreOrthonormal){
                copA.copyFrom(a)
                copB.copyFrom(b)
                copC.copyFrom(c)
                copD.copyFrom(d)

            }
            else {
                orthonormalizeKeepingFirstDirection(a,b,copA,copB)
                orthonormalizeKeepingFirstDirection(c,d,copC,copD)
            }

            cross(copA,copB,oor1)
            matrixFromLines(copA,copB,oor1,matt1)

            cross(copC,copD,oor2)
            matrixFromLines(copC,copD,oor2,matt2)

            transpose(matt1,matt1)

            multiplyMatMat(matt1,matt2,result)
        }


        export function linearTransformation_3vec(v0:XYZ, v1:XYZ, v2:XYZ, w0:XYZ, w1:XYZ, w2:XYZ, result:MM){
            let V=new MM()
            let W=new MM()
            matrixFromLines(v0,v1,v2,V)
            matrixFromLines(w0,w1,w2,W)
            inverse(V,V)
            multiplyMatMat(V,W,result)
        }

// linearTransformation_2vec(v0:XYZ, v1:XYZ, w0:XYZ, w1:XYZ, result:MM){
//
//     let v2=new XYZ(0,0,0)
//     let w2=new XYZ(0,0,0)
//     cross(v0,v1,v2)
//     cross(w0,w1,w2)
//
//     linearTransformation_3vec(v0,v1,v2,w0,w1,w2,result)
//
// }



        export function affineTransformation_4vec(v0:XYZ, v1:XYZ, v2:XYZ, v3:XYZ, w0:XYZ, w1:XYZ, w2:XYZ, w3:XYZ, result:MM){


            let vv1=XYZ.newFrom(v1).substract(v0)
            let vv2=XYZ.newFrom(v2).substract(v0)
            let vv3=XYZ.newFrom(v3).substract(v0)

            let ww1=XYZ.newFrom(w1).substract(w0)
            let ww2=XYZ.newFrom(w2).substract(w0)
            let ww3=XYZ.newFrom(w3).substract(w0)


            linearTransformation_3vec(vv1,vv2,vv3,ww1,ww2,ww3,result)


            let translation=new XYZ(0,0,0)
            multiplicationVectorMatrix(result,v0,translation)
            translation.scale(-1).add(w0)

            result.m[12]=translation.x
            result.m[13]=translation.y
            result.m[14]=translation.z

        }



        export function affineTransformation_3vec(v0:XYZ, v1:XYZ, v2:XYZ, w0:XYZ, w1:XYZ, w2:XYZ, result:MM){
            let v3=new XYZ(0,0,0)
            let w3=new XYZ(0,0,0)
            cross(v1,v2,v3)
            cross(w1,w2,w3)
            v3.add(v0)
            w3.add(w0)

            affineTransformation_4vec(v0,v1,v2,v3,w0,w1,w2,w3,result)

        }







        var matBefore=new MM()
        export function aQuaternionMovingABtoCD(a:XYZ,b:XYZ,c:XYZ,d:XYZ,result:XYZW,argsAreOrthonormal=false):void{
            anOrthogonalMatrixMovingABtoCD(a,b,c,d,matBefore,argsAreOrthonormal)
            matrixToQuaternion(matBefore,result)
        }






        export function slerp(left:XYZW, right:XYZW, amount:number, result:XYZW):void {
            var num2;
            var num3;
            var num = amount;
            var num4 = (((left.x * right.x) + (left.y * right.y)) + (left.z * right.z)) + (left.w * right.w);
            var flag = false;

            if (num4 < 0) {
                flag = true;
                num4 = -num4;
            }

            if (num4 > 0.999999) {
                num3 = 1 - num;
                num2 = flag ? -num : num;
            }
            else {
                var num5 = Math.acos(num4);
                var num6 = (1.0 / Math.sin(num5));
                num3 = (Math.sin((1.0 - num) * num5)) * num6;
                num2 = flag ? ((-Math.sin(num * num5)) * num6) : ((Math.sin(num * num5)) * num6);
            }

            result.x = (num3 * left.x) + (num2 * right.x)
            result.y = (num3 * left.y) + (num2 * right.y)
            result.z = (num3 * left.z) + (num2 * right.z)
            result.w = (num3 * left.w) + (num2 * right.w)

        }


        export function matrixFromLines(line1:XYZ, line2:XYZ, line3:XYZ, result:MM):void {

            result.m[0] = line1.x
            result.m[1] = line1.y
            result.m[2] = line1.z
            result.m[3] = 0
            result.m[4] = line2.x
            result.m[5] = line2.y
            result.m[6] = line2.z
            result.m[7] = 0
            result.m[8] = line3.x
            result.m[9] = line3.y
            result.m[10] = line3.z
            result.m[11] = 0
            result.m[12] = 0
            result.m[13] = 0
            result.m[14] = 0
            result.m[15] = 1.0

        }




        var v1nor=new XYZ(0,0,0)
        var v2nor=new XYZ(0,0,0)
        export function angleBetweenTwoVectorsBetween0andPi(v1:XYZ, v2:XYZ):number{
            if (xyzAlmostZero(v1) ||xyzAlmostZero(v2)) {
                throw 'be aware: you compute angle between two vectors, one of them being almost zero'
            }

            normalize(v1,v1nor)
            normalize(v2,v2nor)
            var dotProduct=dot(v1nor,v2nor)

            /**because normalisations can be imperfect*/
            if (dotProduct>1) return 0
            if (dotProduct<-1) return Math.PI //we see here that this is not realy an angle modulo PI
            else return   Math.acos(dotProduct)
        }


        export function almostParallel(v1:XYZ, v2:XYZ, oppositeAreParallel=true,toleranceAngle=0.001):boolean{
            let angle=angleBetweenTwoVectorsBetween0andPi(v1,v2)
            if (angle<toleranceAngle) return true
            if (oppositeAreParallel&& Math.PI-angle<toleranceAngle) return true
            return false
        }


        var _aCros=new XYZ(0,0,0)
        export function angleBetweenTwoVectorsBetweenMinusPiAndPi(v1:XYZ, v2:XYZ, upDirection:XYZ):number{
            let angle=angleBetweenTwoVectorsBetween0andPi(v1,v2)

            cross(v1,v2,_aCros)
            let sign=(dot(upDirection,_aCros)<0)?-1:1

            return   sign*angle
        }

        export function angleBetweenTwoVectorsBetween0And2Pi(v1:XYZ, v2:XYZ, upDirection:XYZ):number{
            let angle=angleBetweenTwoVectorsBetweenMinusPiAndPi(v1,v2,upDirection)
            if (angle>=0) return angle
            return   2*Math.PI+angle
        }



        export function segmentsIntersection(c0x:number,c0y:number,c1x:number,c1y:number,c2x:number,c2y:number,c3x:number,c3y:number){
            var d1x=c1x-c0x;
            var d1y=c1y-c0y;
            var d2x=c2x-c3x;
            var d2y=c2y-c3y;


            var sx=c3x-c0x;
            var sy=c3y-c0y;

            var det=-d1x*d2y+d1y*d2x;

            if (Math.abs(det)<0.0001) return null;
            var alpha=(-sx*d2y+sy*d2x)/det;
            var beta=(-sx*d1y+sy*d1x)/det;

            return {x:alpha*d1x+c0x,y:alpha*d1y+c0y};

        }





        var _quat0 = new XYZW(0, 0, 0, 0)
        var _quat1 = new XYZW(0, 0, 0, 0)
        var _quatAlpha = new XYZW(0, 0, 0, 0)

        var _mat0 = new MM()
        var _mat1 = new MM()
        var _matAlpha = new MM()

        var _c0 = new XYZ(0, 0, 0)
        var _c1 = new XYZ(0, 0, 0)

        export function slerpTwoOrthogonalVectors(a0:XYZ, b0:XYZ, a1:XYZ, b1:XYZ, alpha:number, aAlpha:XYZ, bAlpha:XYZ):void {

            cross(a0, b0, _c0)
            cross(a1, b1, _c1)
            matrixFromLines(a0, b0, _c0, _mat0)
            matrixFromLines(a1, b1, _c1, _mat1)

            matrixToQuaternion(_mat0, _quat0)
            matrixToQuaternion(_mat1, _quat1)

            slerp(_quat0, _quat1, alpha, _quatAlpha)
            quaternionToMatrix(_quatAlpha, _matAlpha)

            copyXyzFromFloat(_matAlpha.m[0], _matAlpha.m[1], _matAlpha.m[2], aAlpha)
            copyXyzFromFloat(_matAlpha.m[4], _matAlpha.m[5], _matAlpha.m[7], bAlpha)

        }


        export function interpolateTwoVectors(a0:XYZ, a1:XYZ, alpha:number, aAlpha:XYZ):void {
            aAlpha.x = a0.x * (1 - alpha) + a1.x * alpha
            aAlpha.y = a0.y * (1 - alpha) + a1.y * alpha
            aAlpha.z = a0.z * (1 - alpha) + a1.z * alpha
        }


        export function scale(vec:XYZ, scalar:number,result:XYZ):void{
            result.x=vec.x*scalar
            result.y=vec.y*scalar
            result.z=vec.z*scalar
        }



        export function add(v1:XYZ, v2:XYZ, result:XYZ) {
            result.x = v1.x + v2.x
            result.y = v1.y + v2.y
            result.z = v1.z + v2.z

        }

        export function substract(v1:XYZ, v2:XYZ, result:XYZ) {
            result.x = v1.x - v2.x
            result.y = v1.y - v2.y
            result.z = v1.z - v2.z

        }

        export function dot(left:XYZ, right:XYZ):number {
            return (left.x * right.x + left.y * right.y + left.z * right.z)
        }

        export function norme(vec:XYZ):number {
            return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z)
        }

        export function squareNorme(vec:XYZ):number {
            return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z
        }


        var _crossResult=new XYZ(0,0,0)
        export function cross(left:XYZ, right:XYZ, result:XYZ):void {
            _crossResult.x = left.y * right.z - left.z * right.y;
            _crossResult.y = left.z * right.x - left.x * right.z;
            _crossResult.z = left.x * right.y - left.y * right.x;
            copyXYZ(_crossResult,result)
        }


        var v1forSubstraction = new XYZ(0, 0, 0)
        var randV2 = new XYZ(0, 0, 0)
        var _result1=new XYZ(0,0,0)
        var _result2=new XYZ(0,0,0)
        export function orthonormalizeKeepingFirstDirection(v1:XYZ, v2:XYZ,result1:XYZ,result2:XYZ):void {

            normalize(v1,_result1)
            copyXYZ(v1, v1forSubstraction)
            scale(v1forSubstraction, dot(v1, v2),v1forSubstraction)
            substract(v2, v1forSubstraction, _result2)

            if (squareNorme(_result2) < epsilon*epsilon) {
                copyXyzFromFloat(Math.random(), Math.random(), Math.random(), randV2)
                logger.c("beware: you try to orthonormalize two co-linear vectors")
                return orthonormalizeKeepingFirstDirection(v1, randV2,result1,result2)
            }
            normalize(_result2,_result2)
            copyXYZ(_result1,result1)
            copyXYZ(_result2,result2)
        }


        export function getOneOrthonormal(vec:XYZ, result:XYZ):void{
            if (Math.abs(vec.x)+Math.abs(vec.y)>0.0001) result.copyFromFloats(-vec.y,vec.x,0);
            else result.copyFromFloats(0,-vec.z,vec.y);
            normalize(result,result)
        }


        export function normalize(vec:XYZ,result:XYZ):void {
            var norme = geo.norme(vec)
            if (norme < epsilon) throw "one can not normalize a the almost zero vector:" + vec
            scale(vec, 1 / norme,result)
        }

        /**a tester : il doit y avoir une erreur quand sphereCenter!=(0,0,0)*/
        var spheCentToRayOri = new XYZ(0, 0, 0)
        var _resultInters=new XYZ(0, 0, 0)
        export function intersectionBetweenRayAndSphereFromRef(rayOrigine:XYZ, rayDirection:XYZ, aRadius:number, sphereCenter:XYZ ,result1:XYZ,result2:XYZ):boolean {

            copyXYZ(rayOrigine, spheCentToRayOri)
            substract(spheCentToRayOri, sphereCenter, spheCentToRayOri)

            var a = squareNorme(rayDirection)
            var b = 2 * dot(rayDirection, spheCentToRayOri)
            var c = squareNorme(spheCentToRayOri) - aRadius * aRadius;

            var discriminant = b * b - 4 * a * c;

            /**no solution, the ray do not touch*/
            if (discriminant < 0) {
                return false
            }
            else {
                var t1 = (-b + Math.sqrt(discriminant)) / 2 / a;
                var t2 = (-b - Math.sqrt(discriminant)) / 2 / a;

                copyXYZ(rayDirection, _resultInters)
                scale(_resultInters, t1,_resultInters)
                add(_resultInters, rayOrigine, _resultInters)
                copyXYZ(_resultInters,result1)

                copyXYZ(rayDirection, _resultInters)
                scale(_resultInters, t2,_resultInters)
                add(_resultInters, rayOrigine, _resultInters)
                copyXYZ(_resultInters,result2)

                return true

                //
                ///**we are in front of the sphere : we return the smallest solution */
                //if (t1 > 0 && t2 > 0) {
                //    if (Math.abs(t1) < Math.abs(t2)) {
                //        copyXYZ(rayDirection, _resultInters)
                //        scale(_resultInters, t1,_resultInters)
                //        add(_resultInters, rayOrigine, _resultInters)
                //    }
                //    else {
                //        copyXYZ(rayDirection, _resultInters)
                //        scale(_resultInters, t2,_resultInters)
                //        add(_resultInters, rayOrigine, _resultInters)
                //    }
                //}
                //else if (onlyFromOutside) return false
                //
                ///** we are inside the sphere, we choose the only one which is in front of camera*/
                //else if (t1 > 0 && t2 < 0) {
                //    cc('inside the sphere')
                //    copyXYZ(rayDirection, _resultInters)
                //    scale(_resultInters, t1,_resultInters)
                //    add(_resultInters, rayOrigine, _resultInters)
                //}
                //else if (t1 < 0 && t2 > 0) {
                //    cc('inside the sphere 2')
                //
                //    copyXYZ(rayDirection, _resultInters)
                //    scale(_resultInters, t2,_resultInters)
                //    add(_resultInters, rayOrigine, _resultInters)
                //}
                //else return false
                //
                //copyXYZ(_resultInters,result)
                //return true
            }
        }


        var difference=new XYZ(0,0,0)
        export function distance(vect1:XYZ,vect2:XYZ):number{
            copyXYZ(vect1,difference)
            substract(difference,vect2,difference)
            return norme(difference)
        }

        export function squaredDistance(vect1:XYZ,vect2:XYZ):number{
            copyXYZ(vect1,difference)
            substract(difference,vect2,difference)
            return squareNorme(difference)
        }

        export function closerOf(candidat1:XYZ,canditat2:XYZ,reference:XYZ,result:XYZ):number{

            let l1=distance(candidat1,reference)
            let l2=distance(canditat2,reference)

            if (l1<l2) copyXYZ(candidat1,result)
            else copyXYZ(canditat2,result)

            return (l1<l2)? l1 : l2

        }


        var _xAxis=XYZ.newZero()
        var _yAxis=XYZ.newZero()
        var _zAxis=XYZ.newZero()

        export function LookAtLH(eye: XYZ, target: XYZ, up: XYZ, result: MM): void {
            // Z axis

            substract(target,eye,_zAxis)
            normalize(_zAxis,_zAxis)


            // X axis
            cross(up, _zAxis, _xAxis)

            if (xyzAlmostZero(_xAxis)) {
                _xAxis.x = 1.0;
            } else {
                _xAxis.normalize();
            }

            // Y axis
            cross(_zAxis, _xAxis, _yAxis);
            _yAxis.normalize();

            // Eye angles
            var ex = -dot(_xAxis, eye);
            var ey = -dot(_yAxis, eye);
            var ez = -dot(_zAxis, eye);

            numbersToMM(_xAxis.x, _yAxis.x, _zAxis.x, 0,
                _xAxis.y, _yAxis.y, _zAxis.y, 0,
                _xAxis.z, _yAxis.z, _zAxis.z, 0,
                ex, ey, ez, 1, result);
        }



        export function OrthoOffCenterLH(left: number, right, bottom: number, top: number, znear: number, zfar: number, result: MM): void {
            result.m[0] = 2.0 / (right - left);
            result.m[1] = result.m[2] = result.m[3] = 0;
            result.m[5] = 2.0 / (top - bottom);
            result.m[4] = result.m[6] = result.m[7] = 0;
            result.m[10] = -1.0 / (znear - zfar);
            result.m[8] = result.m[9] = result.m[11] = 0;
            result.m[12] = (left + right) / (left - right);
            result.m[13] = (top + bottom) / (bottom - top);
            result.m[14] = znear / (znear - zfar);
            result.m[15] = 1.0;
        }


        export function PerspectiveFovLH(fov: number, aspect: number, znear: number, zfar: number, result: MM): void {
            var tan = 1.0 / (Math.tan(fov * 0.5));

            var v_fixed = true//TODO (fovMode === Camera.FOVMODE_VERTICAL_FIXED);

            if (v_fixed) {
                result.m[0] = tan / aspect;
            }
            else {
                result.m[0] = tan;
            }

            result.m[1] = result.m[2] = result.m[3] = 0.0;

            if (v_fixed) {
                result.m[5] = tan;
            }
            else {
                result.m[5] = tan * aspect;
            }

            result.m[4] = result.m[6] = result.m[7] = 0.0;
            result.m[8] = result.m[9] = 0.0;
            result.m[10] = -zfar / (znear - zfar);
            result.m[11] = 1.0;
            result.m[12] = result.m[13] = result.m[15] = 0.0;
            result.m[14] = (znear * zfar) / (znear - zfar);
        }


        export function numbersToMM(a0:number,a1:number,a2:number,a3:number,a4:number,a5:number,a6:number,a7:number,a8:number,a9:number,a10:number,a11:number,a12:number,a13:number,a14:number,a15:number,res:MM):void{
            res.m[0]=a0
            res.m[1]=a1
            res.m[2]=a2
            res.m[3]=a3
            res.m[4]=a4
            res.m[5]=a5
            res.m[6]=a6
            res.m[7]=a7
            res.m[8]=a8
            res.m[9]=a9
            res.m[10]=a10
            res.m[11]=a11
            res.m[12]=a12
            res.m[13]=a13
            res.m[14]=a14
            res.m[15]=a15
        }
//
//numbersToBabylonMatrix(a0:number,a1:number,a2:number,a3:number,a4:number,a5:number,a6:number,a7:number,a8:number,a9:number,a10:number,a11:number,a12:number,a13:number,a14:number,a15:number,res:BABYLON.Matrix):void{
//    res.m[0]=a0
//    res.m[1]=a1
//    res.m[2]=a2
//    res.m[3]=a3
//    res.m[4]=a4
//    res.m[5]=a5
//    res.m[6]=a6
//    res.m[7]=a7
//    res.m[8]=a8
//    res.m[9]=a9
//    res.m[10]=a10
//    res.m[11]=a11
//    res.m[12]=a12
//    res.m[13]=a13
//    res.m[14]=a14
//    res.m[15]=a15
//}
//
//
//MMtoBabylonMatrix(mm:MM,res:BABYLON.Matrix){
//    res.m[0]=mm.m[0]
//    res.m[1]=mm.m[1]
//    res.m[2]=mm.m[2]
//    res.m[3]=mm.m[3]
//    res.m[4]=mm.m[4]
//    res.m[5]=mm.m[5]
//    res.m[6]=mm.m[6]
//    res.m[7]=mm.m[7]
//    res.m[8]=mm.m[8]
//    res.m[9]=mm.m[9]
//    res.m[10]=mm.m[10]
//    res.m[11]=mm.m[11]
//    res.m[12]=mm.m[12]
//    res.m[13]=mm.m[13]
//    res.m[14]=mm.m[14]
//    res.m[15]=mm.m[15]
//}
//
//XYZtoBabVector(vect:XYZ,res:BABYLON.Vector3):void{
//    res.x=vect.x
//    res.y=vect.y
//    res.z=vect.z
//
//}


        function  newHermite(value1: XYZ, tangent1: XYZ, value2: XYZ, tangent2: XYZ, amount: number): XYZ {
            var squared = amount * amount;
            var cubed = amount * squared;
            var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
            var part2 = (-2.0 * cubed) + (3.0 * squared);
            var part3 = (cubed - (2.0 * squared)) + amount;
            var part4 = cubed - squared;

            var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
            var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
            var z = (((value1.z * part1) + (value2.z * part2)) + (tangent1.z * part3)) + (tangent2.z * part4);

            return new XYZ(x, y, z);
        }


        /** Be carefull:   the right point t2 is not in the output */
        export function hermiteSpline(p1: XYZ, t1: XYZ, p2: XYZ, t2: XYZ, nbPoints: number  ,result:XYZ[]):void  {
            tab.clearArray(result)
            var step = 1 / nbPoints;
            for (var i = 0; i < nbPoints; i++) {
                result.push(newHermite(p1, t1, p2, t2, i * step));
            }

        }


        export function quadraticBezier(v0: XYZ, v1: XYZ, v2: XYZ, nbPoints: number,result:XYZ[]):void  {
            tab.clearArray(result)

            nbPoints = nbPoints > 2 ? nbPoints : 3;
            var equation = (t: number, val0: number, val1: number, val2: number) => {
                var res = (1 - t) * (1 - t) * val0 + 2 * t * (1 - t) * val1 + t * t * val2;
                return res;
            }
            for (var i = 0; i < nbPoints; i++) {
                result.push(new XYZ(equation(i / nbPoints, v0.x, v1.x, v2.x), equation(i / nbPoints, v0.y, v1.y, v2.y), equation(i / nbPoints, v0.z, v1.z, v2.z)));
            }
        }


        export function cubicBezier(v0: XYZ, v1: XYZ, v2: XYZ, v3: XYZ, nbPoints: number,result:XYZ[]): void {
            tab.clearArray(result)

            nbPoints = nbPoints > 3 ? nbPoints : 4;
            var equation = (t: number, val0: number, val1: number, val2: number, val3: number) => {
                var res = (1 - t) * (1 - t) * (1 - t) * val0 + 3 * t * (1 - t) * (1 - t) * val1 + 3 * t * t * (1 - t) * val2 + t * t * t * val3;
                return res;
            }
            for (var i = 0; i < nbPoints; i++) {
                result.push(new XYZ(equation(i / nbPoints, v0.x, v1.x, v2.x, v3.x), equation(i / nbPoints, v0.y, v1.y, v2.y, v3.y), equation(i / nbPoints, v0.z, v1.z, v2.z, v3.z)));
            }
        }



        export function affineTransformGenerator(originIN:XYZ,endIN:XYZ,originOUT:XYZ,endOUT:XYZ):(vecIn:XYZ,vecOut:XYZ)=>void{

            let amplitudeIN=XYZ.newFrom(endIN).substract(originIN)
            let amplitudeOUT=XYZ.newFrom(endOUT).substract(originOUT)
            /**we check intrance pavé (which can be a rectangle if output pavé is a rectangle*/
            if (amplitudeIN.x==0 &&amplitudeOUT.x!=0) throw "impossible affine transform from a rectangle to a pavé"
            if (amplitudeIN.y==0 &&amplitudeOUT.y!=0) throw "impossible affine transform from a rectangle to a pavé"
            if (amplitudeIN.z==0 &&amplitudeOUT.z!=0) throw "impossible affine transform from a rectangle to a pavé"
            /**we forbid that intrance pavé is a segment*/
            let nb0=0
            if (amplitudeIN.x==0) nb0++
            if (amplitudeIN.y==0) nb0++
            if (amplitudeIN.z==0) nb0++
            if (nb0>=2) throw "intrance pavé is too degenerated"

            let amplitudeINinv=new XYZ(
                (amplitudeIN.x==0)?1:1/amplitudeIN.x,
                (amplitudeIN.y==0)?1:1/amplitudeIN.y,
                (amplitudeIN.z==0)?1:1/amplitudeIN.z)
//console.log('amplitudeINinv',amplitudeINinv)

            let res=(vecIn:XYZ,vecOut:XYZ)=>{
                //console.log('ampl',amplitudeINinv,amplitudeOUT)
                vecOut.copyFrom(vecIn).substract(originIN).multiply(amplitudeINinv).multiply(amplitudeOUT).add(originOUT)
            }
            return res

        }











    }





}