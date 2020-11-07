var app;
var emojis = ["🐱‍🐉", "👀", "🐱‍👤", "🎉", "🎶", "🍤", "🌹", "🧨", "🧵", "✨"];
var nextId = 0;

function makePiece(val, realNum = false, zone = null) {
    if (val < 0 || val > 9) throw "Value must be between 0 and 9.";
    return {
        id: nextId++,
        sign: (realNum ? val : emojis[val]),
        value: val,
        zone: zone,
        locked: realNum
    };
}

function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function makeAttemptPieces(chance) {
    var ret = [];
    for (var i = 0; i < emojis.length; i++) {
        ret.push({ sign: emojis[i], correctAnswer: i, answer: (Math.random() < chance ? "" + i : "") });
    }
    return shuffleArray(ret);
}

function crand(...exclude) {
    var ret = Math.floor(Math.random() * 10);
    while (exclude.includes(ret))
        ret = Math.floor(Math.random() * 10);
    return ret;
}

function initPage() {
    app = new Vue({
        el: "#app",
        data: {
            playingGame: false,
            pieces: [],
            answers: [],
            attemptPieces: [],
            round: 0,
            won: false
        },
        computed: {
            zoneA() {
                var all = this.pieces.filter(piece => piece.zone == 1);
                if (all.length <= 0) return {};
                return all[0];
            },
            zoneB() {
                var all = this.pieces.filter(piece => piece.zone == 2);
                if (all.length <= 0) return {};
                return all[0];
            },
            zoneC() {
                var all = this.pieces.filter(piece => piece.zone == 3);
                if (all.length <= 0) return {};
                return all[0];
            },
            unusedPieces() {
                return this.pieces.filter(piece => piece.zone == null);
            }
        },
        methods: {
            startGameLong: function (event) {
                shuffleArray(emojis);
                this.attemptPieces = makeAttemptPieces(0.3);
                this.round = 0;
                this.generatePieces();
                this.playingGame = true;
            },
            startGameShort: function (event) {
                shuffleArray(emojis);
                this.attemptPieces = makeAttemptPieces(0.7);
                this.round = 0;
                this.generatePieces();
                this.playingGame = true;
            },
            startDrag: function (event, piece) {
                event.dataTransfer.dropEffect = "move";
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("pieceId", piece.id);
            },
            onDrop: function (event, zone) {
                var pieceId = event.dataTransfer.getData("pieceId");
                var piece = this.pieces.find(piece => piece.id == pieceId);
                var check = this.pieces.filter(p => p.zone == zone);
                if (check.length <= 0) {
                    piece.zone = zone;
                } else if (!check[0].locked) {
                    piece.zone = zone;
                    check[0].zone = null;
                }
                this.checkAnswer();
            },
            generatePieces: function () {
                if (this.round <= 1) {
                    var b = crand();
                    var a = 9 - b;
                    var c = a + b;

                    if (this.round > 0)
                        this.pieces = [makePiece(a), makePiece(b, true, 2), makePiece(c), makePiece(crand(a, b, c))];
                    else
                        this.pieces = [makePiece(a), makePiece(b, true, 2), makePiece(c)];
                    shuffleArray(this.pieces);

                } else {
                    var a = crand();
                    var b = crand();
                    while (a + b > 9) {
                        a = crand();
                        b = crand();
                    }
                    var c = a + b;

                    if (this.round < 3) {
                        if (Math.random() < 0.5) {
                            this.pieces = [makePiece(a, true, 1), makePiece(b), makePiece(c)];
                        } else if (Math.random() < 0.5) {
                            this.pieces = [makePiece(a), makePiece(b, true, 2), makePiece(c)];
                        } else {
                            this.pieces = [makePiece(a), makePiece(b), makePiece(c, true, 3)];
                        }
                    } else if (this.round < 5) {
                        this.pieces = [makePiece(a), makePiece(b), makePiece(c)];
                    } else {
                        if (Math.random() < 0.5) {
                            this.pieces = [makePiece(a, true, 1), makePiece(b), makePiece(c)];
                        } else if (Math.random() < 0.5) {
                            this.pieces = [makePiece(a), makePiece(b, true, 2), makePiece(c)];
                        } else {
                            this.pieces = [makePiece(a), makePiece(b), makePiece(c, true, 3)];
                        }

                        this.pieces.push(makePiece(crand(a, b, c)));
                    }

                    shuffleArray(this.pieces);
                }
            },
            checkAnswer: function (event) {
                if (this.zoneA.zone && this.zoneB.zone && this.zoneC.zone) {
                    if (this.zoneA.value + this.zoneB.value == this.zoneC.value) {
                        this.answers.unshift({ a: this.zoneA, b: this.zoneB, c: this.zoneC });
                        this.round += 1;
                        this.pieces = [];
                        this.generatePieces();
                    } else {
                        this.resetPieces();
                    }
                }
            },
            checkAttempt: function (event) {
                for (var i = 0; i < this.attemptPieces.length; i++) {
                    if (this.attemptPieces[i].answer != this.attemptPieces[i].correctAnswer) {
                        alert("You have at least 1 incorrect answer :(")
                        return;
                    }
                }
                // They won!
                this.won = true;
            },
            resetPieces: function (event) {
                this.pieces.forEach((p) => {
                    if (!p.locked) p.zone = null;
                });
            }
        }
    });
}