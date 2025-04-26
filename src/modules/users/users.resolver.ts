import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../../graphql';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('findUserById')
  findPost(@Args({ name: 'id', type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }

  @Query('users')
  users() {
    return this.usersService.findAll();
  }

  @ResolveField('name')
  name(@Parent() user: User): any {
    return user.name;
  }
}
