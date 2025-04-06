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

    // Revert drawMaze to use basic shapes
    public drawMaze(maze: Maze): void {
        this.maze = maze;
        const wallColor = '#1919A6';
        const dotColor = '#FFB8AE';
        const pelletColor = '#FFB8AE';
        const gateColor = '#FFB8FF';
        const wallThickness = 1; // Use 1 pixel for wall thickness

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.tileSize;
                const y = r * this.tileSize;
                const centerX = x + this.tileSize / 2;
                const centerY = y + this.tileSize / 2;
                const currentTile = this.maze.grid[r][c];

                // 1. Draw Dots, Power Pellets, Ghost Gate
                if (currentTile === TileType.Dot) {
                    this.ctx.fillStyle = dotColor;
                    this.ctx.fillRect(centerX - 1, centerY - 1, 2, 2);
                } else if (currentTile === TileType.PowerPellet) {
                    this.ctx.fillStyle = pelletColor;
                    this.ctx.beginPath();
                    this.ctx.arc(centerX, centerY, this.tileSize * 0.4, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (currentTile === TileType.GhostGate) {
                    this.ctx.fillStyle = gateColor;
                    this.ctx.fillRect(x, centerY - 1, this.tileSize, 2);
                }

                // 2. Draw Wall Boundaries (1px thick, inside non-walkable tile)
                if (!this.isWalkable(r, c)) {
                    const walkableAbove = this.isWalkable(r - 1, c);
                    const walkableBelow = this.isWalkable(r + 1, c);
                    const walkableLeft = this.isWalkable(r, c - 1);
                    const walkableRight = this.isWalkable(r, c + 1);

                    this.ctx.fillStyle = wallColor;

                    if (walkableAbove) { this.ctx.fillRect(x, y, this.tileSize, wallThickness); }
                    if (walkableBelow) { this.ctx.fillRect(x, y + this.tileSize - wallThickness, this.tileSize, wallThickness); }
                    if (walkableLeft) { this.ctx.fillRect(x, y, wallThickness, this.tileSize); }
                    if (walkableRight) { this.ctx.fillRect(x + this.tileSize - wallThickness, y, wallThickness, this.tileSize); }
                }
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

    // Method to draw the debug grid overlay
    public drawGrid(): void {
        this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)'; // Semi-transparent grey
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();

        // Draw vertical lines
        for (let c = 0; c <= this.cols; c++) {
            const x = c * this.tileSize;
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.rows * this.tileSize);
        }

        // Draw horizontal lines
        for (let r = 0; r <= this.rows; r++) {
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