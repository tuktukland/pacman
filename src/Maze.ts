export enum TileType {
    Empty,      // 0: Non-walkable areas, UI padding, wall background
    Path,       // 1: Walkable path (no dot)
    Dot,        // 2: Path with a standard dot
    PowerPellet,// 3: Path with a power pellet
    GhostHouse, // 4: Non-walkable area inside the ghost house
    GhostGate,  // 5: The gate ghosts use to exit
    // Tunnel can be represented by Path leading off grid, handled by movement logic later
}

class Maze {
    public grid: TileType[][];
    public readonly rows: number = 36;    // Total rows including UI (3 + 31 + 2)
    public readonly cols: number = 28;    // Total columns
    public readonly tileSize: number = 8; // Size of each tile in pixels

    // 31x28 Maze Layout - Derived from the screenshot grid
    // 0=Empty(Wall), 1=Path, 2=Dot, 3=PowerPellet, 4=GhostHouse, 5=GhostGate
    private layout: number[][] = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], // Row 0 of Maze Area (Actual Grid Row 3)
        [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
        [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
        [0,3,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,3,0], // Power Pellets in this row
        [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
        [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
        [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
        [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
        [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
        [0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0], // Row 9 - Paths near center, no dots
        [0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,0,0,0,0,0], // Row 11 - Ghost house top boundary paths
        [0,0,0,0,0,0,2,0,0,1,0,0,0,4,4,0,0,0,1,0,0,2,0,0,0,0,0,0], // Row 12 - Ghost house walls start
        [0,0,0,0,0,0,2,0,0,1,0,4,4,4,4,4,4,0,1,0,0,2,0,0,0,0,0,0], // Row 13 - Ghost house inside
        [1,1,1,1,1,1,2,1,1,1,0,4,4,5,5,4,4,0,1,1,1,2,1,1,1,1,1,1], // Row 14 - Ghost Gate level (Path=1 around maze edge for tunnel)
        [0,0,0,0,0,0,2,0,0,1,0,4,4,4,4,4,4,0,1,0,0,2,0,0,0,0,0,0], // Row 15 - Ghost house inside
        [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0], // Row 16 - Ghost house bottom boundary paths
        [0,0,0,0,0,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
        [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0], // Row 20
        [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
        [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
        [0,3,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,3,0], // Row 23 - Power Pellet & Pacman Start Row vicinity
        [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
        [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
        [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
        [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
        [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
        [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]  // Row 30 of Maze Area (Actual Grid Row 33)
    ];

    constructor() {
        this.grid = [];
        const uiTopRows = 3;
        const uiBottomRows = 2;

        // Fill top UI rows
        for (let r = 0; r < uiTopRows; r++) {
            this.grid[r] = new Array(this.cols).fill(TileType.Empty);
        }

        // Fill maze layout rows
        for (let r = 0; r < this.layout.length; r++) {
            this.grid[uiTopRows + r] = [];
            for (let c = 0; c < this.cols; c++) {
                const layoutValue = this.layout[r][c];
                // Convert number from layout array to TileType enum
                switch (layoutValue) {
                    case 0: this.grid[uiTopRows + r][c] = TileType.Empty; break;
                    case 1: this.grid[uiTopRows + r][c] = TileType.Path; break;
                    case 2: this.grid[uiTopRows + r][c] = TileType.Dot; break;
                    case 3: this.grid[uiTopRows + r][c] = TileType.PowerPellet; break;
                    case 4: this.grid[uiTopRows + r][c] = TileType.GhostHouse; break;
                    case 5: this.grid[uiTopRows + r][c] = TileType.GhostGate; break;
                    default: this.grid[uiTopRows + r][c] = TileType.Empty; // Default to Empty
                }
            }
        }

        // Fill bottom UI rows
        for (let r = 0; r < uiBottomRows; r++) {
            this.grid[uiTopRows + this.layout.length + r] = new Array(this.cols).fill(TileType.Empty);
        }

        console.log(`Maze initialized with TileTypes. Total Rows: ${this.grid.length}, Maze Layout Rows: ${this.layout.length}`);
    }
}

export default Maze; 