import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolePermissionsService } from './role-permissions.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { BulkAssignPermissionsDto } from './dto/bulk-assign-permissions.dto';

@ApiTags('Role Permissions')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('roles/:roleId/permissions')
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Assign a permission to a role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({
    status: 201,
    description: 'Permission assigned successfully',
  })
  @ApiResponse({ status: 404, description: 'Role or Permission not found' })
  @ApiResponse({ status: 409, description: 'Permission already assigned' })
  assignPermission(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    return this.rolePermissionsService.assignPermission(
      roleId,
      assignPermissionDto,
    );
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Assign multiple permissions to a role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({
    status: 201,
    description: 'Permissions assigned successfully',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 400, description: 'Invalid permission IDs' })
  bulkAssignPermissions(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() bulkAssignDto: BulkAssignPermissionsDto,
  ) {
    return this.rolePermissionsService.bulkAssignPermissions(
      roleId,
      bulkAssignDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all permissions assigned to a role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'List of assigned permissions' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  getRolePermissions(@Param('roleId', ParseUUIDPipe) roleId: string) {
    return this.rolePermissionsService.getRolePermissions(roleId);
  }

  @Delete(':permissionId')
  @ApiOperation({ summary: 'Remove a permission from a role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiParam({ name: 'permissionId', description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Permission removed successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  removePermission(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('permissionId', ParseUUIDPipe) permissionId: string,
  ) {
    return this.rolePermissionsService.removePermission(roleId, permissionId);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove all permissions from a role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'All permissions removed successfully',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  removeAllPermissions(@Param('roleId', ParseUUIDPipe) roleId: string) {
    return this.rolePermissionsService.removeAllPermissions(roleId);
  }
}
