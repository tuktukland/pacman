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
    private readonly pacmanStartRow = 23;
    private readonly pacmanStartCol = 13.5; // Centered horizontally

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error(`Canvas element with id '${canvasId}' not found.`);
        }
        this.ctx = this.canvas.getContext('2d')!;

        this.maze = new Maze(); // Create a new Maze instance

        // Set canvas dimensions based on maze size
        this.canvas.width = this.maze.cols * this.maze.tileSize;
        this.canvas.height = this.maze.rows * this.maze.tileSize;

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
        this.renderer.clear();
        this.renderer.drawMaze(this.maze);
        this.renderer.drawPacMan(this.pacman);
        // Draw grid overlay for debugging
        this.renderer.drawGrid();
    }
}

export default Game; 