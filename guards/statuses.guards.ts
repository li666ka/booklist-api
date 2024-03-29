import { CreateStatusDto } from '../controllers/statuses/dto/create-status.dto';
import { isObject, isString } from './_base.guards';
import { UpdateStatusDto } from '../controllers/statuses/dto/update-status.dto';

export function isCreateStatusDto(input: any): input is CreateStatusDto {
	return isObject(input) && 'name' in input && isString(input.name);
}

export function isUpdateStatusDto(input: any): input is UpdateStatusDto {
	return isObject(input) && 'name' in input && isString(input.name);
}
