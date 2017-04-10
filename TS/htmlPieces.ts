/**
 * Created by vigon on 21/04/2016.
 */


module mathis{

    export function nCanvasInOneLine(n:number,$containter:HTMLElement):HTMLElement[]{
        let res:HTMLElement[]=[]
        let width:string=roundWithGivenPrecision(100/n,2)+"%"
        for (let i=0;i<n;i++){
            var canvas = document.createElement('canvas');
            canvas.id     = "renderCanvas"+i;
            //canvas.width  = 200;
            //canvas.height = 200*i;
            //canvas.style.zIndex   = 8;
            //canvas.style.position = "relative";
            //canvas.style.border   = "1px solid";
            canvas.style.width=width
            canvas.style.height="100%"
            canvas.style.backgroundColor="red"
            $containter.appendChild(canvas)
            res.push(canvas)
        }
        return res
    }

    
    export function nDivInOneLine(n:number,$containter:HTMLElement,separatorCSS?:string):HTMLElement[]{
        let divs:HTMLElement[]=[]

        $containter.style.position="relative"

        let width:number=roundWithGivenPrecision(100/n,4)
        for (let i=0;i<n;i++){
            let div = document.createElement('div');
            div.id     = "divContainer"+i;
            div.style.display="inline-block"
            div.style.position="absolute"
            div.style.top="0"
            div.style.left=(i*width)+"%"
            div.style.width=width+"%"
            div.style.height="100%"
            //div.style.backgroundColor="red"
            if (separatorCSS!=null&& i>0) div.style.borderLeft=separatorCSS
            $containter.appendChild(div)
            divs.push(div)
        }
        return divs
    }


    export function nDivContainningCanvasInOneLine(n:number,$containter:HTMLElement,separatorCSS?:string):{divs:HTMLElement[],canvass:HTMLElement[]}{
        let canvass:HTMLElement[]=[]
        let divs:HTMLElement[]=[]

        $containter.style.position="relative"

        let width:number=roundWithGivenPrecision(100/n,4)
        for (let i=0;i<n;i++){
            let div = document.createElement('div');
            div.id     = "divContainer"+i;
            div.style.display="inline-block"
            div.style.position="absolute"
            div.style.top="0"
            div.style.left=(i*width)+"%"
            div.style.width=width+"%"
            div.style.height="100%"
            //div.style.backgroundColor="red"
            if (separatorCSS!=null&& i>0) div.style.borderLeft=separatorCSS
            $containter.appendChild(div)
            divs.push(div)

            let canvas = document.createElement('canvas');
            canvas.id     = "renderCanvas"+i;
            canvas.style.width="100%"
            canvas.style.height="100%"
            //canvas.style.backgroundColor="red"
            div.appendChild(canvas)
            canvass.push(canvas)
        }


        return {divs:divs,canvass:canvass}
    }

    
    export function legend(heightCSS:string,$container:HTMLElement,bottom=true,separatorCSS?:string):HTMLElement{

        let div = document.createElement('div');
        div.style.display="inline-block"
        div.style.position="absolute"
        if (bottom) div.style.bottom="0"
        else div.style.top="0"
         div.style.left="0"
        div.style.width="100%"
        div.style.height=heightCSS
        div.style.zIndex=(parseInt($container.style.zIndex)+10)+""
        //div.style.backgroundColor="red"
        if (separatorCSS!=null) div.style.borderTop=separatorCSS
        $container.appendChild(div)
        
        return div
        
        // position: absolute;
        // height: 20px;
        // width: 100%;
        // left: 0;
        // bottom: 0;
    }



//
//     export var twoCanvas:string='<canvas  id="renderCanvas3" style="height:300px;width:30%;background-color:red"></canvas><canvas  id="renderCanvas2" style="height: 300px;width: 30%;background-color: blue"></canvas>'
// //         `<canvas  id="renderCanvas3" style="height: 300px;width: 30%;background-color: red"></canvas><!--
// // --><canvas  id="renderCanvas2" style="height: 300px;width: 30%;background-color: blue"></canvas>`


}