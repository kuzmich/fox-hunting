describe("Fox Hunting Game", function () {
    describe("Utils", function () {
        beforeEach(function () {
            FHO.grid.offset = {x: 0, y: 0};
            FHO.grid.cellSize = {width: 5, height: 5};
        });

        it("getCellPos() should report correct cell coordinates", function () {
            expect(getCellPos(Cell(0, 0))).toEqual(
                   {left: 1, top: 1, right: 5, bottom: 5,
                    border: {left: 0.5, top: 0.5, right: 5.5, bottom: 5.5}
                   });

            expect(getCellPos(Cell(1, 1))).toEqual(
                   {left: 6, top: 6, right: 10, bottom: 10,
                    border: {left: 5.5, top: 5.5, right: 10.5, bottom: 10.5}
                   });

            expect(getCellPos(Cell(-1, -1))).toEqual(
                   {left: -4, top: -4, right: 0, bottom: 0,
                    border: {left: -4.5, top: -4.5, right: 0.5, bottom: 0.5}
                   });
        });

        it("countDetectableFoxes() should report correct number of detectable foxes", function () {
            var foxes = [Cell(1, 1), Cell(4, 1), Cell(0, 4)];

            expect(countDetectableFoxes(Cell(0, 0), foxes)).toEqual(2);
            expect(countDetectableFoxes(Cell(3, 1), foxes)).toEqual(3);
            expect(countDetectableFoxes(Cell(2, 3), foxes)).toEqual(1);
            expect(countDetectableFoxes(Cell(4, 1), foxes)).toEqual(2);
        });

        it("getClickedCell() should return right cell", function () {
            FHG.canvas = {offsetLeft: 0, offsetTop: 0}
            expect(getClickedCell({pageX: 0, pageY: 0})).toEqual(Cell(0, 0));
            expect(getClickedCell({pageX: 4, pageY: 4})).toEqual(Cell(0, 0));
            expect(getClickedCell({pageX: 5, pageY: 2})).toEqual(Cell(1, 0));
        });

        //it("", function () {
        //});
    });
});
