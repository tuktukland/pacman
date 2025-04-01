class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    // Add properties for game state, entities, etc. later

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error(`Canvas element with id '${canvasId}' not found.`);
        }
        this.ctx = this.canvas.getContext('2d')!;

        // Set canvas dimensions (adjust later based on Pac-Man maze size)
        this.canvas.width = 448; // Example dimensions
        this.canvas.height = 576;

        this.initialize();
    }

    private initialize(): void {
        console.log('Game initialized!');
        // Initial setup logic here (e.g., loading assets, creating entities)
    }

    public start(): void {
        console.log('Starting game loop...');
        this.gameLoop();
    }

    private gameLoop(): void {
        // Main game loop logic (update, render)
        this.update();
        this.render();

        // Request the next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private update(): void {
        // Update game state (handle input, move characters, check collisions)
        // Placeholder for now
    }

    private render(): void {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw game elements (maze, Pac-Man, ghosts, dots, score)
        // Placeholder for now - draw a black background
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Example: Draw a simple shape to verify rendering
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(100, 100, 50, 50);
    }
}

export default Game; 