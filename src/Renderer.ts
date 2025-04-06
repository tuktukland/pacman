import Maze, { TileType } from './Maze';
import PacMan from './PacMan';

// Remove SpriteRect and spriteMap for now
// interface SpriteRect { sx: number; sy: number; sw: number; sh: number; }
// const spriteMap: { [key: string]: SpriteRect } = { ... };

class Renderer {
    private ctx: CanvasRenderingContext2D;
    private tileSize: number;
    private rows: number;
    private cols: number;
    // private spritesheet: HTMLImageElement; // Remove
    private maze!: Maze;
    // private _loggedRows: boolean = false; // Remove Debug flag

    // Remove spritesheet parameter
    constructor(ctx: CanvasRenderingContext2D, maze: Maze) {
        this.ctx = ctx;
        this.tileSize = maze.tileSize;
        this.rows = maze.rows;
        this.cols = maze.cols;
        // this.spritesheet = spritesheet; // Remove assignment
        this.maze = maze;
        // this.ctx.imageSmoothingEnabled = false; // Remove
    }

    public clear(): void {
        this.ctx.clearRect(0, 0, this.cols * this.tileSize, this.rows * this.tileSize);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.cols * this.tileSize, this.rows * this.tileSize);
    }

    // Re-enable isWalkable method
    private isWalkable(r: number, c: number): boolean {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) {
            return false;
        }
        // Check the actual grid data from Maze instance
        const tile = this.maze.grid[r]?.[c]; // Use optional chaining for safety
        // Consider Path, Dot, PowerPellet, and Tunnel entrance/exit as walkable
        return tile === TileType.Path || tile === TileType.Dot || tile === TileType.PowerPellet;
        // GhostGate is not typically walkable by PacMan
        // GhostHouse and Empty are not walkable
    }

    // Draw the actual maze elements based on TileType
    public drawMaze(maze: Maze): void {
        this.maze = maze; // Update internal reference
        const wallColor = '#1919A6'; // Blue for walls
        const dotColor = '#FFB8AE'; // Standard dot color
        const pelletColor = '#FFB8AE'; // Power pellet color (same for now)
        const gateColor = '#FFB8FF'; // Ghost gate color
        const backgroundColor = '#000000'; // Black background for empty/path areas

        this.clear(); // Clear canvas first

        const uiTopRows = 3;
        const uiBottomRows = 2;
        const mazeStartRow = uiTopRows;
        const mazeEndRow = this.rows - uiBottomRows;

        // --- First Pass: Draw backgrounds, dots, pellets, gate ---
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.tileSize;
                const y = r * this.tileSize;
                const centerX = x + this.tileSize / 2;
                const centerY = y + this.tileSize / 2;
                const currentTile = this.maze.grid[r]?.[c]; // Use optional chaining

                // Fill background first (black for maze area, grey for UI)
                if (r < mazeStartRow || r >= mazeEndRow) {
                    this.ctx.fillStyle = '#CCCCCC'; // Light grey for UI
                } else {
                    this.ctx.fillStyle = backgroundColor; // Black for maze background
                }
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);

                // Now draw maze elements only within the maze rows
                if (r >= mazeStartRow && r < mazeEndRow && currentTile !== undefined) {
                    // 1. Draw Dots, Power Pellets, Ghost Gate
                    if (currentTile === TileType.Dot) {
                        this.ctx.fillStyle = dotColor;
                        this.ctx.fillRect(centerX - 1, centerY - 1, 2, 2); // Small square dot
                    } else if (currentTile === TileType.PowerPellet) {
                        this.ctx.fillStyle = pelletColor;
                        this.ctx.beginPath();
                        this.ctx.arc(centerX, centerY, this.tileSize * 0.4, 0, Math.PI * 2); // Larger circle pellet
                        this.ctx.fill();
                    } else if (currentTile === TileType.GhostGate) {
                        this.ctx.fillStyle = gateColor;
                        this.ctx.fillRect(x, centerY - 1, this.tileSize, 2); // Horizontal line for gate
                    }
                }
            }
        }

        // --- Second Pass: Draw Walls ---
        const wallLineWidth = 1; // Use full tileSize for thickness
        this.ctx.beginPath();
        this.ctx.strokeStyle = wallColor;
        this.ctx.lineWidth = wallLineWidth;
        this.ctx.lineCap = 'round'; // Use round caps for smooth corners

        // Helper to check if a tile is a wall type (avoids code duplication)
        const isWall = (row: number, col: number): boolean => {
            // Check within full grid bounds, but rendering only considers maze area
            if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
                return false; // Treat out-of-bounds as not a wall for drawing purposes
            }
            const tile = this.maze.grid[row]?.[col];
            return tile === TileType.Empty || tile === TileType.GhostHouse;
        };

        // Iterate through maze tiles to draw connections between wall centers
        for (let r = mazeStartRow; r < mazeEndRow; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!isWall(r, c)) continue; // Skip non-wall tiles

                const centerX = c * this.tileSize + this.tileSize / 2;
                const centerY = r * this.tileSize + this.tileSize / 2;

                // Check RIGHT neighbor within maze bounds
                if (c + 1 < this.cols && isWall(r, c + 1)) {
                    this.ctx.moveTo(centerX, centerY);
                    this.ctx.lineTo(centerX + this.tileSize, centerY);
                }

                // Check BOTTOM neighbor within maze bounds
                // Need to check r + 1 against mazeEndRow
                if (r + 1 < mazeEndRow && isWall(r + 1, c)) {
                    this.ctx.moveTo(centerX, centerY);
                    this.ctx.lineTo(centerX, centerY + this.tileSize);
                }
            }
        }
        this.ctx.stroke(); // Draw all the collected wall segments
    }

    // Draw Pac-Man as a simple yellow circle
    public drawPacMan(pacMan: PacMan): void {
        this.ctx.fillStyle = 'yellow';
        this.ctx.beginPath();
        this.ctx.arc(pacMan.x, pacMan.y, pacMan.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Method to draw the debug grid overlay only within the maze area
    public drawGrid(): void {
        this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)'; // Semi-transparent grey
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();

        const uiTopRows = 3;
        const uiBottomRows = 2;
        const mazeStartRow = uiTopRows;
        const mazeEndRow = this.rows - uiBottomRows;
        const mazeStartY = mazeStartRow * this.tileSize;
        const mazeHeight = (mazeEndRow - mazeStartRow) * this.tileSize;

        // Draw vertical lines (span full height for alignment)
        for (let c = 0; c <= this.cols; c++) {
            const x = c * this.tileSize;
            this.ctx.moveTo(x, mazeStartY);
            this.ctx.lineTo(x, mazeStartY + mazeHeight);
        }

        // Draw horizontal lines only within the maze area
        for (let r = mazeStartRow; r <= mazeEndRow; r++) {
            const y = r * this.tileSize;
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.cols * this.tileSize, y);
        }

        this.ctx.stroke();
    }

    // Placeholders
    public drawGhost(/* ghost: Ghost */): void { console.log("Drawing Ghost..."); }
    public drawUI(/* gameState: GameState */): void { console.log("Drawing UI..."); }
}

export default Renderer; 