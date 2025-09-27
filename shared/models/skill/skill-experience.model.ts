import { SkillName } from "../../enums/skill.enum";
import { ExperienceSources } from "../../enums/experience-sources.enum";

export type SkillExperience = {
  [key in SkillName]?: {
    amount: number;
    source: ExperienceSources;
  };
};
