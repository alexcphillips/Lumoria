import { Schema, type } from "@colyseus/schema";
import { Vector3, Quaternion } from "./Math";

export class Player extends Schema {
  @type("string") id: string = "";
  @type("string") username: string = "";
  @type("string") characterClass: string = "warrior";
  @type("number") level: number = 1;
  @type("number") health: number = 100;
  @type("number") maxHealth: number = 100;
  @type("number") mana: number = 50;
  @type("number") maxMana: number = 50;
  @type("boolean") isAlive: boolean = true;
  @type("boolean") isMoving: boolean = false;
  @type("number") movementSpeed: number = 5.0;
  @type(Vector3) position: Vector3 = new Vector3();
  @type(Quaternion) rotation: Quaternion = new Quaternion();
  @type(Vector3) velocity: Vector3 = new Vector3();
  @type("number") lastUpdateTime: number = 0;

  constructor(id: string, username: string) {
    super();
    this.id = id;
    this.username = username;
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
    this.lastUpdateTime = Date.now();
  }

  updateRotation(x: number, y: number, z: number, w: number) {
    this.rotation.set(x, y, z, w);
    this.lastUpdateTime = Date.now();
  }

  updateVelocity(x: number, y: number, z: number) {
    this.velocity.set(x, y, z);
    this.isMoving = x !== 0 || y !== 0 || z !== 0;
    this.lastUpdateTime = Date.now();
  }

  takeDamage(damage: number): boolean {
    this.health = Math.max(0, this.health - damage);
    this.isAlive = this.health > 0;
    return this.isAlive;
  }

  heal(amount: number) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  consumeMana(amount: number): boolean {
    if (this.mana >= amount) {
      this.mana -= amount;
      return true;
    }
    return false;
  }

  restoreMana(amount: number) {
    this.mana = Math.min(this.maxMana, this.mana + amount);
  }
}
