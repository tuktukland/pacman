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

    private isWalkable(r: number, c: number): boolean {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) {
            return false;
        }
        const tile = this.maze.grid[r][c];
        return tile !== TileType.Empty && tile !== TileType.GhostHouse;
    }

    // Draw colored rectangles for UI and Maze areas
    public drawMaze(maze: Maze): void {
        this.maze = maze; // Keep maze reference if needed later
        const headerFooterColor = '#CCCCCC'; // Light grey
        const mazeAreaColor = '#008000';    // Green

        this.clear(); // Start with a black background

        const uiTopRows = 3;
        const uiBottomRows = 2;
        const mazeStartRow = uiTopRows;
        const mazeEndRow = this.rows - uiBottomRows; // Exclusive index

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.tileSize;
                const y = r * this.tileSize;

                // Determine fill color based on row
                if (r < mazeStartRow || r >= mazeEndRow) {
                    // Header or Footer
                    this.ctx.fillStyle = headerFooterColor;
                } else {
                    // Maze Area
                    this.ctx.fillStyle = mazeAreaColor;
                }

                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
            }
        }
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