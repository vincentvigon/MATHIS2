// /**
//  * Created by vigon on 09/03/2016.
//  */
//
//
//
// module mathis{
//
//     export class MameshForTest extends Mamesh{
//
//
//         toStringForTest0():string{
//
//             let substractHashCode=true
//
//             let toSubstract=0
//             if (substractHashCode){
//                 toSubstract=Number.MAX_VALUE
//                 for (let vert of this.vertices){
//                     if (vert.hashNumber<toSubstract) toSubstract=vert.hashNumber
//                 }
//
//
//             }
//
//
//             let res=""
//             for (let vert of this.vertices){
//                 res+=vert.toString(toSubstract)+""
//             }
//             res+="tri:"
//             for (let j=0;j<this.smallestTriangles.length;j+=3){
//                 res+="["+(this.smallestTriangles[j].hashNumber-toSubstract)+","+(this.smallestTriangles[j+1].hashNumber-toSubstract)+","+(this.smallestTriangles[j+2].hashNumber-toSubstract)+"]"
//             }
//             res+="squa:"
//             for (let j=0;j<this.smallestSquares.length;j+=4){
//                 res+="["+(this.smallestSquares[j].hashNumber-toSubstract)+","+(this.smallestSquares[j+1].hashNumber-toSubstract)+","+(this.smallestSquares[j+2].hashNumber-toSubstract)+","+(this.smallestSquares[j+3].hashNumber-toSubstract)+"]"
//             }
//
//
//             if (this.straightLines!=null) {
//                 res += "strai:"
//                 for (let line of this.straightLines) {
//                     res += "["
//                     for (let ver of line) {
//                         res += (ver.hashNumber-toSubstract) + ","
//                     }
//                     res += "]"
//                 }
//             }
//
//             if (this.loopLines!=null) {
//                 res += "loop:"
//                 for (let line of this.loopLines) {
//                     res += "["
//                     for (let ver of line) {
//                         res += (ver.hashNumber-toSubstract) + ","
//                     }
//                     res += "]"
//                 }
//             }
//
//             return res
//
//
//         }
//
//         toStringForTest1():string{
//
//             let toSubstract=0
//             toSubstract=Number.MAX_VALUE
//             for (let vert of this.vertices){
//                 if (vert.hashNumber<toSubstract) toSubstract=vert.hashNumber
//             }
//
//
//
//
//
//             let res=""
//             for (let vert of this.vertices){
//                 res+=vert.toString(toSubstract)+""
//             }
//             res+="tri:"
//             for (let j=0;j<this.smallestTriangles.length;j+=3){
//                 res+="["+(this.smallestTriangles[j].hashNumber-toSubstract)+","+(this.smallestTriangles[j+1].hashNumber-toSubstract)+","+(this.smallestTriangles[j+2].hashNumber-toSubstract)+"]"
//             }
//             res+="squa:"
//             for (let j=0;j<this.smallestSquares.length;j+=4){
//                 res+="["+(this.smallestSquares[j].hashNumber-toSubstract)+","+(this.smallestSquares[j+1].hashNumber-toSubstract)+","+(this.smallestSquares[j+2].hashNumber-toSubstract)+","+(this.smallestSquares[j+3].hashNumber-toSubstract)+"]"
//             }
//
//
//             if (this.straightLines!=null) {
//                 res += "strai:"
//                 for (let line of this.straightLines) {
//                     res += "["
//                     for (let ver of line) {
//                         res += (ver.hashNumber-toSubstract) + ","
//                     }
//                     res += "]"
//                 }
//             }
//
//             if (this.loopLines!=null) {
//                 res += "loop:"
//                 for (let line of this.loopLines) {
//                     res += "["
//                     for (let ver of line) {
//                         res += (ver.hashNumber-toSubstract) + ","
//                     }
//                     res += "]"
//                 }
//             }
//
//             res+="cutSegments"
//             for (let key in this.cutSegmentsDico){
//                 let segment=this.cutSegmentsDico[key]
//                 res+= '{'+(segment.a.hashNumber-toSubstract)+','+(segment.middle.hashNumber-toSubstract)+','+(segment.b.hashNumber-toSubstract)+'}'
//             }
//
//             return res
//
//
//         }
//
//
//     }
//
//
// }
