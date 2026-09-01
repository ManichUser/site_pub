import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class CreateViewingSessionDto {
  @IsString()
  adId: string;

  @IsInt()
  @Min(0)
  watchedSeconds: number;

  @IsOptional()
  @IsString()
  deviceFingerprint?: string;
}
