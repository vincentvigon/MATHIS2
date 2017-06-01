/**
 * Created by Gwenael on 06/05/2017.
 */

    module random {

        let gaussian_last : number;
        let gaussian_use_last : boolean = false;
        export function nextGaussian(mean : number = 0.,stdev : number = 1.) : number {
            let gaussian_std;

            if(gaussian_use_last) {
                gaussian_use_last = false;
                gaussian_std = gaussian_last;
            } else {
                let x1,x2,w;
                do {
                    x1 = 2.0 * Math.random() - 1.0;
                    x2 = 2.0 * Math.random() - 1.0;
                    w = x1 * x1 + x2 * x2;
                } while(w >= 1.0);
                w = Math.sqrt((-2.0 * Math.log(w)) / w);

                gaussian_use_last = true;
                gaussian_last = x2 * w;
                gaussian_std = x1 * w;
            }

            return mean + stdev * gaussian_std;
        }

    export function randomGaussians(n : number|Float32Array,mean : number = 0.,stdev : number = 1.) : Float32Array {
            let tab : Float32Array = null;
            if(n instanceof Float32Array)
                tab = n;
            else
                tab = new Float32Array(n);

            for(let i = 0;i < tab.length;i++) {
                tab[i] = nextGaussian(mean,stdev);
            }

            return tab;
        }
    }