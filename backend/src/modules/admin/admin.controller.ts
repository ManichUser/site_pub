import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

/**
 * Point d'entrée du back-office. Les statistiques agrégées (utilisateurs
 * actifs, vidéos vues, gains distribués, revenus pub/boosts) seront
 * ajoutées ici au fur et à mesure, en s'appuyant sur les services des
 * autres modules plutôt qu'en dupliquant l'accès aux données.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  @Get('ping')
  ping() {
    return { status: 'ok' };
  }
}
