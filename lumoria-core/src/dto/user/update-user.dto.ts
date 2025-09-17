import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class PlayerPositionDto {
  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;

  @IsString()
  region!: string;
}

class GameProgressDto {
  @IsOptional()
  @IsString()
  currentRegion?: string;

  @IsOptional()
  @IsString({ each: true })
  discoveredLocations?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PlayerPositionDto)
  playerPosition?: PlayerPositionDto;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  level?: number;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => GameProgressDto)
  gameProgress?: GameProgressDto;
}
