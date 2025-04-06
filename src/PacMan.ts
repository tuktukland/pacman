import Maze from "./Maze";

// Represents Pac-Man's possible directions
export enum Direction {
    None,
    Up,
    Down,
    Left,
    Right
}

class PacMan {
    // Position based on pixels for smoother movement, but tied to grid logic
    public x: number;
    public y: number;
    public speed: number;
    public currentDirection: Direction;
    public requestedDirection: Direction; // For handling input buffering
    public readonly size: number; // Pixel size (diameter)

    constructor(maze: Maze, startRow: number, startCol: number) {
        this.size = maze.tileSize * 1.5; // Pac-Man is roughly 1.5 tiles wide
        // Center Pac-Man in the starting tile
        this.x = startCol * maze.tileSize + maze.tileSize / 2;
        this.y = startRow * maze.tileSize + maze.tileSize / 2;
        this.speed = 1; // Adjust speed as needed (pixels per frame)
        this.currentDirection = Direction.None; // Start stationary
        this.requestedDirection = Direction.None;

        console.log(`PacMan created at (${this.x}, ${this.y})`);
    }

    // Update Pac-Man's position based on direction (simplified for now)
    public update(/* deltaTime: number, maze: Maze */): void {
        // Movement logic will go here - checking walls, updating x/y based on speed and direction
        // switch (this.currentDirection) {
        //     case Direction.Up: this.y -= this.speed; break;
        //     case Direction.Down: this.y += this.speed; break;
        //     case Direction.Left: this.x -= this.speed; break;
        //     case Direction.Right: this.x += this.speed; break;
        // }
    }

    // Method to request a direction change (from input handler later)
    public setRequestedDirection(direction: Direction): void {
        this.requestedDirection = direction;
    }
}

export default PacMan; 