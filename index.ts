
declare function prettyPrint()

module mathis{

    export module appli{


        class MainIndexPage extends IndexPage{


            constructor(mathisFrame:MathisFrame,testMode:boolean){
               super(mathisFrame,testMode)
            }

             build(){

                this.severalPages.addPage(new WhyBlabla(this.mathisFrame))
                this.severalPages.addPage(new PureJavascriptTuto())
                this.severalPages.addPage(new TypescriptTuto())
                this.severalPages.addPage(new MathisFrameDocu(this.mathisFrame))
                this.severalPages.addPage(new BasicDocu(this.mathisFrame))
                this.severalPages.addPage(new ReseauDocu(this.mathisFrame))
                this.severalPages.addPage( new SurfaceDocu(this.mathisFrame))
                this.severalPages.addPage( new LinksDocu(this.mathisFrame))
                this.severalPages.addPage(new MacamDocu(this.mathisFrame))
                this.severalPages.addPage( new VerticesViewingDocu(this.mathisFrame))
                this.severalPages.addPage( new LinesViewingDocu(this.mathisFrame))
                this.severalPages.addPage( new LinksViewingDocu(this.mathisFrame))
                this.severalPages.addPage(new SurfaceViewerDocu(this.mathisFrame))
                this.severalPages.addPage(new GraphDistance(this.mathisFrame))
                this.severalPages.addPage(new GrateMergeStick(this.mathisFrame))
                this.severalPages.addPage( new DichoDocu(this.mathisFrame))

                 this.severalPages.addSeparator("CONSTRUCTIONS EXAMPlE")
                 this.severalPages.addPage( new SolidsDocu(this.mathisFrame))
                 this.severalPages.addPage( new TorusPlatonicDocu(this.mathisFrame))
                 // this.severalPages.addPage( new RandomGraphDocu(this.mathisFrame))



                 /**for coder*/
                 this.severalPages.addSeparator("FOR COLLABORATORS")
                 this.severalPages.addPage( new ColaborateWithGit())
                 this.severalPages.addPage( new DocutestTuto())
                 this.severalPages.addPage( new DocutestTutoAdvanced())


                 /**pure test*/
                 this.severalPages.addSeparator("PURE TEST (NO DOCU)",true)
                 this.severalPages.addPage( new Creation2dDocu(this.mathisFrame),true)

                 this.severalPages.addSeparator("GUILLAUME'S PAGES",true)
                 this.severalPages.addPage( new ConnectorTest(this.mathisFrame),true)

            }
        }

        export var indexPage:IndexPage

        export function startSite(){
            let mathisFrame=new MathisFrame('placeForMathis')
            /**Attention : la variable globale indexPage est affectée APRES la construction de MainIndexPage.
             * Pour toutes les opérations qui se font pendant la construction, indexPage est null ! */
            indexPage=new MainIndexPage(mathisFrame,false)

            indexPage.go()

        }










    }








}

