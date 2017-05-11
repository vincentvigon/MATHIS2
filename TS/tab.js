/**
 * Created by vigon on 17/08/2016.
 */
var mathis;
(function (mathis) {
    /**helper for array manipulations*/
    var tab;
    (function (tab) {
        function maxIndex(list) {
            if (list == null || list.length == 0)
                throw 'empty list';
            var maxValue = list[0];
            var maxIndex = 0;
            for (var i = 1; i < list.length; i++) {
                if (list[i] > maxValue) {
                    maxValue = list[i];
                    maxIndex = i;
                }
            }
            return maxIndex;
        }
        tab.maxIndex = maxIndex;
        function maxValue(list) {
            return list[maxIndex(list)];
        }
        tab.maxValue = maxValue;
        function maxValueString(list) {
            return list[maxIndex(list)];
        }
        tab.maxValueString = maxValueString;
        function minIndex(list) {
            if (list == null || list.length == 0)
                throw 'empty list';
            var maxValue = list[0];
            var maxIndex = 0;
            for (var i = 1; i < list.length; i++) {
                if (list[i] < maxValue) {
                    maxValue = list[i];
                    maxIndex = i;
                }
            }
            return maxIndex;
        }
        tab.minIndex = minIndex;
        function minValue(list) {
            return list[minIndex(list)];
        }
        tab.minValue = minValue;
        function minValueString(list) {
            return list[minIndex(list)];
        }
        tab.minValueString = minValueString;
        function minIndexOb(list, comparisonFunction) {
            if (list == null || list.length == 0)
                throw 'empty list';
            var minValue = list[0];
            var minIndex = 0;
            for (var i = 1; i < list.length; i++) {
                if (comparisonFunction(list[i], minValue) < 0) {
                    minValue = list[i];
                    minIndex = i;
                }
            }
            return minIndex;
        }
        tab.minIndexOb = minIndexOb;
        function minValueOb(list, comparisonFunction) {
            return list[minIndexOb(list, comparisonFunction)];
        }
        tab.minValueOb = minValueOb;
        function clearArray(array) {
            while (array.length > 0)
                array.pop();
        }
        tab.clearArray = clearArray;
        function removeFromArray(array, object) {
            var index = array.indexOf(object);
            if (index != -1)
                array.splice(index, 1);
            else {
                cc("l'objet n'est pas dans le tableau", object);
                throw "l'objet précédent n'est pas dans le tableau:";
            }
        }
        tab.removeFromArray = removeFromArray;
        function arrayMinusElements(array, criteriumToSuppress) {
            var res = [];
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var elem = array_1[_i];
                if (!criteriumToSuppress(elem))
                    res.push(elem);
            }
            return res;
        }
        tab.arrayMinusElements = arrayMinusElements;
        function arrayKeepingSomeIndices(array, indicesToKeep) {
            var res = [];
            for (var i = 0; i < array.length; i++) {
                if (indicesToKeep.indexOf(i) != -1)
                    res.push(array[i]);
            }
            return res;
        }
        tab.arrayKeepingSomeIndices = arrayKeepingSomeIndices;
        function arrayMinusSomeIndices(array, indicesSuppress) {
            var res = [];
            for (var i = 0; i < array.length; i++) {
                if (indicesSuppress.indexOf(i) == -1)
                    res.push(array[i]);
            }
            return res;
        }
        tab.arrayMinusSomeIndices = arrayMinusSomeIndices;
        function arrayMinusBlocksIndices(list, indicesOfBlocksToRemove, blockSize) {
            var res = [];
            for (var i = 0; i < list.length; i += blockSize) {
                if (indicesOfBlocksToRemove.indexOf(i) == -1) {
                    for (var j = 0; j < blockSize; j++) {
                        res.push(list[i + j]);
                    }
                }
            }
            return res;
        }
        tab.arrayMinusBlocksIndices = arrayMinusBlocksIndices;
        function minIndexOfNumericList(list) {
            var minValue = Number.MAX_VALUE;
            var minIndex = -1;
            for (var i = 0; i < list.length; i++) {
                if (list[i] < minValue) {
                    minValue = list[i];
                    minIndex = i;
                }
            }
            if (minIndex == -1)
                mathis.logger.c('an empty line has no minimum');
            return minIndex;
        }
        tab.minIndexOfNumericList = minIndexOfNumericList;
        function maxIndexOfNumericList(list) {
            var maxValue = Number.NEGATIVE_INFINITY;
            var maxIndex = -1;
            for (var i = 0; i < list.length; i++) {
                if (list[i] > maxValue) {
                    maxValue = list[i];
                    maxIndex = i;
                }
            }
            return maxIndex;
        }
        tab.maxIndexOfNumericList = maxIndexOfNumericList;
        function minIndexOfStringList(list) {
            if (list.length == 0) {
                mathis.logger.c('an empty line has no minimum');
                return -1;
            }
            var minValue = list[0];
            var minIndex = 0;
            for (var i = 0; i < list.length; i++) {
                if (list[i] < minValue) {
                    minValue = list[i];
                    minIndex = i;
                }
            }
            return minIndex;
        }
        tab.minIndexOfStringList = minIndexOfStringList;
        function indicesUpPermutationToString(indices) {
            var minIndex = minIndexOfNumericList(indices);
            var permuted = [];
            for (var i = 0; i < indices.length; i++) {
                permuted[i] = indices[(i + minIndex) % indices.length];
            }
            return JSON.stringify(permuted);
        }
        tab.indicesUpPermutationToString = indicesUpPermutationToString;
        var ArrayMinusBlocksElements = (function () {
            function ArrayMinusBlocksElements(longList, blockSize, listToRemove) {
                this.dicoOfExistingBlocks = {};
                this.removeAlsoCircularPermutation = true;
                this.longList = longList;
                this.blockSize = blockSize;
                if (listToRemove == null) {
                    this.listToRemove = longList;
                    this.removeOnlyDoublon = true;
                }
                else {
                    this.listToRemove = listToRemove;
                    this.removeOnlyDoublon = false;
                }
            }
            ArrayMinusBlocksElements.prototype.go = function () {
                /**construction of the dictionary */
                for (var i = 0; i < this.listToRemove.length; i += this.blockSize) {
                    try {
                        var block = [];
                        for (var j = 0; j < this.blockSize; j++)
                            block.push(this.listToRemove[i + j].hashString);
                        this.dicoOfExistingBlocks[this.key(block)] = 1;
                    }
                    catch (e) {
                        throw "a block is not in your list";
                    }
                }
                /**construction of the resulting array, checking the dictionnary*/
                var newLongList = [];
                for (var i = 0; i < this.longList.length; i += this.blockSize) {
                    var block = [];
                    for (var j = 0; j < this.blockSize; j++)
                        block.push(this.longList[i + j].hashString);
                    if (!this.removeOnlyDoublon) {
                        if (this.dicoOfExistingBlocks[this.key(block)] == null) {
                            for (var j = 0; j < this.blockSize; j++)
                                newLongList.push(this.longList[i + j]);
                        }
                    }
                    else {
                        if (this.dicoOfExistingBlocks[this.key(block)] == 1) {
                            for (var j = 0; j < this.blockSize; j++)
                                newLongList.push(this.longList[i + j]);
                            this.dicoOfExistingBlocks[this.key(block)]++;
                        }
                    }
                }
                return newLongList;
            };
            //
            //private allCircularPermutations(list:number[]):number[][]{
            //    let res:number[][]=[]
            //
            //    for (let i=0;i<this.blockSize;i++){
            //        let perm:number[]=[]
            //        for (let j=0;j<this.blockSize;j++) perm.push(list[(i+j)%this.blockSize])
            //        res.push(perm)
            //    }
            //
            //    return res
            //
            //
            //}
            ArrayMinusBlocksElements.prototype.key = function (list) {
                var rearangedList = [];
                if (!this.removeAlsoCircularPermutation)
                    rearangedList = list;
                else {
                    rearangedList = [];
                    var minIndex_1 = minIndexOfStringList(list);
                    for (var i = 0; i < list.length; i++)
                        rearangedList[i] = list[(i + minIndex_1) % list.length];
                }
                var key = "";
                rearangedList.forEach(function (nu) {
                    key += nu + ',';
                });
                return key;
            };
            return ArrayMinusBlocksElements;
        }());
        tab.ArrayMinusBlocksElements = ArrayMinusBlocksElements;
    })(tab = mathis.tab || (mathis.tab = {}));
})(mathis || (mathis = {}));
