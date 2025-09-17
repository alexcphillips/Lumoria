import { Schema, type } from "@colyseus/schema";
import { Vector3, Quaternion } from "./Math";

export enum EnemyType {
  GOBLIN = "goblin",
  ORC = "orc",
  SKELETON = "skeleton",
  DRAGON = "dragon",
}

export enum EnemyState {
  IDLE = "idle",
  PATROLLING = "patrolling",
  CHASING = "chasing",
  ATTACKING = "attacking",
  DEAD = "dead",
}

export class Enemy extends Schema {
  @type("string") id: string = "";
  @type("string") type: string = EnemyType.GOBLIN;
  @type("string") state: string = EnemyState.IDLE;
  @type("number") level: number = 1;
  @type("number") health: number = 50;
  @type("number") maxHealth: number = 50;
  @type("number") damage: number = 10;
  @type("number") movementSpeed: number = 3.0;
  @type("number") detectionRange: number = 10.0;
  @type("number") attackRange: number = 2.0;
  @type("boolean") isAlive: boolean = true;
  @type(Vector3) position: Vector3 = new Vector3();
  @type(Quaternion) rotation: Quaternion = new Quaternion();
  @type(Vector3) spawnPosition: Vector3 = new Vector3();
  @type("string") targetPlayerId: string = "";
  @type("number") lastAttackTime: number = 0;
  @type("number") attackCooldown: number = 2000; // 2 seconds
  @type("number") lastUpdateTime: number = 0;

  constructor(id: string, type: EnemyType, x: number, y: number, z: number) {
    super();
    this.id = id;
    this.type = type;
    this.position.set(x, y, z);
    this.spawnPosition.set(x, y, z);
    this.lastUpdateTime = Date.now();

    // Set stats based on enemy type
    this.setStatsForType(type);
  }

  private setStatsForType(type: EnemyType) {
    switch (type) {
      case EnemyType.GOBLIN:
        this.health = this.maxHealth = 30;
        this.damage = 8;
        this.movementSpeed = 4.0;
        this.detectionRange = 8.0;
        break;
      case EnemyType.ORC:
        this.health = this.maxHealth = 80;
        this.damage = 15;
        this.movementSpeed = 2.5;
        this.detectionRange = 12.0;
        break;
      case EnemyType.SKELETON:
        this.health = this.maxHealth = 50;
        this.damage = 12;
        this.movementSpeed = 3.5;
        this.detectionRange = 10.0;
        break;
      case EnemyType.DRAGON:
        this.health = this.maxHealth = 500;
        this.damage = 50;
        this.movementSpeed = 6.0;
        this.detectionRange = 20.0;
        this.attackRange = 5.0;
        this.attackCooldown = 3000;
        break;
    }
  }

  updatePosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
    this.lastUpdateTime = Date.now();
  }

  updateRotation(x: number, y: number, z: number, w: number) {
    this.rotation.set(x, y, z, w);
    this.lastUpdateTime = Date.now();
  }

  setState(newState: EnemyState) {
    this.state = newState;
    this.lastUpdateTime = Date.now();
  }

  setTarget(playerId: string) {
    this.targetPlayerId = playerId;
    this.lastUpdateTime = Date.now();
  }

  takeDamage(damage: number): boolean {
    this.health = Math.max(0, this.health - damage);
    this.isAlive = this.health > 0;

    if (!this.isAlive) {
      this.setState(EnemyState.DEAD);
    }

    return this.isAlive;
  }

  canAttack(): boolean {
    return Date.now() - this.lastAttackTime >= this.attackCooldown;
  }

  attack(): number {
    if (this.canAttack()) {
      this.lastAttackTime = Date.now();
      return this.damage;
    }
    return 0;
  }

  getDistanceToSpawn(): number {
    return this.position.distance(this.spawnPosition);
  }
}
