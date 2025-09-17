import { AppDataSource } from "../src/data-source";
import { Weapon, Item, Enemy } from "../src/entities";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

async function importWeapons() {
  const weaponRepo = AppDataSource.getRepository(Weapon);
  const dataDir = join(__dirname, "../data/weapons");
  const files = readdirSync(dataDir);

  for (const file of files) {
    const json = JSON.parse(readFileSync(join(dataDir, file), "utf8"));
    await weaponRepo.save(json);
  }
  console.log("Weapons imported!");
}

async function importItems() {
  const itemRepo = AppDataSource.getRepository(Item);
  const dataDir = join(__dirname, "../data/items");
  const files = readdirSync(dataDir);

  for (const file of files) {
    const json = JSON.parse(readFileSync(join(dataDir, file), "utf8"));
    await itemRepo.save(json);
  }
  console.log("Items imported!");
}

async function importEnemies() {
  const enemyRepo = AppDataSource.getRepository(Enemy);
  const dataDir = join(__dirname, "../data/enemies");
  const files = readdirSync(dataDir);

  for (const file of files) {
    const json = JSON.parse(readFileSync(join(dataDir, file), "utf8"));
    await enemyRepo.save(json);
  }
  console.log("Enemies imported!");
}

async function main() {
  await AppDataSource.initialize();
  console.log("Database initialized.");

  await importWeapons();
  await importItems();
  await importEnemies();

  await AppDataSource.destroy();
  console.log("Database connection closed.");
}

main().catch(console.error);
