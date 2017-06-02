/**
 * Created by Gwenael on 06/05/2017.
 */
module exports {
    function getC2(r,alpha) {
        if(alpha <= 1.5)
            return alpha/2;
        else {
            let beta = alpha*(2-alpha)/(3*r*(r*r-1));
            return (alpha - beta * (r-1)*(r-1) * (r+2))/2;
        }
    }

    function rho(x,y,r,alpha) {
        let beta,c0,c2;
        if(alpha <= 1.5) {
            beta = 0;
            c2 = alpha/2;
            c0 = 1-c2;
        } else {
            beta = alpha*(2-alpha)/(3*r*(r*r-1));
            c2 = (alpha - beta * (r-1)*(r-1) * (r+2))/2;
            c0 = beta * (r-1)**3 + 1 - c2;
        }

        let s = Math.sqrt((x[0] - y[0]) * (x[0] - y[0]) + (x[1] - y[1]) * (x[1] - y[1]));
        // let s = (x[0] - y[0]) + (x[1] - y[1]);
        // let s = Math.pow((x[0] - y[0]) ** 3 + (x[1] - y[1]) ** 3,1./3);
        // let s = Math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 4);
        if(s <= 1)
            return c0 - Math.pow(s,alpha) + c2 * s*s;
        else if(s <= r)
            return beta * (r-s)**3 / s;
        else
            return 0;
    }

    export function genBrownian(n = 100,r = 2,h = 0.8) {
        let m = n;

        let [wr,hr] = [2*n-2,2*m-2];
        let rows = new Float32Array(wr * hr);
        let tmp = [0,0];
        for(let i = 0 ;i < n;i++) {
            for(let j = 0 ;j < m;j++)
                rows[i * hr + j] = rho([i*r/n,j*r/m],tmp,r,2*h);
        }

        for(let i = 1 ;i < n-1;i++) {
            rows[(wr - i) * hr] = rows[i * hr];
        }
        for(let j = 1; j < m-1; j++) {
            rows[(hr - j)]      = rows[j];
        }
        for(let i = 1 ;i < n-1;i++) {
            for(let j = 1; j < m-1; j++) {
                rows[(wr - i) * hr + j]        = rows[i * hr + j];
                rows[i * hr + (hr - j)]        = rows[i * hr + j];
                rows[(wr - i) * hr + (hr - j)] = rows[i * hr + j];
            }
        }

        let data = fft.FFT2D(new fft.ComplexArray(rows),hr,wr);
        /*const data = new fft.ComplexArray(wr * hr).map((value, i, n) => {
            value.real = rows[i];
            value.imag = 0;
        });*/
        let z_i = random.randomGaussians(wr * hr);
        let z_r = random.randomGaussians(wr * hr);
        // let z_r = new Float32Array(wr * hr);
        data.map((val,i,n) => {
            val.real *= Math.sqrt(wr * hr); // FFT normalisation
            val.real /= wr * hr;
            // console.log(val.real,val.imag," -> ",Math.sqrt(val.real));

            if(val.real >= 0) {
                val.imag = Math.sqrt(val.real) * z_i[i];
                val.real = Math.sqrt(val.real) * z_r[i];
            } else {
                val.imag = Math.sqrt(-val.real) * z_r[i];
                val.real = -Math.sqrt(-val.real) * z_i[i];
            }
        });
        data = fft.FFT2D(data,hr,wr);

        let field = new Float32Array(n * m);
        for(let i = 0 ;i < n;i++) {
            for(let j = 0 ;j < m;j++) {
                field[i*m + j] = data.real[i*hr + j] * Math.sqrt(wr * hr); // FFT normalisation
            }
        }

        let mean = field[0];
        for(let i = 0;i < n * m;i++) {
            field[i] -= mean;
            //console.log(field[i]);
        }

        //*
        let [wx,wy] = [random.nextGaussian(),random.nextGaussian()];
        for(let i = 0 ;i < n;i++) {
            for(let j = 0 ;j < m;j++) {
                field[i*m + j] += (i*r/n * wx + j*r/m * wy) * Math.sqrt(2*getC2(r,2*h));
            }
        }
        //*/

        return field;
    }

    export function test_fft() {

        let wr = 200
        let hr = 100


        let rows = new Float32Array(wr * hr);
        for(let i = 0;i < wr*hr;i++)
            rows[i] = 1;


        let data = new fft.ComplexArray(rows) //fft.FFT2D(new fft.ComplexArray(rows),hr,wr);

        data = fft.FFT2D(data,hr,wr);
        data.map((val,i,n) => {
            console.log(i,' -> ',val.real,' + ',val.imag,'i');
        });


    }
}
