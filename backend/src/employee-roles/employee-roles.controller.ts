import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeRolesService } from './employee-roles.service';
import { CreateEmployeeRoleDto } from './dto/create-employee-role.dto';
import { UpdateEmployeeRoleDto } from './dto/update-employee-role.dto';

@ApiTags('Employee Roles')
@Controller('employee-roles')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class EmployeeRolesController {
  constructor(private readonly employeeRolesService: EmployeeRolesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo phân công vai trò cho nhân viên' })
  @ApiResponse({
    status: 201,
    description: 'Phân công vai trò thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy nhân viên, cơ sở hoặc vai trò',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  create(@Body() createEmployeeRoleDto: CreateEmployeeRoleDto) {
    return this.employeeRolesService.create(createEmployeeRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả phân công vai trò' })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    description: 'Lọc theo ID nhân viên',
  })
  @ApiQuery({
    name: 'propertyId',
    required: false,
    description: 'Lọc theo ID cơ sở',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách phân công vai trò',
  })
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('propertyId') propertyId?: string,
  ) {
    if (employeeId) {
      return this.employeeRolesService.findByEmployee(employeeId);
    }
    if (propertyId) {
      return this.employeeRolesService.findByProperty(propertyId);
    }
    return this.employeeRolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin phân công vai trò theo ID' })
  @ApiParam({ name: 'id', description: 'ID của phân công vai trò' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin phân công vai trò',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy phân công vai trò',
  })
  findOne(@Param('id') id: string) {
    return this.employeeRolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật phân công vai trò' })
  @ApiParam({ name: 'id', description: 'ID của phân công vai trò' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy phân công vai trò',
  })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeRoleDto: UpdateEmployeeRoleDto,
  ) {
    return this.employeeRolesService.update(id, updateEmployeeRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phân công vai trò' })
  @ApiParam({ name: 'id', description: 'ID của phân công vai trò' })
  @ApiResponse({
    status: 200,
    description: 'Xóa thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy phân công vai trò',
  })
  remove(@Param('id') id: string) {
    return this.employeeRolesService.remove(id);
  }
}
