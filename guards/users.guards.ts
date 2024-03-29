import { CreateUserDto } from '../controllers/auth/dto/create-user.dto';
import { isInteger, isObject, isString, isStringArray } from './_base.guards';
import { UserFiltersDto } from '../controllers/users/dto/user-filters.dto';
import { LoginUserDto } from '../controllers/auth/dto/login-user.dto';
import { UpdateUserDto } from '../controllers/users/dto/update-user.dto';
import { UpdateUserRoleDto } from '../controllers/users/dto/update-user-role.dto';

export function isUserFiltersDto(input: any): input is UserFiltersDto {
	return (
		isObject(input) &&
		(('searchUsername' in input ? isString(input.searchUsername) : true) ||
			('roleIds' in input ? isStringArray(input.roleIds) : true))
	);
}

export function isCreateUserDto(input: any): input is CreateUserDto {
	return (
		isObject(input) &&
		'username' in input &&
		isString(input.username) &&
		'password' in input &&
		isString(input.password)
	);
}

export function isLoginUserDto(input: any): input is LoginUserDto {
	return (
		isObject(input) &&
		'username' in input &&
		isString(input.username) &&
		'password' in input &&
		isString(input.password)
	);
}

export function isUpdateUserDto(input: any): input is UpdateUserDto {
	return (
		isObject(input) &&
		(('username' in input && isString(input.username)) ||
			('password' in input && isString(input.password)))
	);
}

export function isUpdateUserRoleDto(input: any): input is UpdateUserRoleDto {
	return isObject(input) && 'roleId' in input && isInteger(input.roleId);
}
