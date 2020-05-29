import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  Unique,
  DefaultScope,
  Scopes
} from 'sequelize-typescript';

@DefaultScope(() => ({
  attributes: ['id', 'email', 'fname', 'lname', 'createdAt', 'updatedAt']
}))

@Scopes(() => ({
  full: {
    attributes: ['id', 'email', 'fname', 'lname', 'password', 'createdAt', 'updatedAt']
  }
}))
@Table
class User extends Model<User> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column
  email: string;

  @Column
  password: string;

  @Column
  fname: string;

  @Column
  lname: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

}

export default User;
