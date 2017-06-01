/**
 * Created by Gwenael on 06/05/2017.
 */


module mathis {
    export module materials {
        import ShaderMaterial = BABYLON.ShaderMaterial;

        export class GradientColor {
            errColor : Color = new Color("#000");
            colors : Array<[number,Color]>;

            constructor(colors : Color[],min=0,max=1) {
                this.colors = [];

                //let [a,b] = [-0.0000000001,1.0000000001];
                max+= 0.0001
                min+=-0.0001

                let range = (max - min)/(colors.length-1);
                for(let i = 0;i < colors.length;i++)

                    this.colors.push([i * range + min,colors[i]]);

            }

            static colorToVec3(color : Array<number>) {
                return "vec3(" + color[0].toFixed(10) + "," + color[1].toFixed(10) + "," + color[2].toFixed(10) + ")";
            }

            public toWebGLCode(color : string,x : string) : string {
                // toBABYLON_Color3
                let code = "";
                for(let i = 0;i < this.colors.length-1;i++) {
                    let x1 = this.colors[i][0];
                    let x2 = this.colors[i+1][0];

                    code += "if(" + x1.toFixed(10) + " <= " + x + " && "
                        + x + " <= " + x2.toFixed(10) + ") ";

                    let c1 = this.colors[i][1].toBABYLON_Color3().asArray();
                    let c2 = this.colors[i+1][1].toBABYLON_Color3().asArray();

                    code += color + " = (";
                    code += GradientColor.colorToVec3(c2) + "*("+x+"+"+(-x1).toFixed(10)+") + ";
                    code += GradientColor.colorToVec3(c1) + "*("+x2.toFixed(10)+"-"+x+"))";
                    code += " / " + (x2-x1).toFixed(10) + ";";
                    code += " else ";
                }

                let errColor = this.errColor.toBABYLON_Color3().asArray();
                code += color + " = " + GradientColor.colorToVec3(errColor) + ";";

                return code;

            }
        }

        export class Shader {
            private static shaderId = 0;
            protected id : string;
            scene = null;

            constructor(scene : BABYLON.Scene) {
                this.scene = scene;
                this.id = "mathis_tmp_" + FuncMapperShader.shaderId.toString();
                FuncMapperShader.shaderId++;
            }

            set fragmentShader(str : string) {
                BABYLON.Effect.ShadersStore[this.id + "FragmentShader"] = str;
            }

            set vertexShader(str : string) {
                BABYLON.Effect.ShadersStore[this.id + "VertexShader"] = str;
            }
        }

        export class FuncMapperShader extends Shader {
            func : string;
            gradient : GradientColor = null;

            constructor(func : string,scene : BABYLON.Scene){
                super(scene);
                this.func = func;
            }

            go() : ShaderMaterial {
                this.vertexShader = `
                    precision highp float;
                    attribute vec3 position;
                    uniform mat4 worldViewProjection;
                    varying vec3 vPosition;
                    void main(void) {
                        vPosition = position;
                        gl_Position = worldViewProjection * vec4(position,1.);
                }`;

                let gradient = this.gradient;
                if(gradient == null)
                    gradient = new GradientColor(
                        [new Color("#2211dd"),
                        new Color("#dd1122")]
                    );

                let tmpCode = gradient.toWebGLCode("color","func");
                let funcCode = "func = " + this.func.replace(/x|y|z/g,"vPosition.$&") + ";";

                this.fragmentShader = `
                    precision highp float;

                    varying vec3 vPosition;
                    void main(void) {
                        vec3 color;
                        float func;
                        ` + funcCode + `;
                        ` + tmpCode + `;
                        color = clamp(color,0.,1.);
                        gl_FragColor = vec4(color,1.);
                }`;

                return new BABYLON.ShaderMaterial("",this.scene,{
                    vertexElement   : this.id,
                    fragmentElement : this.id
                },{
                    attributes : ["position"],
                    uniforms   : ["worldViewProjection"]
                });
            }

        }

    }
}