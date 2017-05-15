declare module mathis {
    module gauss {
        function start(): void;
    }
}
declare module mathis {
    module testFront {
        function start(): void;
    }
}
declare module mathis {
    module appli {
        enum Keywords {
            basic = 0,
            tool = 1,
            math = 2,
            forDeveloper = 3,
            proba = 4,
        }
        module conv {
            var $$$: string;
            var spacesToSuppress: string;
            var toIncludeAtTheBeginOfTheFirstHiddenPiece: string[];
            var traitementsForEachLine: ((line: string) => string)[];
            var begin: string[];
            var beginHidden: string[];
            var end: string[];
            var endHidden: string[];
        }
        enum ChoicesOptionsType {
            select = 0,
            button = 1,
        }
        interface ChoicesOptions {
            type?: ChoicesOptionsType;
            before?: any;
            label?: any;
            visualValues?: string[];
            onchange?: () => void;
            containerName?: string;
        }
        class Choices {
            key: string;
            values: any[];
            initialValueMemorized: any;
            options: ChoicesOptions;
            constructor(values: any, options?: ChoicesOptions);
            $select: HTMLSelectElement;
            $button: $Button;
            $parent: any;
            changePossibleValues(values: any[], visualValues?: any[], indexPage?: any): void;
            show(): void;
            hide(): void;
        }
        interface PieceOfCode {
            goForTheFirstTime(): void;
            go(): void;
            NAME: string;
            TITLE?: string;
            CREATOR?: string;
            KEYWORDS?: Keywords[];
            NO_TEST?: boolean;
            NEED_SCENE?: boolean;
            COMMAND_DICO?: StringMap<Choices>;
            toIncludeAtTheBeginOfTheFirstHiddenPiece?: string[];
        }
        function buildCommandDico(pieceOfCode: PieceOfCode): void;
        class Binder {
            private pieceOfCode;
            private defaultContainer;
            private mathisFrame;
            selectAndAroundClassName: any;
            private keyTo$select;
            private keyTo$button;
            onConfigChange: () => void;
            containersToPutCommand: StringMap<any>;
            pushState: boolean;
            indexPage: any;
            constructor(pieceOfCode: PieceOfCode, defaultContainer: any, mathisFrame: MathisFrame);
            setAllSelectsAccordingToPieceOfCode(): void;
            private go_fired;
            go(): void;
            whenSelectOrButtonChange(choices: Choices): void;
        }
        class $Button {
            visualValues: any[];
            selectedIndex: number;
            onclick: () => void;
            $visual: any;
            constructor();
            increment(): void;
            updateVisual(): void;
        }
        function pieceOfCodeToConfiguration(pieceOfCode: PieceOfCode): any;
        function pieceOfCodeToSrotedConfigurationAttributes(pieceOfCode: PieceOfCode): string[];
    }
}
declare module mathis {
    var myFavoriteColors: {
        green: BABYLON.Color3;
    };
    class UV {
        u: number;
        v: number;
        constructor(u: number, v: number);
    }
    class M22 {
        m11: number;
        m12: number;
        m21: number;
        m22: number;
        determinant(): number;
        inverse(): M22;
        multiplyUV(uv: UV): UV;
    }
    class XYZ extends BABYLON.Vector3 implements HasHashString {
        static lexicalOrder: (a: XYZ, b: XYZ) => number;
        static lexicalOrderInverse: (a: XYZ, b: XYZ) => number;
        static nbDecimalForHash: number;
        static resetDefaultNbDecimalForHash(): void;
        readonly hashString: string;
        constructor(x: number, y: number, z: number);
        static newZero(): XYZ;
        static newFrom(vect: XYZ): XYZ;
        static newOnes(): XYZ;
        static newRandom(): XYZ;
        static temp0(x: any, y: any, z: any): XYZ;
        static temp1(x: any, y: any, z: any): XYZ;
        add(vec: XYZ): XYZ;
        resizes(vec: XYZ): XYZ;
        multiply(vec: XYZ): XYZ;
        substract(vec: XYZ): XYZ;
        scale(factor: number): XYZ;
        copyFrom(vect: XYZ): XYZ;
        copyFromFloats(x: number, y: number, z: number): XYZ;
        changeBy(x: number, y: number, z: number): this;
        normalize(): XYZ;
        almostEqual(vect: XYZ): boolean;
        toString(deci?: number): string;
    }
    class XYZW extends BABYLON.Quaternion {
        constructor(x: number, y: number, z: number, w: number);
        multiply(quat: XYZW): XYZW;
    }
    class Hash {
        static segment(a: Vertex, b: Vertex): string;
        static segmentOrd(a: Vertex, b: Vertex): Vertex[];
        static quad(a: Vertex, b: Vertex, c: Vertex, d: Vertex): string;
        static quadOrd(a: Vertex, b: Vertex, c: Vertex, d: Vertex): Vertex[];
    }
    class Positioning {
        position: XYZ;
        frontDir: XYZ;
        upVector: XYZ;
        scaling: XYZ;
        private defaultUpDirIfTooSmall;
        private defaultFrontDirIfTooSmall;
        copyFrom(positionning: Positioning): void;
        changeFrontDir(vector: XYZ): void;
        changeUpVector(vector: XYZ): void;
        setOrientation(frontDir: any, upVector: any): void;
        quaternion(preserveUpVectorInPriority?: boolean): XYZW;
        applyToMeshes(meshes: BABYLON.Mesh[]): void;
        applyToVertices(vertices: Vertex[]): void;
    }
    class MM extends BABYLON.Matrix {
        constructor();
        static newIdentity(): MM;
        static newFrom(matr: MM): MM;
        static newRandomMat(): MM;
        static newZero(): MM;
        equal(matr: MM): boolean;
        almostEqual(matr: MM): boolean;
        leftMultiply(matr: MM): MM;
        rightMultiply(matr: MM): MM;
        inverse(): MM;
        copyFrom(matr: MM): MM;
        transpose(): MM;
        toString(): string;
    }
    class Link {
        to: Vertex;
        opposites: Link[];
        weight: number;
        customerOb: any;
        constructor(to: Vertex);
    }
    class Vertex {
        static hashCount: number;
        private _hashCode;
        readonly hashNumber: number;
        readonly hashString: string;
        links: Link[];
        position: XYZ;
        isInvisible: boolean;
        dichoLevel: number;
        param: XYZ;
        markers: Vertex.Markers[];
        importantMarker: Vertex.Markers;
        customerObject: any;
        setPosition(x: number, y: number, z: number, useAlsoTheseValuesForParam?: boolean): Vertex;
        hasMark(mark: Vertex.Markers): boolean;
        constructor();
        getOpposites(vert1: Vertex): Vertex[];
        hasBifurcations(): boolean;
        hasVoisin(vertex: Vertex): boolean;
        isBorder(): boolean;
        findLink(vertex: Vertex): Link;
        setTwoOppositeLinks(cell1: Vertex, cell2: Vertex): Vertex;
        setOneLink(vertex: Vertex): Vertex;
        static separateTwoVoisins(v1: Vertex, v2: Vertex): void;
        private suppressOneLink(voisin);
        changeToLinkWithoutOpposite(voisin: Vertex): void;
        toString(toSubstract: number): string;
        toStringComplete(toSubstract: number): string;
    }
    module Vertex {
        enum Markers {
            honeyComb = 0,
            corner = 1,
            center = 2,
            border = 3,
            polygonCenter = 4,
            selectedForLineDrawing = 5,
        }
    }
    class Mamesh {
        vertices: Vertex[];
        lines: Line[];
        smallestTriangles: Vertex[];
        smallestSquares: Vertex[];
        hexahedrons: Vertex[];
        vertexToPositioning: HashMap<Vertex, Positioning>;
        cutSegmentsDico: {
            [id: string]: Segment;
        };
        name: string;
        readonly polygons: Vertex[][];
        readonly linesWasMade: boolean;
        readonly segments: Vertex[][];
        addATriangle(a: Vertex, b: Vertex, c: Vertex): Mamesh;
        addASquare(a: Vertex, b: Vertex, c: Vertex, d: Vertex): Mamesh;
        addHexahedron(pos: Vertex[]): Mamesh;
        getVertex(pos: XYZ): Vertex;
        newVertex(position: XYZ, dichoLevel?: number, param?: XYZ): Vertex;
        findVertexFromParam(param: XYZ): Vertex;
        addVertex(vertex: Vertex): void;
        hasVertex(vertex: Vertex): boolean;
        getStraightLines(): Line[];
        getLoopLines(): Line[];
        getStraightLinesAsVertices(): Vertex[][];
        getLoopLinesAsVertices(): Vertex[][];
        toString(substractHashCode?: boolean): string;
        fillLineCatalogue(startingVertices?: Vertex[]): void;
        addSimpleLinksAroundPolygons(): void;
        addOppositeLinksAroundPolygons(): void;
        isolateMameshVerticesFromExteriorVertices(): void;
        getOrCreateSegment(v1: Vertex, v2: Vertex, segments: {
            [id: string]: Segment;
        }): void;
        maxLinkLength(): number;
        clearLinksAndLines(): void;
        clearOppositeInLinks(): void;
        allLinesAsASortedString(substractHashCode?: boolean): string;
        allSquareAndTrianglesAsSortedString(subtractHashCode?: boolean): string;
        private allSquaresOrTrianglesAsASortedString(squareOrTriangles, blockSize, toSubtract);
    }
    class Line {
        vertices: Vertex[];
        isLoop: boolean;
        getVertex(index: any, loopIfLoop?: boolean): Vertex;
        hashForDirected(): string;
        inverted(): Line;
        positionList(): XYZ[];
        readonly hashString: string;
        positionnalHashForDirected(precision?: number): string;
        positionnalHash(precision?: number): string;
        hashStringUpToSymmetries(symmetries: ((xyz: XYZ) => XYZ)[], positionVersusParam: any): string;
        constructor(vertices: Vertex[], isLoop: boolean);
        allSegments(): Segment[];
    }
    class Segment {
        static segmentId(a: number, b: number): string;
        a: Vertex;
        b: Vertex;
        middle: Vertex;
        orth1: Vertex;
        orth2: Vertex;
        readonly hashString: string;
        constructor(c: Vertex, d: Vertex);
        equals(ab: Segment): boolean;
        getOther(c: Vertex): Vertex;
        getFirst(): Vertex;
        getSecond(): Vertex;
        has(c: Vertex): boolean;
    }
}
declare module mathis {
    class Color {
        private rgb;
        constructor(color: number | string | RGB_range255 | HSV_01);
        static names: {
            aliceblue: string;
            antiquewhite: string;
            aqua: string;
            aquamarine: string;
            azure: string;
            beige: string;
            bisque: string;
            black: string;
            blanchedalmond: string;
            blue: string;
            blueviolet: string;
            brown: string;
            burlywood: string;
            burntsienna: string;
            cadetblue: string;
            chartreuse: string;
            chocolate: string;
            coral: string;
            cornflowerblue: string;
            cornsilk: string;
            crimson: string;
            cyan: string;
            darkblue: string;
            darkcyan: string;
            darkgoldenrod: string;
            darkgray: string;
            darkgreen: string;
            darkgrey: string;
            darkkhaki: string;
            darkmagenta: string;
            darkolivegreen: string;
            darkorange: string;
            darkorchid: string;
            darkred: string;
            darksalmon: string;
            darkseagreen: string;
            darkslateblue: string;
            darkslategray: string;
            darkslategrey: string;
            darkturquoise: string;
            darkviolet: string;
            deeppink: string;
            deepskyblue: string;
            dimgray: string;
            dimgrey: string;
            dodgerblue: string;
            firebrick: string;
            floralwhite: string;
            forestgreen: string;
            fuchsia: string;
            gainsboro: string;
            ghostwhite: string;
            gold: string;
            goldenrod: string;
            gray: string;
            green: string;
            greenyellow: string;
            grey: string;
            honeydew: string;
            hotpink: string;
            indianred: string;
            indigo: string;
            ivory: string;
            khaki: string;
            lavender: string;
            lavenderblush: string;
            lawngreen: string;
            lemonchiffon: string;
            lightblue: string;
            lightcoral: string;
            lightcyan: string;
            lightgoldenrodyellow: string;
            lightgray: string;
            lightgreen: string;
            lightgrey: string;
            lightpink: string;
            lightsalmon: string;
            lightseagreen: string;
            lightskyblue: string;
            lightslategray: string;
            lightslategrey: string;
            lightsteelblue: string;
            lightyellow: string;
            lime: string;
            limegreen: string;
            linen: string;
            magenta: string;
            maroon: string;
            mediumaquamarine: string;
            mediumblue: string;
            mediumorchid: string;
            mediumpurple: string;
            mediumseagreen: string;
            mediumslateblue: string;
            mediumspringgreen: string;
            mediumturquoise: string;
            mediumvioletred: string;
            midnightblue: string;
            mintcream: string;
            mistyrose: string;
            moccasin: string;
            navajowhite: string;
            navy: string;
            oldlace: string;
            olive: string;
            olivedrab: string;
            orange: string;
            orangered: string;
            orchid: string;
            palegoldenrod: string;
            palegreen: string;
            paleturquoise: string;
            palevioletred: string;
            papayawhip: string;
            peachpuff: string;
            peru: string;
            pink: string;
            plum: string;
            powderblue: string;
            purple: string;
            rebeccapurple: string;
            red: string;
            rosybrown: string;
            royalblue: string;
            saddlebrown: string;
            salmon: string;
            sandybrown: string;
            seagreen: string;
            seashell: string;
            sienna: string;
            silver: string;
            skyblue: string;
            slateblue: string;
            slategray: string;
            slategrey: string;
            snow: string;
            springgreen: string;
            steelblue: string;
            tan: string;
            teal: string;
            thistle: string;
            tomato: string;
            turquoise: string;
            violet: string;
            wheat: string;
            white: string;
            whitesmoke: string;
            yellow: string;
            yellowgreen: string;
        };
        hex2rgb(hex: any): any;
        lighten(by: number): Color;
        darken(by: number): Color;
        toBABYLON_Color4(): BABYLON.Color4;
        toBABYLON_Color3(): BABYLON.Color3;
        toString(): string;
        private intToColorName(int);
    }
    class HSV_01 {
        h: number;
        s: number;
        v: number;
        alpha: number;
        static HSV_01_toRGB_01(h: number, s: number, v: number): {
            r: number;
            g: number;
            b: number;
        };
        constructor(h: number, s: number, v: number, alpha?: number);
        toRGB(): RGB_range255;
    }
    class RGB_range255 {
        r: number;
        g: number;
        b: number;
        alpha: number;
        constructor(r: number, g: number, b: number, alpha?: number);
        private getHexPart(v);
        setRed(value: number): RGB_range255;
        setGreen(value: number): RGB_range255;
        setBlue(value: number): RGB_range255;
        setAlpha(a: number): RGB_range255;
        lighten(by: number): RGB_range255;
        darken(by: number): RGB_range255;
        toString(): string;
    }
    module color {
        module thema {
            var defaultSurfaceColor: Color;
            var defaultVertexColor: Color;
            var defaultLinkColor: Color;
        }
    }
    function HSVtoRGB(h: number, s: number, v: number, hasCSSstring?: boolean): any;
    function hexToRgb(hex: string, maxIs255?: boolean): {
        r: number;
        g: number;
        b: number;
    };
    function rgbToHex(r: any, g: any, b: any): string;
}
declare module mathis {
    module creation2D {
        enum PartShape {
            triangulatedTriangle = 0,
            triangulatedRect = 1,
            square = 2,
            polygon3 = 3,
            polygon4 = 4,
            polygon5 = 5,
            polygon6 = 6,
            polygon7 = 7,
            polygon8 = 8,
            polygon9 = 9,
            polygon10 = 10,
            polygon11 = 11,
            polygon12 = 12,
        }
        class Concentric {
            SUB_gratAndStick: grateAndGlue.ConcurrentMameshesGraterAndSticker;
            SUB_oppositeLinkAssocierByAngles: linkModule.OppositeLinkAssocierByAngles;
            SUB_mameshCleaner: mameshModification.MameshCleaner;
            origine: XYZ;
            end: XYZ;
            rotation: number;
            shapes: PartShape[];
            proportions: UV[];
            individualScales: UV[];
            individualRotations: number[];
            individualTranslation: XYZ[];
            nbPatches: number;
            toleranceToBeOneOfTheClosest: number;
            stratesToSuppressFromCorners: number[];
            scalingBeforeOppositeLinkAssociations: XYZ;
            propBeginToRound: number[];
            propEndToRound: number[];
            integerBeginToRound: number[];
            integerEndToRound: number[];
            exponentOfRoundingFunction: number[];
            percolationProba: number[];
            forceToGrate: number[];
            private nbI;
            private nbJ;
            constructor(individualNbI: number, individualNbJ: number);
            go(): Mamesh;
        }
        class Patchwork extends Concentric {
            nbPatchesI: number;
            nbPatchesJ: number;
            patchesInQuinconce: boolean;
            oddPatchLinesAreTheSameVersusLongerVersusShorter: number;
            alternateShapeAccordingIPlusJVersusCounter: boolean;
            constructor(nbI: number, nbJ: number, nbIPart: number, nbJPart: number);
            go(): Mamesh;
        }
    }
}
declare module mathis {
    module creation3D {
        class Snake {
            maxLength: number;
            mathisFrame: MathisFrame;
            curentLength: number;
            serpentRadius: number;
            serpentMesh: BABYLON.Mesh;
            headSerpent: BABYLON.Mesh;
            path: XYZ[];
            sliceInsteadOfElongateWhenMaxLengthIsReached: boolean;
            initialPosition: XYZ;
            constructor(mathisFrame: MathisFrame);
            go(): void;
            contractInOnePoint(point: XYZ): void;
            elongateTo(point: XYZ): void;
            bobySliceTo(point: XYZ): void;
            updateMeshes(): void;
            getHeadPosition(): XYZ;
        }
        class ArrowCreator {
            totalHeight: number;
            bodyProp: number;
            headProp: number;
            bodyDiameterProp: number;
            headDiameterProp: number;
            headUp: boolean;
            arrowFootAtOrigin: boolean;
            scene: BABYLON.Scene;
            quaternion: XYZW;
            subdivision: number;
            color: Color;
            constructor(scene: BABYLON.Scene);
            go(): BABYLON.Mesh;
        }
        class TwoOrThreeAxisMerged {
            twoOrThreeAxis: TwoOrTreeAxis;
            scene: BABYLON.Scene;
            constructor(scene: BABYLON.Scene);
            go(): BABYLON.Mesh;
        }
        class TwoOrTreeAxis {
            SUB_x_axisCreator: ArrowCreator;
            SUB_y_axisCreator: ArrowCreator;
            SUB_z_axisCreator: ArrowCreator;
            isLeftHandSided: boolean;
            addColor: boolean;
            threeVersusTwoAxis: boolean;
            addLabelsXYZ: boolean;
            scene: BABYLON.Scene;
            constructor(scene: BABYLON.Scene);
            go(): BABYLON.Mesh[];
        }
        class FlagWithText {
            scene: BABYLON.Scene;
            text: string;
            font: string;
            color: string;
            backgroundColor: string;
            constructor(scene: BABYLON.Scene);
            go(): BABYLON.Mesh;
        }
    }
}
declare module mathis {
    module debug {
        function verticesToString(vertices: Vertex[]): string;
        function verticesFamilyToString(verticesFamily: Vertex[][]): string;
        function objToString(array: any[]): string;
        function checkTheRegularityOfAGraph(vertices: Vertex[]): void;
    }
}
declare module mathis {
    module differentialSystem {
        class TwoDim {
            originMath: XYZ;
            endMath: XYZ;
            originView: XYZ;
            endView: XYZ;
            nbI: number;
            nbJ: number;
            departure: XYZ;
            mathisFrame: MathisFrame;
            deltaT: number;
            vectorsAreArrowsVersusCone: boolean;
            scaleVectorsAccordingToTheirNorm: boolean;
            randomExitation: () => XYZ;
            makeLightAndCamera: boolean;
            private planForClick;
            private mamesh;
            private positionings;
            private vectorReferencesize;
            private arrowModel;
            private generator;
            vectorFieldForNoise: (t: number, p: XYZ, res: XYZ) => void;
            private vectorFieldForNoiseScaled;
            vectorField: (t: number, p: XYZ, res: XYZ) => void;
            private vectorFieldScaled;
            constructor(vectorField: (t: number, p: XYZ, res: XYZ) => void, mathisFrame: MathisFrame);
            go(): void;
            private makePlanForClick();
            private lightAndCamera();
            private stochasticVariation;
            private dW;
            private computeNewPathPoint(previousPoint, t, res);
            private scaler;
            private mameshAndPositioning();
            private createArrowModel();
            loadVectorFields(): void;
            start(): void;
            private verticeSorted;
            prepareRescaling(): void;
            private functionToSortvertex;
            rescaleVectors(vertexRefSize: any): void;
        }
    }
}
declare module mathis {
    module infiniteWorlds {
        enum NameOfReseau3D {
            cube = 0,
            hexagone = 1,
            doubleHexagone = 2,
        }
        class InfiniteCartesian {
            nameOfResau3d: NameOfReseau3D;
            nbVerticalDecays: number;
            nbHorizontalDecays: number;
            fondamentalDomainSize: number;
            nbSubdivision: number;
            nbRepetition: number;
            fogDensity: number;
            drawFondamentalDomain: boolean;
            recenterCamera: boolean;
            notDrawMeshesAtFarCorners: boolean;
            population: BABYLON.AbstractMesh[];
            collisionOnLinks: boolean;
            collisionOnVertices: boolean;
            collisionForCamera: boolean;
            nbSidesOfLinks: number;
            buildLightCameraSkyboxAndFog: boolean;
            private fd;
            private mathisFrame;
            private mamesh;
            constructor(mathisFrame: MathisFrame);
            go(): void;
            addAndMultiplyPopulation(): void;
            seeWorldFromOutside(): void;
            seeWorldFromInside(): void;
            getCamera(): macamera.GrabberCamera;
            getGrabber(): macamera.Grabber;
            private cameraLight();
            private creationOfReseau();
            getTotalSize(): number;
            private vertexVisualization(mamesh2, wallDiffuseTexture);
            private linksVisualization(ma, wallDiffuseTexture);
            private fogAndSkybox();
        }
    }
}
declare module mathis {
    module mecaStat {
        class IsingOnMesh {
            q: number;
            beta: number;
            sphereRadius: number;
            frameInterval: number;
            nbActionsPerIteration: number;
            defineLightAndCamera: boolean;
            nbDicho: number;
            private mathisFrame;
            constructor(mathisFrame: MathisFrame);
            go(): void;
            private lightAndCam();
            meshAndIsing(): void;
            sphereModel(color: any): BABYLON.Mesh;
        }
    }
}
declare module mathis {
    class Geo {
        copyXYZ(original: XYZ, result: XYZ): XYZ;
        copyXyzFromFloat(x: number, y: number, z: number, result: XYZ): XYZ;
        copyMat(original: MM, result: MM): MM;
        matEquality(mat1: MM, mat2: MM): boolean;
        matAlmostEquality(mat1: MM, mat2: MM): boolean;
        xyzEquality(vec1: XYZ, vec2: XYZ): boolean;
        epsilon: number;
        epsilonSquare: number;
        epsitlonForAlmostEquality: number;
        xyzAlmostEquality(vec1: XYZ, vec2: XYZ): boolean;
        xyzwAlmostEquality(vec1: XYZW, vec2: XYZW): boolean;
        almostLogicalEqual(quat1: XYZW, quat2: XYZW): boolean;
        xyzAlmostZero(vec: XYZ): boolean;
        almostEquality(a: number, b: number): boolean;
        inverse(m1: MM, result: MM): void;
        private _resultTransp;
        transpose(matrix: MM, result: MM): void;
        multiplyMatMat(m1: MM, other: MM, result: MM): void;
        private baryResult;
        private _scaled;
        baryCenter(xyzs: XYZ[], weights: number[], result: XYZ): void;
        between(v1: XYZ, v2: XYZ, alpha: number, res: XYZ): void;
        betweenUV(v1: UV, v2: UV, alpha: number, res: UV): void;
        private _matUn;
        private _source;
        unproject(source: XYZ, viewportWidth: number, viewportHeight: number, world: MM, view: MM, projection: MM, result: XYZ): void;
        private withinEpsilon(a, b);
        private _axis;
        axisAngleToMatrix(axis: XYZ, angle: number, result: MM): void;
        multiplicationMatrixVector(transformation: MM, vector: XYZ, result: XYZ): void;
        axisAngleToQuaternion(axis: XYZ, angle: number, result: XYZW): void;
        matrixToQuaternion(m: MM, result: XYZW): void;
        private _ortBasisV1;
        private _ortBasisV2;
        private _ortBasisV3;
        private _ortBasisAll;
        twoVectorsToQuaternion(v1: XYZ, v2: XYZ, firstIsPreserved: boolean, result: XYZW): void;
        private _basisOrtho0;
        private _basisOrtho1;
        private _basisOrtho2;
        private _basisMatrix;
        private _transposedBasisMatrix;
        private _diagoMatrix;
        orthogonalProjectionOnLine(direction: XYZ, result: MM): void;
        orthogonalProjectionOnPlane(direction: XYZ, otherDirection: XYZ, result: MM): void;
        translationOnMatrix(vector3: XYZ, result: MM): void;
        quaternionToMatrix(quaternion: XYZW, result: MM): void;
        quaternionMultiplication(q0: XYZW, q1: XYZW, result: XYZW): void;
        matt1: MM;
        matt2: MM;
        oor1: XYZ;
        oor2: XYZ;
        copA: XYZ;
        copB: XYZ;
        copC: XYZ;
        copD: XYZ;
        anOrthogonalMatrixMovingABtoCD(a: XYZ, b: XYZ, c: XYZ, d: XYZ, result: MM, argsAreOrthonormal?: boolean): void;
        matBefore: MM;
        aQuaternionMovingABtoCD(a: XYZ, b: XYZ, c: XYZ, d: XYZ, result: XYZW, argsAreOrthonormal?: boolean): void;
        slerp(left: XYZW, right: XYZW, amount: number, result: XYZW): void;
        matrixFromLines(line1: XYZ, line2: XYZ, line3: XYZ, result: MM): void;
        v1nor: XYZ;
        v2nor: XYZ;
        angleBetweenTwoVectorsBetween0andPi(v1: XYZ, v2: XYZ): number;
        almostParallel(v1: XYZ, v2: XYZ, oppositeAreParallel?: boolean, toleranceAngle?: number): boolean;
        _aCros: XYZ;
        angleBetweenTwoVectorsBetweenMinusPiAndPi(v1: XYZ, v2: XYZ, upDirection: XYZ): number;
        private _quat0;
        private _quat1;
        private _quatAlpha;
        private _mat0;
        private _mat1;
        private _matAlpha;
        private _c0;
        private _c1;
        slerpTwoOrthogonalVectors(a0: XYZ, b0: XYZ, a1: XYZ, b1: XYZ, alpha: number, aAlpha: XYZ, bAlpha: XYZ): void;
        interpolateTwoVectors(a0: XYZ, a1: XYZ, alpha: number, aAlpha: XYZ): void;
        scale(vec: XYZ, scalar: number, result: XYZ): void;
        add(v1: XYZ, v2: XYZ, result: XYZ): void;
        substract(v1: XYZ, v2: XYZ, result: XYZ): void;
        dot(left: XYZ, right: XYZ): number;
        norme(vec: XYZ): number;
        squareNorme(vec: XYZ): number;
        _crossResult: XYZ;
        cross(left: XYZ, right: XYZ, result: XYZ): void;
        v1forSubstraction: XYZ;
        randV2: XYZ;
        _result1: XYZ;
        _result2: XYZ;
        orthonormalizeKeepingFirstDirection(v1: XYZ, v2: XYZ, result1: XYZ, result2: XYZ): void;
        getOneOrthonormal(vec: XYZ, result: XYZ): void;
        normalize(vec: XYZ, result: XYZ): void;
        private spheCentToRayOri;
        private _resultInters;
        intersectionBetweenRayAndSphereFromRef(rayOrigine: XYZ, rayDirection: XYZ, aRadius: number, sphereCenter: XYZ, result1: XYZ, result2: XYZ): boolean;
        private difference;
        distance(vect1: XYZ, vect2: XYZ): number;
        squaredDistance(vect1: XYZ, vect2: XYZ): number;
        closerOf(candidat1: XYZ, canditat2: XYZ, reference: XYZ, result: XYZ): number;
        private _xAxis;
        private _yAxis;
        private _zAxis;
        LookAtLH(eye: XYZ, target: XYZ, up: XYZ, result: MM): void;
        OrthoOffCenterLH(left: number, right: any, bottom: number, top: number, znear: number, zfar: number, result: MM): void;
        PerspectiveFovLH(fov: number, aspect: number, znear: number, zfar: number, result: MM): void;
        numbersToMM(a0: number, a1: number, a2: number, a3: number, a4: number, a5: number, a6: number, a7: number, a8: number, a9: number, a10: number, a11: number, a12: number, a13: number, a14: number, a15: number, res: MM): void;
        private newHermite(value1, tangent1, value2, tangent2, amount);
        hermiteSpline(p1: XYZ, t1: XYZ, p2: XYZ, t2: XYZ, nbPoints: number, result: XYZ[]): void;
        quadraticBezier(v0: XYZ, v1: XYZ, v2: XYZ, nbPoints: number, result: XYZ[]): void;
        cubicBezier(v0: XYZ, v1: XYZ, v2: XYZ, v3: XYZ, nbPoints: number, result: XYZ[]): void;
        affineTransformGenerator(originIN: XYZ, endIN: XYZ, originOUT: XYZ, endOUT: XYZ): (vecIn: XYZ, vecOut: XYZ) => void;
    }
    module geometry {
        class CloseXYZfinder {
            nbDistinctPoint: number;
            maxDistToBeClose: number;
            private sourceEqualRecepter;
            private recepteurList;
            private sourceList;
            constructor(recepteurList: XYZ[], sourceList: XYZ[], nbDistinctPoint: number);
            deformationFunction: (point: XYZ) => XYZ;
            go(): {
                [id: number]: number;
            };
            private mins;
            private maxs;
            private buildScaler();
        }
        class LineInterpoler {
            points: XYZ[];
            options: InterpolationOption;
            constructor(points: XYZ[]);
            checkArgs(): void;
            private hermite;
            go(): XYZ[];
        }
        enum InterpolationStyle {
            hermite = 0,
            octavioStyle = 1,
            none = 2,
        }
        class InterpolationOption {
            loopLine: boolean;
            interpolationStyle: InterpolationStyle;
            nbSubdivisions: number;
            ratioTan: number;
        }
    }
}
declare module mathis {
    module graph {
        function getGroup(startingGroup: Vertex[], admissibleForGroup?: HashMap<Vertex, boolean>): Vertex[];
        class DistancesFromAGroup {
            centralCells: Vertex[];
            OUT_stratesAround: Vertex[][];
            private OUT_distances_dico;
            OUT_distance(vertex: Vertex): number;
            constructor(centralCells: Vertex[]);
            OUT_allGeodesics(vertex: Vertex, onlyOne?: boolean): Vertex[][];
            go(): void;
        }
        class HeuristicDiameter {
            private vertices;
            nbTimeOfNonEvolutionToStop: number;
            lookNonEvolutionWithDistanceVersusWithGroups: boolean;
            consecutiveExtremetDistances: number[];
            OUT_nbIteration: number;
            OUT_twoChosenExtremeVertices: Vertex[];
            OUT_geodesicsBetweenChosenExtremeVertices: Vertex[][];
            OUT_oneGeodesicBetweenChosenExtremeVertices: Vertex[][];
            constructor(vertices: Vertex[]);
            go(): number;
            private evolution();
        }
        class DistancesBetweenAllVertices {
            OUT_aMaxCouple: Vertex[];
            OUT_allExtremeVertex: Vertex[];
            allCounters: HashMap<Vertex, HashMap<Vertex, number>>;
            allVertices: Vertex[];
            allToTransmit: HashMap<Vertex, HashMap<Vertex, number>>;
            allFreshlyReceived: HashMap<Vertex, HashMap<Vertex, number>>;
            constructor(allVertices: Vertex[]);
            OUT_distance(vertex0: Vertex, vertex1: Vertex): number;
            OUT_allGeodesics(vertex0: Vertex, vertex1: Vertex, onlyOne?: boolean): Vertex[][];
            OUT_diameter: number;
            go(): void;
        }
        function getEdge(aGroup: Vertex[], CHANGING_nonAdmissibleForEdge?: HashMap<Vertex, boolean>): Vertex[];
        function getEdgeConsideringAlsoDiagonalVoisin(aGroup: Vertex[], CHANGING_nonAdmissibleForEdge?: HashMap<Vertex, boolean>, exactltyTwo?: boolean): Vertex[];
        function ringify(centralCells: Vertex[]): Array<Vertex[]>;
        function ringifyConsideringAlsoDiagonalVoisin(centralCells: Vertex[]): Array<Vertex[]>;
    }
}
declare module mathis {
    module grateAndGlue {
        class GraphGrater {
            IN_graphFamily: Vertex[][];
            seedsList: Vertex[][];
            OUT_allSeeds: Vertex[][];
            seedComputedFromBarycentersVersusFromAllPossibleCells: boolean;
            barycenterDecay: XYZ;
            proximityCoefToGrate: number[];
            proportionOfSeeds: number[];
            asymmetriesForSeeds: {
                direction: XYZ;
                influence: number;
                modulo?: number;
            }[];
            proximityMeasurer: ProximityMeasurer;
            constructor();
            private checkArgs();
            private suppressTooCloseVertex(family);
            private findSeeds();
            go(): Vertex[][];
        }
        class ProximityMeasurer {
            vertexToLinkLength: HashMap<Vertex, number>;
            meanLinksDist(vertex: Vertex): number;
            isCloseToMe(vertex: Vertex, family: Vertex[], coef: number): boolean;
            areClose(vertex0: Vertex, vertex1: any, coef: number): boolean;
            areFar(vertex0: Vertex, vertex1: any, coef: number): boolean;
        }
        class SubMameshExtractor {
            mamesh: Mamesh;
            verticesToKeep: Vertex[];
            verticesToKeepMustBeInMamesh: boolean;
            constructCutSegment: boolean;
            takeCareOfPolygons: boolean;
            addBorderPolygonInsteadOfSuppress: boolean;
            OUT_BorderPolygon: Vertex[][];
            OUT_BorderVerticesInside: Vertex[];
            OUTBorderVerticesOutside: Vertex[];
            constructor(mamesh: Mamesh, verticesToKeep: Vertex[]);
            go(): Mamesh;
        }
        class ExtractCentralPart {
            mamesh: Mamesh;
            nb: number;
            markBorder: boolean;
            suppressFromBorderVersusCorner: boolean;
            constructor(mamesh: Mamesh, nb: number);
            go(): Mamesh;
        }
        class FindSickingMapFromVertices {
            receiver: Vertex[];
            source: Vertex[];
            toleranceToBeOneOfTheClosest: number;
            proximityMeasurer: ProximityMeasurer;
            proximityCoef: number;
            acceptOnlyDisjointReceiverAndSource: boolean;
            constructor(receiver: Vertex[], source: Vertex[]);
            private checkArgs();
            go(): HashMap<Vertex, Vertex[]>;
        }
        class ConcurrentMameshesGraterAndSticker {
            IN_mameshes: Mamesh[];
            SUB_grater: GraphGrater;
            justGrateDoNotStick: boolean;
            proximityCoefToStick: number[];
            toleranceToBeOneOfTheClosest: number;
            OUTBorderVerticesToStick: Vertex[][];
            OUTGratedMameshes: Mamesh[];
            takeCareOfPolygons: boolean;
            suppressLinksAngularlyTooClose: boolean;
            SUB_linkCleanerByAngle: linkModule.LinksSorterAndCleanerByAngles;
            constructor();
            OUT_stickingMap: HashMap<Vertex, Vertex[]>;
            private checkArgs();
            goChanging(): Mamesh;
        }
        class FindCloseVerticesFast {
            nbDistinctPoint: number;
            maxDistToBeClose: number;
            throwExceptionIfReceiverHaveCloseVertices: boolean;
            receiverAndSourceMustBeDisjoint: boolean;
            private receivers;
            private sources;
            constructor(receivers: Vertex[], sources: Vertex[]);
            deformationFunction: (point: XYZ) => XYZ;
            go(): HashMap<Vertex, Vertex[]>;
            private mins;
            private maxs;
            private buildScaler();
        }
        class Merger {
            merginMap: HashMap<Vertex, Vertex>;
            private receiverMamesh;
            private sourceMamesh;
            private sourceEqualRecepter;
            cleanDoubleLinks: boolean;
            cleanDoubleSquareAndTriangles: boolean;
            cleanLinksCrossingSegmentMiddle: boolean;
            suppressSomeTriangleAndSquareSuperposition: boolean;
            mergeLink: boolean;
            mergeTrianglesAndSquares: boolean;
            mergeSegmentsMiddle: boolean;
            destroySource: boolean;
            private checkArgs();
            constructor(receiverMamesh: Mamesh, sourceMamesh: Mamesh, map: HashMap<Vertex, Vertex[]>);
            goChanging(): void;
            private mergeOnlyVertices();
            private mergeVerticesAndLinks();
            private mergeCutSegment();
            private letsMergeTrianglesAndSquares();
            private changeOneSquare(square);
        }
        class Sticker {
            createNewLinks: boolean;
            mamesh0: Mamesh;
            mamesh1: Mamesh;
            stickingMap: HashMap<Vertex, Vertex[]>;
            cleanOppositeLinksAtBegin: boolean;
            twoMameshes: boolean;
            zIndex1: number;
            constructor(mamesh0: Mamesh, mamesh1: Mamesh, stickingMap: HashMap<Vertex, Vertex[]>);
            private checkArgs();
            goChanging(): void;
        }
    }
}
declare module mathis {
    function nCanvasInOneLine(n: number, $containter: HTMLElement): HTMLElement[];
    function nDivInOneLine(n: number, $containter: HTMLElement, separatorCSS?: string): HTMLElement[];
    function nDivContainningCanvasInOneLine(n: number, $containter: HTMLElement, separatorCSS?: string): {
        divs: HTMLElement[];
        canvass: HTMLElement[];
    };
    function legend(heightCSS: string, $container: HTMLElement, bottom?: boolean, separatorCSS?: string): HTMLElement;
}
declare module mathis {
    function allIntegerValueOfEnume(MyEnum: any): number[];
    function allStringValueOfEnume(MyEnum: any): string[];
    class Logger {
        showTrace: boolean;
        private alreadyWroteWarning;
        c(message: string, maxTimesFired?: number): void;
    }
    function roundWithGivenPrecision(value: number, nbDecimal: number): number;
    function applyMixins(derivedCtor: any, baseCtors: any[]): void;
    function setCursorByID(id: any, cursorStyle: any): void;
    class Bilan {
        private millisDep;
        private millisDuration;
        private nbTested;
        private nbOK;
        constructor();
        private computeTime();
        add(bilan: Bilan): void;
        assertTrue(ok: boolean): void;
        toString(): string;
    }
    function modulo(i: number, n: number, centered?: boolean): number;
    function shuffle(array: any): any;
    interface HasHashString {
        hashString: string;
    }
    class Entry<K extends HasHashString, T> {
        key: K;
        value: T;
        constructor(key: K, value: T);
    }
    class HashMap<K extends HasHashString, T> {
        private values;
        private keys;
        memorizeKeys: boolean;
        constructor(memorizeKeys?: boolean);
        putValue(key: K, value: T, nullKeyForbidden?: boolean): void;
        removeKey(key: K): void;
        getValue(key: K, nullKeyForbidden?: boolean): T;
        allValues(): T[];
        allKeys(): K[];
        allEntries(): Entry<K, T>[];
        aRandomValue(): T;
        extend(otherHashMap: HashMap<K, T>): void;
        size(): number;
    }
    class StringMap<T> {
        private values;
        putValue(key: string, value: T, nullKeyForbidden?: boolean): void;
        removeKey(key: string): void;
        getValue(key: string, nullKeyForbidden?: boolean): T;
        allValues(): T[];
        allKeys(): string[];
        aRandomValue(): T;
        size(): number;
        __serialize(): {
            [key: string]: T;
        };
        __load(values: any): void;
    }
}
declare module mathis {
    module lineModule {
        class LineComputer {
            cannotOverwriteExistingLines: boolean;
            startingVertices: Vertex[];
            restrictLinesToTheseVertices: Vertex[];
            lookAtBifurcation: boolean;
            mamesh: Mamesh;
            constructor(mamesh: Mamesh);
            go(): Line[];
        }
        class LinesCuter {
            private lines;
            private allPresentVertices;
            private vertices;
            constructor(lines: Line[], vertices: Vertex[]);
            go(): Line[];
            protected cutOneLine(path: Vertex[]): Vertex[][];
        }
        function makeLineCatalogue2(graph: Vertex[], lookAtBifurcations: boolean): Line[];
        class CreateAColorIndexRespectingBifurcationsAndSymmetries {
            mamesh: Mamesh;
            packSymmetricLines: boolean;
            forSymmetriesUsePositionVersusParam: boolean;
            useConsecutiveIntegerForPackNumber: boolean;
            constructor(mamesh: Mamesh);
            symmetries: ((a: XYZ) => XYZ)[];
            OUT_nbFoundSymmetricLines: number;
            go(): HashMap<Line, number>;
            private segmentAndHisPackJoinNewPack(segment, pack, segmentToPack);
        }
    }
}
declare module mathis {
    module linkModule {
        class SimpleLinkFromPolygonCreator {
            mamesh: Mamesh;
            constructor(mamesh: Mamesh);
            goChanging(): void;
        }
        class LinksSorterAndCleanerByAngles {
            private normals;
            suppressLinksAngularlyTooCloseVersusNot: boolean;
            suppressLinksAngularParam: number;
            keepShorterLinksVersusGiveSomePriorityToLinksWithOpposite: boolean;
            mamesh: Mamesh;
            vertexToPositioning: HashMap<Vertex, Positioning>;
            constructor(mamesh: Mamesh, normals?: XYZ | HashMap<Vertex, Positioning>);
            goChanging(): void;
            private letsSuppressLinks();
        }
        class OppositeLinkAssocierByAngles {
            vertices: Vertex[];
            maxAngleToAssociateLinks: number;
            clearAllExistingOppositeBefore: boolean;
            canCreateBifurcations: boolean;
            doNotBranchOnBorder: boolean;
            OUT_nbBranching: number;
            constructor(vertices: Vertex[]);
            private associateOppositeLinks();
            goChanging(): void;
        }
        class LinkCreaterSorterAndBorderDetecterByPolygons {
            mamesh: Mamesh;
            interiorTJonction: HashMap<Vertex, boolean>;
            borderTJonction: HashMap<Vertex, Vertex[]>;
            forcedOpposite: HashMap<Vertex, Vertex[]>;
            private polygonesAroundEachVertex;
            private polygones;
            markIsolateVertexAsCorner: boolean;
            markBorder: boolean;
            forceOppositeLinksAtCorners: boolean;
            constructor(mamesh: Mamesh);
            goChanging(): void;
            private checkArgs();
            private createPolygonesFromSmallestTrianglesAnSquares();
            private detectBorder();
            private createLinksTurningAround();
            private makeLinksFinaly();
            private findAPolygoneWithOrientedEdge(vertDeb, vertFin, aList);
            private findAPolygoneWithThisEdge(vert1, vert2, aList);
            private createLinksTurningFromOnePolygone(central, poly0, polygonesAround, isBorder);
            private subdivideSegment(polygone, vertex1, vertex2, cutSegmentDico);
        }
        class Polygone {
            points: Vertex[];
            constructor(points: Vertex[]);
            hasAngle(point: Vertex): boolean;
            theOutgoingAnglesAdjacentFrom(point: Vertex): Vertex;
            theIngoingAnglesAdjacentFrom(point: Vertex): Vertex;
            theTwoAnglesAdjacentFrom(point: Vertex): Array<Vertex>;
            toString(): string;
        }
    }
}
declare module mathis {
    module macamera {
        import Scene = BABYLON.Scene;
        class GrabberCamera extends BABYLON.Camera {
            translationSpeed: number;
            checkCollisions: boolean;
            showPredefinedConsoleLog: boolean;
            currentGrabber: Grabber;
            grabbers: Grabber[];
            useOnlyFreeMode: boolean;
            useFreeModeWhenCursorOutOfGrabber: boolean;
            onGrabberChange: (oldGrabber: Grabber, newGrabber: Grabber) => void;
            onTranslate: () => void;
            onPositioningChange: (positioning: Positioning) => void;
            positionChangesBiaiser: (oldPosition: XYZ, newPosition: XYZ, currentGrabber: Grabber) => XYZ;
            private tooSmallAngle;
            private tooBigAngle;
            private cumulatedAngle;
            private relativeCursorPositionOnGrabber;
            private cursorPositionOnGrabberOld;
            private angleOfRotationAroundGrabber;
            private axeOfRotationAroundGrabber;
            private camDir;
            private oldCamDir;
            private angleForCamRot;
            private axisForCamRot;
            private myNullVector;
            private frozonProjectionMatrix;
            private frozonViewMatrix;
            private pickingRay;
            private aPartOfTheFrontDir;
            whishedCamPos: WishedPositioning;
            trueCamPos: CamPositioning;
            scene: Scene;
            private $canvasElement;
            changePosition(position: XYZ, smoothMovement?: boolean): void;
            changeFrontDir(position: XYZ, smoothMovement?: boolean): void;
            changeUpVector(position: XYZ, smoothMovement?: boolean): void;
            constructor(mathisFrame: MathisFrame, grabber: Grabber);
            addGrabber(grabber: Grabber): void;
            replaceTheFirstGrabber(grabber: Grabber): void;
            private freeRotation();
            private _paralDisplacement;
            private grabberMovement();
            private mixedRotation(alpha);
            private _matrixRotationAroundCam;
            private rotate(axis, angle);
            private _matrixRotationAroundZero;
            private camRelativePos;
            private rotateAroundCenter(axis, angle, center);
            private twoRotations(axeOfRotationAroundCam, angleBetweenRays, axeOfRotationAroundZero, angleOfRotationAroundZero, alpha);
            private _collider;
            private correctionToRecenter;
            private _deltaPosition;
            private _popo;
            translateCam(delta: number): void;
            private _babylonRay;
            private pointerIsOnCurrentGrabber;
            onPointerMove(actualPointerX: number, actualPointerY: number): void;
            private createPickingRayWithFrozenCamera(x, y, world, frozenViewMatrix, frozonProjectionMatrix, result);
            private _tempCN;
            private _end;
            private createNewRay(x, y, viewportWidth, viewportHeight, world, view, projection, result);
            private pointerIsDown;
            onPointerDown(actualPointerX: any, actualPointerY: any): void;
            private _lookForTheBestGrabber;
            private lookForTheBestGrabber(actualPointerX, actualPointerY);
            onPointerUp(): void;
            reset(): void;
            private cursorActualStyle;
            private toogleIconCursor(style);
            _isSynchronizedViewMatrix(): boolean;
            private _target;
            private viewMM;
            _getViewMatrix(): MM;
            update(): void;
            _keys: any[];
            keysUp: number[];
            keysDown: number[];
            keysLeft: number[];
            keysRight: number[];
            keysFrontward: any[];
            keysBackward: any[];
            onKeyDown(evt: any): void;
            onKeyUp(evt: any): void;
            private _axeForKeyRotation;
            private _additionnalVec;
            private checkForKeyPushed();
            wheelPrecision: number;
            private _attachedElement;
            private _onPointerDown;
            private _onPointerUp;
            private _onPointerMove;
            private _wheel;
            private _onMouseMove;
            private _onKeyDown;
            private _onKeyUp;
            private _onLostFocus;
            private _reset;
            private _onGestureStart;
            private _onGesture;
            private _MSGestureHandler;
            private eventPrefix;
            private deltaNotToBigFunction(delta);
            attachControl(element: HTMLElement, noPreventDefault?: boolean): void;
            detachControl(element: HTMLElement): void;
        }
        class CamPositioning extends Positioning {
            private grabberPilot;
            position: XYZ;
            upVector: XYZ;
            frontDir: XYZ;
            sizes: XYZ;
            smoothParam: number;
            constructor(grabberPilot: GrabberCamera);
            almostEqual(camCarac: WishedPositioning): boolean;
            goCloser(positioning: WishedPositioning): void;
            private positioningCopy;
            copyFrom(positioning: Positioning): void;
            changeFrontDir(vector: XYZ): void;
            changeUpVector(vector: XYZ): void;
        }
        class WishedPositioning extends Positioning {
            private camera;
            constructor(camera: GrabberCamera);
            upVector: XYZ;
            frontDir: XYZ;
            position: XYZ;
            getPosition(): XYZ;
            private _newPositionBeforCollision;
            private _velocity;
            changePosition(newPosition: XYZ): void;
            private _collider;
            ellipsoid: XYZ;
            private _oldPosition;
            private _collideWithWorld(velocity, candidatePos);
            private _diffPosition;
            private _newPosition;
            private _inter;
            private _upPerturbation;
            private _onCollisionPositionChange;
        }
        class Grabber {
            grabberCamera: GrabberCamera;
            parallelDisplacementInsteadOfRotation: boolean;
            showGrabberOnlyWhenGrabbing: boolean;
            mesh: BABYLON.Mesh;
            name: string;
            referenceCenter: XYZ;
            onGrabbingActions: StringMap<(alpha: number) => void>;
            endOfZone1: number;
            endOfZone2: number;
            endOfZone3: number;
            zoneAreDefinedFromCenterRatherFromSurface: boolean;
            focusOnMyCenterWhenCameraGoDownWard: boolean;
            material: BABYLON.StandardMaterial;
            scene: BABYLON.Scene;
            dispose(): void;
            interpolationCoefAccordingToCamPosition(camPosition: XYZ, distCamToGrabber: number): number;
            checkArgs(): void;
            constructor(scene: BABYLON.Scene);
        }
        class SphericalGrabber extends Grabber {
            radius: number;
            constructor(scene: BABYLON.Scene, sizes?: XYZ, positionAndReferenceCenter?: XYZ, isPickable?: boolean);
        }
        class PlanarGrabber extends Grabber {
            constructor(scene: BABYLON.Scene, scaling?: XYZ, position?: XYZ, quaternion?: XYZW, isPickable?: boolean);
        }
    }
}
declare module mathis {
    module mameshAroundComputations {
        class PositioningComputerForMameshVertices {
            mamesh: Mamesh;
            attractionOfTangent: XYZ;
            computeTangent: boolean;
            computeNormal: boolean;
            computeSizes: boolean;
            sizesProp: XYZ;
            allVerticesHaveSameSizes: boolean;
            constructor(mamesh: Mamesh);
            checkArgs(): void;
            private temp;
            private _side1;
            private _side2;
            go(): HashMap<Vertex, Positioning>;
        }
    }
}
declare module mathis {
    module mameshModification {
        class TriangleDichotomer {
            mamesh: Mamesh;
            makeLinks: boolean;
            trianglesToCut: Vertex[];
            nbDicho: number;
            newParamForMiddle: (p1: XYZ, p2: XYZ) => XYZ;
            constructor(mamesh: Mamesh);
            checkArgs(): void;
            go(): void;
            private createAndAddSegmentsFromTriangles(triangles);
        }
        class SquareDichotomer {
            mamesh: Mamesh;
            makeLinks: boolean;
            constructor(mamesh: Mamesh);
            squareToCut: Vertex[];
            dichoStyle: SquareDichotomer.DichoStyle;
            newParamForMiddle: (p1: XYZ, p2: XYZ) => XYZ;
            newParamForCenter: (p1: XYZ, p2: XYZ, p3: XYZ, p4: XYZ) => XYZ;
            checkArgs(): void;
            go(): void;
            private createAndAddSegmentsFromSquare(squares);
        }
        class SimplestSquareDichotomer {
            mamesh: Mamesh;
            makeLinks: boolean;
            constructor(mamesh: Mamesh);
            squareToCut: Vertex[];
            dichoStyle: SquareDichotomer.DichoStyle;
            newParamForMiddle: (p1: XYZ, p2: XYZ) => XYZ;
            newParamForCenter: (p1: XYZ, p2: XYZ, p3: XYZ, p4: XYZ) => XYZ;
            checkArgs(): void;
            go(): void;
            private createAndAddSegmentsFromSquare(squares);
        }
        module SquareDichotomer {
            enum DichoStyle {
                fourSquares = 0,
                fourTriangles = 1,
            }
        }
        class HexahedronSubdivider {
            mamesh: Mamesh;
            subdivider: number;
            hexahedronsToCut?: Vertex[];
            suppressVolumes?: [number, number, number][];
            private createdPointsPerSegment;
            private createdPointsPerSurface;
            newHexahedrons: Vertex[];
            private points;
            constructor(mamesh: Mamesh);
            checkArgs(): void;
            go(): void;
            private subdivideHexahedronInVertices(h);
            private makeNewHexahedronsFromPoints();
            private makeSurfacesVertices();
            private makeSegmentsVertices();
            private subdivideSegment(a, b);
            private subdivideSurface(a, b, c, d);
            private subdivideHexahedrons();
        }
        class SurfacesFromHexahedrons {
            mamesh: Mamesh;
            hexahedronsToDraw?: Vertex[];
            private newSurfaces;
            private surfacesSet;
            constructor(mamesh: Mamesh);
            checkArgs(): void;
            go(): void;
        }
        class MameshDeepCopier {
            oldMamesh: Mamesh;
            copyCutSegmentsDico: boolean;
            copyLines: boolean;
            constructor(oldMamesh: Mamesh);
            go(): Mamesh;
        }
        class PercolationOnLinks {
            IN_vertices: Vertex[];
            percolationProba: number;
            probaToPercolateFunction: (vertex: Vertex) => number;
            SUB_random: proba.Random;
            doNotPercolateOnBorder: boolean;
            maxPercolationForAVertexAlreadyPercolate: number;
            constructor(mameshOrVertices: Mamesh | Vertex[]);
            goChanging(): void;
        }
        class MameshCleaner {
            OUT_nbLinkSuppressed: number;
            OUT_nbVerticesSuppressed: number;
            suppressCellWithNoVoisin: boolean;
            suppressLinkWithoutOppositeFunction: (v: Vertex) => boolean;
            IN_mamesh: Mamesh;
            constructor(mamesh: Mamesh);
            goChanging(): void;
            private suppressLinkWithoutOpposite();
        }
    }
}
declare module mathis {
    function jQueryOK(ifNotThrowException?: boolean): boolean;
    class PeriodicAction {
        nbTimesThisActionMustBeFired: number;
        isPaused: boolean;
        firedCount: number;
        id: string;
        action: () => void;
        frameInterval: number;
        timeIntervalMilli: number;
        constructor(action: () => void);
        lastTimeFired: number;
        passageOrderIndex: number;
    }
    class MathisFrame {
        canvas: HTMLElement;
        canvasParent: HTMLElement;
        scene: BABYLON.Scene;
        engine: BABYLON.Engine;
        callbackIfWebglNotHere: () => void;
        messageDiv: MessageDiv;
        subWindow_NE: SubWindow;
        subWindow_NW: SubWindow;
        subWindow_N: SubWindow;
        subWindow_SE: SubWindow;
        subWindow_SW: SubWindow;
        subWindow_S: SubWindow;
        subWindow_W: SubWindow;
        subWindow_E: SubWindow;
        showFPSinCorner(): void;
        constructor(htmlElementOrId?: string | HTMLElement, addDefaultCameraAndLight?: boolean, emptyForTest?: boolean);
        dispose(): void;
        resetScene(): void;
        skybox: BABYLON.Mesh;
        clearScene(clearCamera?: boolean, clearLights?: boolean, clearSkybox?: boolean): void;
        emptyAllCorner(): void;
        addDefaultLight(): void;
        getGrabberCamera(): any;
        addDefaultCamera(): void;
        periodicActions: PeriodicAction[];
        private sortAction;
        pushPeriodicAction(action: PeriodicAction): void;
        private suppressPeriodicAction(action);
        cleanAllPeriodicActions(): void;
        pauseAllPeriodicActions(): void;
        unpauseAllPeriodicActions(): void;
        backgroundColor: Color;
        $info: HTMLElement;
        private fireAction(ac);
        set100(element: HTMLElement): void;
        private parentWidth;
        private onParentDimChange();
        private domEventsHandler();
    }
    class SubWindow {
        private mathisFrame;
        $visual: any;
        constructor(mathisFrame: MathisFrame, className: string);
        appendAndGoToLine($obj: any): void;
        append($obj: any): void;
        empty(): void;
    }
    class MessageDiv {
        private mathisFrame;
        private $logDiv;
        constructor(mathisFrame: MathisFrame);
        addInMathisFrame(): void;
        append(message: string): void;
        empty(): void;
    }
    class EmptyMessageDivForTest extends MessageDiv {
        addInMathisFrame(): void;
        append(message: string): void;
        empty(): void;
    }
    class EmptyMathisFrameForFastTest extends MathisFrame {
        constructor();
        dispose(): void;
        resetScene(): void;
        clearScene(clearCamera?: boolean, clearLights?: boolean, clearSkybox?: boolean): void;
        addDefaultLight(): void;
        getGrabberCamera(): EmptyGrabberCameraForTest;
        addDefaultCamera(): void;
        pushPeriodicAction(action: PeriodicAction): void;
        set100(element: HTMLElement): void;
    }
    class EmptyGrabberCameraForTest {
        changePosition(position: XYZ, smoothMovement?: boolean): void;
        changeFrontDir(position: XYZ, smoothMovement?: boolean): void;
        changeUpVector(position: XYZ, smoothMovement?: boolean): void;
    }
}
declare module mathis {
    module periodicWorld {
        class FundamentalDomain {
            vecA: XYZ;
            vecB: XYZ;
            vecC: XYZ;
            constructor(vecA: XYZ, vecB: XYZ, vecC: XYZ);
            private matWebCoordinateToPoint;
            private matPointToWebCoordinate;
            isCartesian: boolean;
            contains(point: XYZ): boolean;
            webCoordinateToPoint(webCoordinate: WebCoordinate, result: XYZ): void;
            pointToWebCoordinate(point: XYZ, result: WebCoordinate): void;
            private pointWC;
            getDomainContaining(point: XYZ): Domain;
            private domainCenter;
            private domainAroundCenter;
            getDomainsAround(nbRepetitions: number, distMax: number, exludeCentralDomain?: boolean): Domain[];
            private _positionWC;
            private _domainPosition;
            private _domainPositioncenter;
            private _zero;
            modulo(position: XYZ, positionInsideFD: XYZ): void;
        }
        class CartesianFundamentalDomain extends FundamentalDomain {
            constructor(vecA: XYZ, vecB: XYZ, vecC: XYZ);
            private pointWC2;
            contains(point: XYZ): boolean;
            drawMe(scene: any): void;
            getCorner(): XYZ;
            getArretes(scene: any): Array<BABYLON.AbstractMesh>;
        }
        class WebCoordinate extends XYZ {
        }
        class Domain extends WebCoordinate {
            constructor(i: number, j: number, k: number);
            whichContains(webCo: WebCoordinate): Domain;
            equals(otherDomain: Domain): boolean;
            getCenter(fundamentalDomain: FundamentalDomain, result: XYZ): void;
            private _point;
            private _domainCenter;
            contains(point: XYZ, fundamentalDomain: FundamentalDomain): boolean;
        }
        class Multiply {
            fd: FundamentalDomain;
            maxDistance: number;
            nbRepetitions: number;
            constructor(fd: FundamentalDomain, maxDistance: number, nbRepetitions: any);
            addMesh(mesh: BABYLON.Mesh): void;
            addInstancedMesh(mesh: BABYLON.InstancedMesh): void;
            addAbstractMesh(abMesh: BABYLON.AbstractMesh): void;
        }
    }
}
declare module mathis {
    module polyhedron {
        const platonic: string[];
        const archimedean: string[];
        const antiprisms: string[];
        const johnson: string[];
        const prisms: string[];
        class Polyhedron {
            type: string;
            makeLinks: boolean;
            constructor(type: string);
            static dataToMamesh(data: {
                vertices: number[][];
                faces: number[][];
            }): Mamesh;
            go(): Mamesh;
        }
        function getPolyhedronAsync(type: string, callback: (polyhedron: Mamesh) => void): void;
    }
}
declare module mathis {
    module reseau {
        enum Maille {
            square = 0,
            triangle = 1,
            diamond = 2,
            hexagonal = 3,
            slash = 4,
            croisillon = 5,
        }
        class SingleTriangle {
            makeLinks: boolean;
            markCorners: boolean;
            addALoopLineAround: boolean;
            mamesh: Mamesh;
            constructor(mamesh: Mamesh);
            go(): void;
        }
        class TriangulatedTriangle {
            private mamesh;
            markCorner: boolean;
            markBorder: boolean;
            origin: XYZ;
            end: XYZ;
            nbSubdivisionInSide: number;
            setAllDichoLevelTo0: boolean;
            constructor();
            go(): Mamesh;
        }
        class TriangulatedPolygone {
            private nbSides;
            private mamesh;
            markCorner: boolean;
            markBorder: boolean;
            origin: XYZ;
            end: XYZ;
            nbSubdivisionInARadius: number;
            setAllDichoLevelTo0: boolean;
            constructor(nbSides: number);
            go(): Mamesh;
        }
        class BasisForRegularReseau {
            nbI: number;
            set_nbJ_toHaveRegularReseau: boolean;
            nbJ: number;
            origin: XYZ;
            end: XYZ;
            kComponentTranslation: number;
            nbVerticalDecays: number;
            nbHorizontalDecays: number;
            squareMailleInsteadOfTriangle: boolean;
            go(): {
                Vi: XYZ;
                Vj: XYZ;
                nbI: number;
                nbJ: number;
            };
            private checkArgs();
            private computeDecayVector(a, A, b, B, dV, dH);
        }
        class Regular {
            nbI: number;
            nbJ: number;
            fixedK: number;
            Vi: XYZ;
            Vj: XYZ;
            Vk: XYZ;
            origine: XYZ;
            private mamesh;
            makeLinks: boolean;
            makeTriangleOrSquare: boolean;
            squareVersusTriangleMaille: boolean;
            oneMoreVertexForOddLine: boolean;
            holeParameters: HashMap<XYZ, boolean>;
            markCorner: boolean;
            markBorder: boolean;
            markCenter: boolean;
            putAVertexOnlyAtXYZCheckingThisCondition: (xyz: XYZ) => boolean;
            constructor(generator?: BasisForRegularReseau);
            private checkArgs();
            private _xyz;
            private getVertex(i, j);
            private _iDirection;
            private _jDirection;
            private _kDirection;
            paramToVertex: HashMap<XYZ, Vertex>;
            go(): Mamesh;
            private linksCreationForSquare();
            private squareCreation();
            private linksCreationForTriangle();
            private triangleCreation();
        }
        class Regular1D {
            size: number;
            origin: XYZ;
            end: XYZ;
            constructor(size?: number);
            go(): Mamesh;
            private iToXYX(i);
        }
        class Regular3D {
            nbI: number;
            nbJ: number;
            nbK: number;
            Vi: XYZ;
            Vj: XYZ;
            Vk: XYZ;
            origine: XYZ;
            decayOddStrates: boolean;
            makeLinks: boolean;
            makeTriangleOrSquare: boolean;
            strateHaveSquareMailleVersusTriangleMaille: boolean;
            oneMoreVertexForOddLine: boolean;
            interStrateMailleAreSquareVersusTriangle: boolean;
            createJKSquares: boolean;
            createIKSquaresOrTriangles: boolean;
            putAVertexOnlyAtXYZCheckingThisCondition: (xyz: XYZ) => boolean;
            paramToVertex: HashMap<XYZ, Vertex>;
            mamesh: Mamesh;
            constructor();
            go(): Mamesh;
            private linksCreationForSquareMaille();
            private linksCreationForTriangleMaille();
            private getVertex(i, j, givenK);
            private triangleCreation();
        }
    }
}
declare module mathis {
    module spacialTransformations {
        class RoundSomeStrates {
            private mamesh;
            propBeginToRound: number;
            propEndToRound: number;
            integerBeginToRound: number;
            integerEndToRound: number;
            exponentOfRoundingFunction: number;
            referenceRadiusIsMinVersusMaxVersusMean: number;
            preventStratesCrossings: boolean;
            constructor(mamesh: Mamesh);
            goChanging(): void;
        }
        class Similitude {
            axisForRotation: XYZ;
            centerForSimilitude: XYZ;
            private vertices;
            private angle;
            private vectorForTranslation;
            private sizesForResize;
            constructor(vertices: Vertex[], angle: number, vectorForTranslation?: XYZ, sizesForResize?: XYZ);
            goChanging(): void;
        }
        function adjustInASquare(mamesh: Mamesh, origine: XYZ, end: XYZ): void;
    }
}
declare module mathis {
    module fractal {
        class StableRandomFractal {
            mamesh: Mamesh;
            referenceDistanceBetweenVertexWithZeroDichoLevel: number;
            deformationFromCenterVersusFromDirection: boolean;
            center: XYZ;
            direction: XYZ;
            private simuStable;
            alpha: number;
            beta: number;
            seed: number;
            constructor(mamesh: Mamesh);
            go(): void;
        }
    }
}
declare module mathis {
    module metropolis {
        class IsingModel {
            pi: (graph: Vertex[]) => number;
            graph: Vertex[];
            nbActionsPerIteration: number;
            private possibleValues;
            q: number;
            beta: number;
            constructor(graph: Vertex[]);
            checkArgs(): void;
            go(): void;
            iterateAndGetChangedVertices(): HashMap<Vertex, number>;
            private newValue();
            private energyRatio(ver, possibleNewValue);
            private initialisation();
        }
    }
}
declare module mathis {
    module proba {
        class Random {
            seed: number;
            constructor(seed?: number);
            pseudoRand(): number;
            pseudoRandInt(size: number): number;
        }
        class Gaussian {
            mean: number;
            stdev: number;
            knuthVersusBowMuller: boolean;
            private use_last;
            private y2;
            go(): number;
            private bowMuller();
            private knuth();
        }
        function gaussian(mean: any, stdev: any): () => any;
        class StableLaw {
            nbSimu: number;
            alpha: number;
            beta: number;
            sigma: number;
            mu: number;
            basicGenerator: () => number;
            checkArgs(): void;
            go(): number[];
        }
    }
}
declare module mathis {
    module usualFunction {
        let sinh: (x: any) => number;
        let tanh: (x: any) => number;
        let sech: (x: any) => number;
        let sechP: (x: any) => number;
        let sechPP: (x: any) => number;
        let tanhP: (x: any) => number;
        let tanhPP: (x: any) => number;
        let tractrice: (x: any) => XYZ;
        let tractriceP: (x: any) => XYZ;
        let tractricePP: (x: any) => XYZ;
        let rotationYAxis: (theta: any) => MM;
        let rotationYAxisP: (theta: any) => MM;
        let rotationYAxisPP: (theta: any) => MM;
    }
    module riemann {
        class Carte {
            name: string;
            X: (u: number, v: number) => XYZ;
            Xu: (u: number, v: number) => XYZ;
            Xv: (u: number, v: number) => XYZ;
            Xuu: (u: number, v: number) => XYZ;
            Xuv: (u: number, v: number) => XYZ;
            Xvv: (u: number, v: number) => XYZ;
            orientationCoef: number;
            unit: number;
            maillage: Mamesh;
            arrivalOpenMesh: Mamesh;
            private point;
            private _meanLinkLengthAtArrival;
            xyzToUV(xyz: XYZ, recomputeStandartDevialtion?: boolean): {
                uv: UV;
                distToBorder: number;
                distToNearestArrivalMesh: number;
            };
            private e(u, v);
            private f(u, v);
            private g(u, v);
            private E(u, v);
            private F(u, v);
            private G(u, v);
            createArrivalMeshFromMaillage(): void;
            dNinTangentBasis(u: number, v: number): M22;
            dNaction(u: number, v: number, vect: XYZ): XYZ;
            private canonicalToTangentBasis(u, v, vect);
            private tagentToCanonicalBasis(u, v, vect);
            newN(u: number, v: number): XYZ;
            meanLinkLengthAtArrival(): number;
        }
        class Surface {
            cartes: Carte[];
            wholeSurfaceMesh: Mamesh;
            drawTheWholeSurface(scene: BABYLON.Scene): void;
            drawOneCarte(carteIndex: number, scene: BABYLON.Scene): void;
            drawOneMesh(mesh: Mamesh, scene: BABYLON.Scene): void;
            findBestCarte(xyz: XYZ): {
                uv: UV;
                carte: Carte;
            };
        }
        enum SurfaceName {
            selle = 0,
            cylinder = 1,
            torus = 2,
            pseudoSphere = 3,
        }
        class SurfaceMaker {
            private surface;
            private surfaceName;
            private vertexToCarte;
            carteIndexToMinimalArrivalMesh: Mamesh[];
            constructor(surfaceName: SurfaceName);
            go(): Surface;
            makeMinimalMeshesForEachCarte(): void;
        }
        class RotationCarteMaker {
            translation: XYZ;
            scaling: XYZ;
            private curve;
            curveP: (x: number) => XYZ;
            curvePP: (x: number) => XYZ;
            constructor(curve: (x: number) => XYZ);
            go(): Carte;
        }
    }
}
declare module mathis {
    module symmetries {
        var squareMainSymmetries: ((a: XYZ) => XYZ)[];
        module keyWords {
            var verticalAxis: string;
            var horizontalAxis: string;
            var slashAxis: string;
            var rotation: string;
        }
        function cartesian(nbI: number, nbJ: number, oneMoreVertexForOddLine?: boolean): StringMap<(param: XYZ) => XYZ>;
        function cartesianAsArray(nbI: number, nbJ: number, oneMoreVertexForOddLine?: boolean): ((param: XYZ) => XYZ)[];
        function polygonRotations(nbSides: number): StringMap<(param: XYZ) => XYZ>;
        function getAllPolygonalRotations(nbSides: number): ((param: XYZ) => XYZ)[];
    }
}
declare module mathis {
    module tab {
        function maxIndex(list: string[] | number[]): number;
        function maxValue(list: number[]): number;
        function maxValueString(list: string[]): string;
        function minIndex(list: string[] | number[]): number;
        function minValue(list: number[]): number;
        function minValueString(list: string[]): string;
        function minIndexOb<T>(list: T[], comparisonFunction: (a: T, b: T) => number): number;
        function minValueOb<T>(list: T[], comparisonFunction: (a: T, b: T) => number): T;
        function clearArray(array: Array<any>): void;
        function removeFromArray<T>(array: Array<T>, object: T): void;
        function arrayMinusElements<T>(array: T[], criteriumToSuppress: (elem: T) => boolean): T[];
        function arrayKeepingSomeIndices<T>(array: T[], indicesToKeep: number[]): T[];
        function arrayMinusSomeIndices<T>(array: T[], indicesSuppress: number[]): T[];
        function arrayMinusBlocksIndices<T>(list: T[], indicesOfBlocksToRemove: number[], blockSize: number): T[];
        function minIndexOfNumericList(list: number[]): number;
        function maxIndexOfNumericList(list: number[]): number;
        function minIndexOfStringList(list: string[]): number;
        function indicesUpPermutationToString(indices: number[]): string;
        class ArrayMinusBlocksElements<T extends HasHashString> {
            private dicoOfExistingBlocks;
            removeAlsoCircularPermutation: boolean;
            longList: T[];
            blockSize: number;
            listToRemove: T[];
            private removeOnlyDoublon;
            constructor(longList: T[], blockSize: number, listToRemove?: T[]);
            go(): T[];
            private key(list);
        }
    }
}
declare module mathis {
    module visu3d {
        import Mesh = BABYLON.Mesh;
        class VerticesViewer {
            scene: BABYLON.Scene;
            vertices: Vertex[];
            nbSegments: number;
            meshModel: BABYLON.Mesh;
            meshModels: BABYLON.Mesh[];
            useCloneInsteadOfInstances: boolean;
            positionings: HashMap<Vertex, Positioning>;
            parentNode: BABYLON.Node;
            checkCollision: boolean;
            color: Color;
            constantRadius: any;
            radiusProp: number;
            constructor(mameshOrVertices: Mamesh | Vertex[], scene: BABYLON.Scene, positionings?: HashMap<Vertex, Positioning>);
            checkArgs(): void;
            go(): void;
            vertexToCopiedMeshes: HashMap<Vertex, BABYLON.AbstractMesh[]>;
            clear(): void;
            buildVertexVisu(verticesToUpdate?: Vertex[], verticesToClear?: Vertex[]): void;
            updatePositionings(vertice?: Vertex[]): void;
            private updatePositioning(vertex);
        }
        class SurfaceViewer {
            parentNode: BABYLON.Node;
            mamesh: Mamesh;
            sideOrientation: number;
            normalDuplication: NormalDuplication;
            maxAngleBetweenNormals: number;
            scene: BABYLON.Scene;
            material: any;
            color: Color;
            alpha: number;
            backFaceCulling: boolean;
            constructor(mamesh: Mamesh, scene: BABYLON.Scene);
            checkArgs(): void;
            go(): Mesh;
            private _ComputeSides(sideOrientation, positions, indices, normals, uvs);
            private computeOneNormalPerTriangle(positions, indices);
            private computeVertexNormalFromTrianglesNormal(positions, indices, triangleNormals);
        }
        enum NormalDuplication {
            none = 0,
            duplicateOnlyWhenNormalsAreTooFarr = 1,
            duplicateVertex = 2,
        }
        class LinksViewer {
            private mamesh;
            private scene;
            parentNode: BABYLON.Node;
            lateralScalingConstant: any;
            lateralScalingProp: number;
            tesselation: number;
            material: any;
            color: Color;
            res: BABYLON.AbstractMesh[];
            meshModel: BABYLON.Mesh;
            pairVertexToLateralDirection: (beginVertex: Vertex, endVertex: Vertex) => XYZ;
            segmentOrientationFunction: (begin: Vertex, end: Vertex) => number;
            clonesInsteadOfInstances: boolean;
            checkCollision: boolean;
            constructor(mamesh: Mamesh, scene: BABYLON.Scene);
            private checkArgs();
            go(): BABYLON.AbstractMesh[];
            private barycenter;
            private middle;
            private drawOneLink(beginVertex, endVertex);
        }
        class LinesViewer {
            lines: Line[];
            vertices: Vertex[];
            private scene;
            parentNode: BABYLON.Node;
            doNotDrawLinesContainingOnlyInvisibleVertices: boolean;
            color: Color;
            lineToColor: HashMap<Line, Color>;
            lineToLevel: HashMap<Line, number>;
            levelPropToColorFunc: (prop: number) => Color;
            cap: number;
            tesselation: number;
            interpolationOption: geometry.InterpolationOption;
            isThin: boolean;
            constantRadius: any;
            radiusProp: number;
            radiusFunction: (index: number, alphaRatio: number) => number;
            private res;
            constructor(mameshOrLines: Mamesh | Line[], scene: BABYLON.Scene);
            go(): BABYLON.Mesh[];
            clear(): void;
            private buildLineToColor();
            private drawOneLine(line);
            private drawOnePath(line, path);
        }
        class ElongateAMeshFromBeginToEnd {
            private begin;
            private end;
            private modelMesh;
            lateralScaling: number;
            lateralDirection: XYZ;
            constructor(begin: XYZ, end: XYZ, originalMesh: BABYLON.AbstractMesh);
            private yAxis;
            private zAxis;
            private direction;
            private nothing;
            goChanging(): BABYLON.AbstractMesh;
        }
    }
}
declare var $: any;
declare var cc: any;
declare let showDevMessages: boolean;
declare module mathis {
    var geo: Geo;
    var logger: Logger;
    var deconnectViewerForTest: boolean;
}
