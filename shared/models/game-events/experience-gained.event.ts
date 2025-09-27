import { BaseGameEvent } from "./base.event";

import { SkillExperience } from "../skill/skill-experience.model";

export interface ExperienceGainedEvent extends BaseGameEvent {
  data: {
    experienceGains: SkillExperience;
  };
}
