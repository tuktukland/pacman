import Maze from './Maze'; // Import the Maze class
import Renderer from './Renderer'; // Import the Renderer class
import PacMan from './PacMan'; // Import PacMan class

class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private maze: Maze; // Add a maze property
    private renderer: Renderer; // No definite assignment needed now
    private pacman: PacMan; // Add PacMan instance property
    private animationFrameId: number | null = null; // To control the game loop

    // Pac-Man's starting position in the maze grid (adjust if needed)
    // Original layout row index 23. With 3 UI rows added at the top, the correct index is 26.
    private readonly pacmanStartRow = 26;
    private readonly pacmanStartCol = 13.5; // Centered horizontally

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error(`Canvas element with id '${canvasId}' not found.`);
        }
        this.ctx = this.canvas.getContext('2d')!;

        this.maze = new Maze(); // Create a new Maze instance

        // Set canvas dimensions based on maze size and internal resolution
        this.canvas.width = this.maze.cols * this.maze.tileSize;
        this.canvas.height = this.maze.rows * this.maze.tileSize;
        
        // Scale up the context for crisp pixels
        this.ctx.imageSmoothingEnabled = false;

        // Create PacMan instance
        this.pacman = new PacMan(this.maze, this.pacmanStartRow, this.pacmanStartCol);

        // Create renderer directly
        this.renderer = new Renderer(this.ctx, this.maze);
        console.log('Game initialized!');
    }

    public start(): void {
        if (this.animationFrameId === null) {
            console.log('Starting game loop...');
            this.gameLoop();
        }
    }

    public stop(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
            console.log('Game loop stopped.');
        }
    }

    private gameLoop(): void {
        this.update();
        this.render();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    private update(): void {
        this.pacman.update();
    }

    private render(): void {
        this.renderer.drawMaze(this.maze);
        // Don't draw PacMan for now, just the grid
        // this.renderer.drawPacMan(this.pacman);
        // Remove grid overlay call
        // this.renderer.drawGrid();
    }
}

export default Game; 