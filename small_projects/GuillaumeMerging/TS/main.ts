/**
 * Created by vigon on 11/05/2017.
 */

module mathis{

    export function startGuillaume(){

        let mathisFrame=new MathisFrame()

        let pieceOfCode=new ConnectorPiece(mathisFrame)


        let binder=new appli.Binder(pieceOfCode,null,mathisFrame)
        binder.go()

        pieceOfCode.goForTheFirstTime()



    }



}