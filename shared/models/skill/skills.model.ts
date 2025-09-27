import { SkillName } from "../../enums/skill.enum";
import { Skill } from "./skill.model";

export type Skills = {
  [key in SkillName]: Skill;
};
