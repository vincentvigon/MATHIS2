///**
// * Created by vigon on 30/11/2015.
// */
//
//
//
//module mathis {
//
//
//    export function basicTest():Bilan {
//        var bilan = new Bilan(0, 0)
//
//        var v=basic.newXYZ(123,543,42345.2345)
//        var w=basic.newXYZ(0,0,0)
//        basic.copyXYZ(v,w)
//        bilan.assertTrue( (basic.xyzEquality(v,w)) )
//
//        var v=basic.newXYZ(1234+basic.epsilon*0.1,1234,1234)
//        var w=basic.newXYZ(1234,1234,1234)
//        bilan.assertTrue( !basic.xyzEquality(v,w) )
//        bilan.assertTrue (basic.xyzAlmostEquality(v,w))
//
//
//        var qua=new XYZW(1,2,3,4)
//        var qua2=new XYZW(1,2,3,4+basic.epsilon*0.1)
//        bilan.assertTrue(qua.almostLogicalEqual(qua2))
//
//
//        bilan.assertTrue(basic.almostEquality(1,1.0000000001))
//
//
//        var idPerturbed=MM.newIdentity()
//        idPerturbed.m[0]=1+basic.epsilon/4
//        var identity=MM.newIdentity()
//        bilan.assertTrue(!basic.matEquality(idPerturbed,identity))
//        bilan.assertTrue(idPerturbed.almostEqual(identity))
//
//
//
//        var randomMatr=MM.newRandomMat()
//        var randomMatrCopy=MM.newZero().copyFrom(randomMatr)
//        bilan.assertTrue(randomMatr.equal(randomMatrCopy))
//        bilan.assertTrue(randomMatr.inverse().inverse().equal(randomMatr))
//        bilan.assertTrue(randomMatr.leftMultiply(identity).almostEqual(randomMatrCopy))
//        bilan.assertTrue(randomMatr.rightMultiply(idPerturbed).almostEqual(randomMatrCopy))
//
//
//
//        var diago= MM.newIdentity()
//        diago.m[0]=10
//        diago.m[5]=2
//        diago.m[15]=-2
//        var elemMat=MM.newIdentity()
//        elemMat.m[3]=1
//        var resultProduct=MM.newIdentity().copyFrom(diago)
//        resultProduct.m[3]=-2
//        bilan.assertTrue(MM.newZero().copyFrom(elemMat).rightMultiply(diago).almostEqual(resultProduct))
//
//        var inverseElemMat=MM.newIdentity()
//        inverseElemMat.m[3]=-1
//        bilan.assertTrue(MM.newFrom(elemMat).inverse().almostEqual(inverseElemMat))
//
//        var random=MM.newRandomMat()
//        bilan.assertTrue(MM.newFrom(random).inverse().leftMultiply(random).almostEqual(MM.newIdentity()))
//        bilan.assertTrue(MM.newFrom(random).inverse().rightMultiply(random).almostEqual(MM.newIdentity()))
//
//
//
//        bilan.assertTrue(basic.almostEquality(modulo(3.1234,1),0.1234))
//        bilan.assertTrue(basic.almostEquality(modulo(-3.99,1),0.01))
//        bilan.assertTrue(basic.almostEquality(modulo(12*Math.PI+4.1234,2*Math.PI),4.1234))
//        bilan.assertTrue(basic.almostEquality(modulo(20*Math.PI-4.1234,2*Math.PI),2*Math.PI-4.1234))
//
//
//
//
//        return bilan
//
//    }
//
//}
