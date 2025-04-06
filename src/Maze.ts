export enum TileType {
    Path,
    Dot,
    PowerPellet,
    GhostHouse,
    GhostGate,
    Tunnel,
    Empty, // Represents non-walkable areas and UI padding
}

class Maze {
    public grid: TileType[][];
    public readonly rows: number;
    public readonly cols: number;
    public readonly tileSize: number = 8; // Size of each tile in pixels

    // Using a standard representation:
    // 0 maps to Empty (Impassable area / Wall background)
    // 1: Path, 2: Dot, 3: Power Pellet, 4: Ghost House, 5: Ghost Gate, 6: Tunnel, 7: Empty (UI Padding)
    private layout = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
        [0,3,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,3,0],
        [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
        [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
        [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
        [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
        [0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0],
        [7,7,7,7,7,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,7,7,7,7,7],
        [0,0,0,0,0,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,1,0,0,0,4,4,0,0,0,1,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,1,0,4,4,4,4,4,4,0,1,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,1,0,4,4,4,4,4,4,0,1,0,0,2,0,0,0,0,0,0],
        [1,1,1,1,1,1,2,1,1,1,0,4,4,5,5,4,4,0,1,1,1,2,1,1,1,1,1,1],
        [0,0,0,0,0,0,2,0,0,1,0,4,4,4,4,4,4,0,1,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,0,0,0,0,0],
        [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
        [0,3,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,3,0],
        [0,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,0],
        [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
        [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
        [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
        [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
        [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
        [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    // Adding extra rows for UI elements (score, lives) - typically 3 rows above, 2 below map = 36 total rows
    private uiLayout = [
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
        [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
    ];

    constructor() {
        const fullLayout = [...this.uiLayout.slice(0, 3), ...this.layout, ...this.uiLayout.slice(3)];

        this.rows = fullLayout.length;
        this.cols = fullLayout[0].length;
        this.grid = [];

        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                // Update mapping: 0 and 7 map to Empty
                switch (fullLayout[r][c]) {
                    case 1: this.grid[r][c] = TileType.Path; break;
                    case 2: this.grid[r][c] = TileType.Dot; break;
                    case 3: this.grid[r][c] = TileType.PowerPellet; break;
                    case 4: this.grid[r][c] = TileType.GhostHouse; break;
                    case 5: this.grid[r][c] = TileType.GhostGate; break;
                    case 6: this.grid[r][c] = TileType.Tunnel; break;
                    case 0:
                    case 7:
                    default: this.grid[r][c] = TileType.Empty;
                }
            }
        }
    }

    // Removed the draw method - it's now in Renderer.ts
}

export default Maze; 